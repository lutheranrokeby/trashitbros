'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Check, Copy } from 'lucide-react';
import { MediaFile } from '@/lib/cms/types';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/cms/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('/api/cms/media', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const item = await res.json();
        setMedia((prev) => [item, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this image?')) return;
    try {
      const res = await fetch(`/api/cms/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-steel-grey/60">
        <div>
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange">
            ASSET MANAGEMENT
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            MEDIA LIBRARY ({media.length})
          </h1>
        </div>

        <label className="cursor-pointer bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-2.5 rounded transition-colors shadow flex items-center gap-2">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-charcoal border border-steel-grey rounded-lg overflow-hidden flex flex-col justify-between group shadow-lg"
          >
            <div className="relative aspect-video bg-near-black overflow-hidden flex items-center justify-center">
              <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
            </div>

            <div className="p-3 bg-near-black/70">
              <span className="text-[11px] text-white truncate block font-mono">
                {item.filename}
              </span>
              <span className="text-[10px] text-gray-400 block mb-2">
                {Math.round(item.size / 1024)} KB
              </span>

              <div className="flex items-center justify-between pt-1 border-t border-steel-grey/40">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="text-[11px] text-gray-300 hover:text-safety-orange flex items-center gap-1"
                >
                  {copiedUrl === item.url ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy URL
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
