'use client';

import React from 'react';
import { useCMS } from './CMSContext';
import { Eye, EyeOff } from 'lucide-react';

interface CMSSectionProps {
  sectionKey: string;
  label: string;
  children: React.ReactNode;
  initialHidden?: boolean;
}

export function CMSSection({
  sectionKey,
  label,
  children,
  initialHidden,
}: CMSSectionProps) {
  const { isEditMode, hiddenSections, toggleSectionVisibility } = useCMS();

  // If hiddenSections has a value, use it. Otherwise fallback to initialHidden.
  const isHidden = hiddenSections[sectionKey] !== undefined
    ? !!hiddenSections[sectionKey]
    : !!initialHidden;

  // Public visitor / non-edit mode: if hidden, render nothing (completely excluded from DOM and static builds)
  if (isHidden && !isEditMode) {
    return null;
  }

  // Admin in edit mode: if hidden, show notice banner with an unhide button
  if (isHidden && isEditMode) {
    return (
      <section className="relative my-8 px-4 max-w-site mx-auto">
        <div className="border-2 border-dashed border-amber-500/70 bg-amber-950/40 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-amber-300">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
              <EyeOff className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-montserrat font-bold text-xs uppercase tracking-wider text-amber-300">
                  Hidden Section: {label}
                </span>
                <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  Excluded from build
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 mt-0.5">
                This section is currently hidden from public visitors and excluded from the public website.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleSectionVisibility(sectionKey)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-montserrat font-bold text-xs uppercase px-4 py-2.5 rounded shadow-lg transition-colors whitespace-nowrap"
          >
            <Eye className="w-4 h-4" /> Unhide Section
          </button>
        </div>
      </section>
    );
  }

  // Admin in edit mode: if visible, render children with an admin toggle control button
  if (isEditMode) {
    return (
      <div className="relative group/cms-section">
        <div className="absolute top-3 right-4 z-30 opacity-60 hover:opacity-100 group-hover/cms-section:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => toggleSectionVisibility(sectionKey)}
            title={`Hide "${label}" section from public build`}
            className="flex items-center gap-1.5 bg-near-black/90 hover:bg-red-950 text-gray-300 hover:text-red-300 border border-steel-grey hover:border-red-600/70 font-montserrat text-[11px] font-bold uppercase px-3 py-1.5 rounded shadow-xl backdrop-blur transition-all"
          >
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Hide Section</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  // Normal public render when visible
  return <>{children}</>;
}
