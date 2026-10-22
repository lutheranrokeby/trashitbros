'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

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
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
  updateField: (key: string, value: string) => Promise<void>;
  publishPage: () => Promise<boolean>;
  revertPage: (revisionId?: string) => Promise<boolean>;
  refreshContent: (pageSlug?: string) => Promise<void>;
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
  }, [checkAuth, pathname]);

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
    // Optimistic local update
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
        toggleEditMode,
        setEditMode,
        updateField,
        publishPage,
        revertPage,
        refreshContent,
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
