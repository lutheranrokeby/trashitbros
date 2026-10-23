'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { SiteSettings } from '@/lib/cms/types';

interface CMSUser {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  name: string;
}

interface CMSContextType {
  user: CMSUser | null;
  loading: boolean;
  isEditMode: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  content: Record<string, string>;
  isDraft: boolean;
  hasUnpublishedChanges: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  settings: SiteSettings | null;
  hiddenSections: Record<string, boolean>;
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
  updateField: (key: string, value: string) => Promise<void>;
  saveDraft: () => Promise<boolean>;
  publishPage: () => Promise<boolean>;
  revertPage: (revisionId?: string) => Promise<boolean>;
  refreshContent: (pageSlug?: string) => Promise<void>;
  refreshSettings: () => Promise<void>;
  toggleSectionVisibility: (sectionKey: string) => Promise<void>;
  isSectionHidden: (sectionKey: string) => boolean;
  openMediaPicker: (onSelect: (url: string) => void) => void;
  closeMediaPicker: () => void;
  mediaPickerOpen: boolean;
  mediaPickerCallback: ((url: string) => void) | null;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<CMSUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [content, setContent] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(false);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [hiddenSections, setHiddenSections] = useState<Record<string, boolean>>({
    home_projects: true,
    nav_our_work: true,
  });

  // Media Picker modal state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);

  // Check user session
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch page content
  const refreshContent = useCallback(async (slug?: string) => {
    const targetPage = slug || currentPage;
    try {
      const mode = isEditMode ? 'draft' : 'published';
      const res = await fetch(`/api/cms/content?page=${targetPage}&mode=${mode}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || {});
        setIsDraft(data.isDraft);
        setHasUnpublishedChanges(data.hasUnpublishedChanges);
      }
    } catch (err) {
      console.error('Failed to load content for page:', targetPage, err);
    }
  }, [currentPage, isEditMode]);

  // Fetch site settings (including hidden sections)
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        if (data && data.hiddenSections) {
          setHiddenSections(data.hiddenSections);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }, []);

  // Sync current page with pathname
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) return;
    const clean = pathname === '/' ? 'home' : pathname.replace(/^\//, '').replace(/\//g, '-');
    setCurrentPage(clean);
  }, [pathname]);

  // Set explicit edit mode with localStorage persistence
  const setEditMode = useCallback((enabled: boolean) => {
    setIsEditMode(enabled);
    if (typeof window !== 'undefined') {
      try {
        if (enabled) {
          localStorage.setItem('cms_edit_mode', 'true');
        } else {
          localStorage.removeItem('cms_edit_mode');
        }
      } catch {}
    }
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditMode(!isEditMode);
  }, [isEditMode, setEditMode]);

  useEffect(() => {
    checkAuth();
    refreshSettings();
  }, [checkAuth, refreshSettings, pathname]);

  // Dynamically update browser tab favicon if settings.logoUrl changes
  useEffect(() => {
    if (typeof document !== 'undefined' && settings?.logoUrl) {
      let iconLink = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.head.appendChild(iconLink);
      }
      iconLink.href = settings.logoUrl;

      let shortcutLink = document.querySelector<HTMLLinkElement>("link[rel~='shortcut']");
      if (!shortcutLink) {
        shortcutLink = document.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        document.head.appendChild(shortcutLink);
      }
      shortcutLink.href = settings.logoUrl;
    }
  }, [settings?.logoUrl]);

  // Read edit mode from URL (?edit=true) or localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === 'true') {
        setEditMode(true);
      } else {
        try {
          const saved = localStorage.getItem('cms_edit_mode');
          if (saved === 'true') {
            setIsEditMode(true);
          }
        } catch {}
      }
    }
  }, [pathname, setEditMode]);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  // Update a field in the draft
  const updateField = async (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setHasUnpublishedChanges(true);
    setIsSaving(true);
    try {
      await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: currentPage, key, value }),
      });
    } catch (err) {
      console.error('Failed to auto-save field:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Explicitly save current draft to Supabase
  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: currentPage, updates: content }),
      });
      if (res.ok) {
        setHasUnpublishedChanges(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save draft:', err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Publish current draft
  const publishPage = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch('/api/cms/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSlug: currentPage }),
      });
      if (res.ok) {
        setHasUnpublishedChanges(false);
        await refreshContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Publish error:', err);
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  // Revert draft back to published
  const revertPage = async (revisionId?: string) => {
    try {
      const res = await fetch('/api/cms/revert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageSlug: currentPage, revisionId }),
      });
      if (res.ok) {
        await refreshContent();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Revert error:', err);
      return false;
    }
  };

  // Toggle visibility of a section
  const toggleSectionVisibility = async (sectionKey: string) => {
    const isCurrentlyHidden = !!hiddenSections[sectionKey];
    const newHidden = !isCurrentlyHidden;
    const updated = {
      ...hiddenSections,
      [sectionKey]: newHidden,
    };
    // If hiding home_projects, also hide nav_our_work for convenience
    if (sectionKey === 'home_projects') {
      updated['nav_our_work'] = newHidden;
    }
    setHiddenSections(updated);

    try {
      await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hiddenSections: updated }),
      });
    } catch (err) {
      console.error('Failed to update hidden sections:', err);
    }
  };

  const isSectionHidden = (sectionKey: string) => {
    return !!hiddenSections[sectionKey];
  };

  const openMediaPicker = (onSelect: (url: string) => void) => {
    setMediaPickerCallback(() => onSelect);
    setMediaPickerOpen(true);
  };

  const closeMediaPicker = () => {
    setMediaPickerOpen(false);
    setMediaPickerCallback(null);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setEditMode(false);
    await refreshContent();
  };

  return (
    <CMSContext.Provider
      value={{
        user,
        loading,
        isEditMode,
        currentPage,
        setCurrentPage,
        content,
        isDraft,
        hasUnpublishedChanges,
        isSaving,
        isPublishing,
        settings,
        hiddenSections,
        toggleEditMode,
        setEditMode,
        updateField,
        saveDraft,
        publishPage,
        revertPage,
        refreshContent,
        refreshSettings,
        toggleSectionVisibility,
        isSectionHidden,
        openMediaPicker,
        closeMediaPicker,
        mediaPickerOpen,
        mediaPickerCallback,
        logout,
        checkAuth,
      }}
    >
      <div className={isEditMode ? 'edit-mode-active' : ''}>{children}</div>
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
