'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from './CMSContext';
import { MediaLibraryModal } from './MediaLibraryModal';
import {
  Edit3,
  Eye,
  UploadCloud,
  RotateCcw,
  LayoutDashboard,
  LogOut,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export function CMSBar() {
  const pathname = usePathname();
  const {
    user,
    loading,
    isEditMode,
    toggleEditMode,
    hasUnpublishedChanges,
    publishPage,
    revertPage,
    isPublishing,
    isSaving,
    openMediaPicker,
    logout,
  } = useCMS();

  const [publishSuccess, setPublishSuccess] = useState(false);

  // Do not render CMSBar on admin dashboard pages or if unauthenticated
  if (loading || !user || (pathname && pathname.startsWith('/admin'))) return null;

  const handlePublish = async () => {
    const success = await publishPage();
    if (success) {
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    }
  };

  const handleRevert = async () => {
    if (confirm('Discard unpublished changes on this page and revert to the live published version?')) {
      await revertPage();
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-near-black/95 backdrop-blur-md border-b border-steel-grey/80 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
        {/* Left: Status & Mode toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-charcoal border border-steel-grey">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-gray-200">{user.name}</span>
            <span className="text-[10px] uppercase tracking-wider text-safety-orange font-bold">
              ({user.role})
            </span>
          </div>

          <button
            onClick={toggleEditMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-montserrat font-bold transition-all shadow-sm ${
              isEditMode
                ? 'bg-safety-orange text-white hover:bg-orange-hover ring-2 ring-safety-orange/50'
                : 'bg-steel-grey/60 hover:bg-steel-grey text-gray-200'
            }`}
          >
            {isEditMode ? (
              <>
                <Edit3 className="w-3.5 h-3.5" /> EDITING MODE ACTIVE
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> PREVIEW MODE
              </>
            )}
          </button>

          {/* Status badge */}
          {hasUnpublishedChanges ? (
            <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded text-[11px]">
              <AlertCircle className="w-3 h-3" /> Unsaved / Draft
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px]">
              <CheckCircle2 className="w-3 h-3" /> Published Live
            </span>
          )}

          {isSaving && (
            <span className="text-gray-400 flex items-center gap-1 text-[11px]">
              <Loader2 className="w-3 h-3 animate-spin text-safety-orange" /> Saving draft...
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {hasUnpublishedChanges && (
            <button
              onClick={handleRevert}
              title="Discard draft and revert to published version"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-charcoal hover:bg-red-950/40 text-gray-300 hover:text-red-400 border border-steel-grey transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Discard
            </button>
          )}

          <button
            onClick={() => openMediaPicker(() => {})}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-charcoal hover:bg-steel-grey text-gray-200 border border-steel-grey transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-safety-orange" /> Media Library
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing || !hasUnpublishedChanges}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-montserrat font-bold transition-all ${
              hasUnpublishedChanges
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                : 'bg-steel-grey/40 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...
              </>
            ) : publishSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Published!
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" /> Publish Live
              </>
            )}
          </button>

          <Link
            href="/admin"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-charcoal hover:bg-steel-grey text-gray-200 border border-steel-grey transition-colors ml-1"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-safety-orange" /> Dashboard
          </Link>

          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 rounded bg-charcoal hover:bg-red-950/40 text-gray-400 hover:text-red-400 border border-steel-grey transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {isEditMode && (
        <div className="sticky top-[45px] z-40 bg-safety-orange/15 border-b border-safety-orange/40 backdrop-blur text-safety-orange px-4 py-1.5 text-center text-xs font-montserrat font-semibold flex items-center justify-center gap-2">
          <Edit3 className="w-3.5 h-3.5 animate-pulse shrink-0" />
          <span>INLINE EDITING ACTIVE — Click any highlighted element on the page to edit in place. Changes auto-save as drafts. Click &quot;Publish Live&quot; when ready.</span>
        </div>
      )}
      <MediaLibraryModal />
    </>
  );
}
