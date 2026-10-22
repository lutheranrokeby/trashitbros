'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCMS } from './CMSContext';
import { Edit3 } from 'lucide-react';

interface InlineTextProps {
  fieldKey: string;
  defaultValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
}

export function InlineText({
  fieldKey,
  defaultValue,
  as: Component = 'span',
  className = '',
  multiline = false,
}: InlineTextProps) {
  const { isEditMode, content, updateField, user } = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Sync value from CMS content
  useEffect(() => {
    if (content[fieldKey] !== undefined) {
      setValue(content[fieldKey]);
    } else {
      setValue(defaultValue);
    }
  }, [content, fieldKey, defaultValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== (content[fieldKey] ?? defaultValue)) {
      updateField(fieldKey, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setValue(content[fieldKey] ?? defaultValue);
      setIsEditing(false);
    }
  };

  // If user is not authorized or edit mode is off, render standard semantic tag
  if (!isEditMode || !user || user.role === 'viewer') {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${className} inline-editing-now bg-charcoal/90 text-white rounded p-1 w-full resize-y focus:outline-none`}
          rows={3}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} inline-editing-now bg-charcoal/90 text-white rounded px-2 py-0.5 focus:outline-none w-full max-w-full`}
      />
    );
  }

  return (
    <Component
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Click to edit directly in place"
      className={`${className} inline-edit-outline group relative inline-block`}
    >
      {value}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 right-0 bg-safety-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none flex items-center gap-1 z-30">
        <Edit3 className="w-2.5 h-2.5" /> Edit
      </span>
    </Component>
  );
}
