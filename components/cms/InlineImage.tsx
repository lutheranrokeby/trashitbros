'use client';

import React from 'react';
import { useCMS } from './CMSContext';
import { Camera } from 'lucide-react';

interface InlineImageProps {
  fieldKey: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function InlineImage({
  fieldKey,
  defaultSrc,
  alt,
  className = '',
  containerClassName = '',
}: InlineImageProps) {
  const { isEditMode, content, updateField, openMediaPicker, user } = useCMS();
  const currentSrc = content[fieldKey] || defaultSrc;

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode || !user || user.role === 'viewer') return;
    e.preventDefault();
    e.stopPropagation();
    openMediaPicker((newUrl: string) => {
      updateField(fieldKey, newUrl);
    });
  };

  if (!isEditMode || !user || user.role === 'viewer') {
    return <img src={currentSrc} alt={alt} className={className} />;
  }

  return (
    <div
      onClick={handleClick}
      title="Click to replace image from Media Library"
      className={`relative group inline-edit-outline cursor-pointer ${containerClassName}`}
    >
      <img src={currentSrc} alt={alt} className={className} />
      <div className="absolute inset-0 bg-safety-orange/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[2px] rounded z-20">
        <div className="bg-charcoal/90 px-3 py-1.5 rounded-full border border-safety-orange flex items-center gap-1.5 text-xs font-montserrat font-bold shadow-lg">
          <Camera className="w-3.5 h-3.5 text-safety-orange" /> Replace Image
        </div>
      </div>
    </div>
  );
}
