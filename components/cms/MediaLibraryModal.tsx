'use client';

import React, { useState, useEffect } from 'react';
import { useCMS } from './CMSContext';
import { X, Upload, Check, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  alt: string;
  size: number;
}

export function MediaLibraryModal() {
  const { mediaPickerOpen, closeMediaPicker, mediaPickerCallback } = useCMS();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/cms/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    }
  };

  useEffect(() => {
    if (mediaPickerOpen) {
      fetchMedia();
    }
  }, [mediaPickerOpen]);

  if (!mediaPickerOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('alt', files[0].name);

    try {
      const res = await fetch('/api/cms/media', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const newMedia = await res.json();
        setMedia((prev) => [newMedia, ...prev]);
        setSelectedUrl(newMedia.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmSelect = () => {
    if (selectedUrl && mediaPickerCallback) {
      mediaPickerCallback(selectedUrl);
    }
    closeMediaPicker();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-charcoal border border-steel-grey rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-steel-grey bg-near-black">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-safety-orange" />
            <h3 className="font-montserrat font-bold text-lg text-white">Media Library</h3>
          </div>
          <button
            onClick={closeMediaPicker}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload bar */}
        <div className="p-4 border-b border-steel-grey/60 bg-charcoal/50 flex flex-wrap items-center justify-between gap-4">
          <label className="cursor-pointer bg-steel-grey hover:bg-steel-grey/80 text-white font-montserrat text-sm font-semibold px-4 py-2 rounded flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4 text-safety-orange" />
            {uploading ? 'Uploading...' : 'Upload New Image'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <span className="text-xs text-gray-400">
            Formats: JPEG, PNG, WebP • Max 10MB
          </span>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item) => {
            const isSelected = selectedUrl === item.url;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedUrl(item.url)}
                className={`relative group rounded border-2 transition-all cursor-pointer overflow-hidden aspect-video bg-black/40 flex items-center justify-center ${
                  isSelected
                    ? 'border-safety-orange ring-2 ring-safety-orange/50'
                    : 'border-steel-grey/50 hover:border-gray-400'
                }`}
              >
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-safety-orange text-white p-1 rounded-full shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-[11px] text-gray-300 truncate">
                  {item.filename}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-steel-grey bg-near-black flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {selectedUrl ? `Selected: ${selectedUrl.split('/').pop()}` : 'Select an image to use'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={closeMediaPicker}
              className="px-4 py-2 rounded text-sm font-montserrat font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelect}
              disabled={!selectedUrl}
              className="px-5 py-2 rounded text-sm font-montserrat font-bold bg-safety-orange text-white hover:bg-orange-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
