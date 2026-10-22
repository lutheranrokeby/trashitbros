'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Edit, Trash2, X, Star } from 'lucide-react';
import { TestimonialItem } from '@/lib/cms/types';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/cms/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/cms/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial),
      });

      if (res.ok) {
        await fetchTestimonials();
        setEditingTestimonial(null);
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/cms/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-steel-grey/60">
        <div>
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange">
            SOCIAL PROOF
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            MANAGE TESTIMONIALS ({testimonials.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingTestimonial({
              id: '',
              name: '',
              role: 'Builder / Contractor',
              location: 'Sunshine Coast',
              content: '',
              rating: 5,
              featured: true,
              published: true,
            });
          }}
          className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-2.5 rounded transition-colors shadow"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-safety-orange">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-safety-orange" />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    t.published
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}
                >
                  {t.published ? 'Live' : 'Hidden'}
                </span>
              </div>
              <p className="text-xs text-gray-200 italic mb-4 leading-relaxed">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="border-t border-steel-grey/40 pt-3">
                <span className="font-montserrat font-bold text-xs text-white block">
                  {t.name}
                </span>
                <span className="text-[11px] text-gray-400">
                  {t.role} • {t.location}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-steel-grey/40 mt-4">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingTestimonial(t);
                }}
                className="p-1.5 rounded bg-near-black hover:bg-steel-grey text-gray-300 hover:text-white"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-1.5 rounded bg-near-black hover:bg-red-950 text-gray-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSave}
            className="bg-charcoal border border-steel-grey rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-steel-grey pb-3">
              <h3 className="font-bebas text-3xl text-white">
                {isCreating ? 'ADD TESTIMONIAL' : 'EDIT TESTIMONIAL'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Client Name / Attribution
              </label>
              <input
                type="text"
                required
                value={editingTestimonial.name}
                onChange={(e) =>
                  setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                }
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  Customer Role / Category
                </label>
                <input
                  type="text"
                  value={editingTestimonial.role}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, role: e.target.value })
                  }
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  Location / Suburb
                </label>
                <input
                  type="text"
                  value={editingTestimonial.location}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, location: e.target.value })
                  }
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Review Content
              </label>
              <textarea
                rows={3}
                required
                value={editingTestimonial.content}
                onChange={(e) =>
                  setEditingTestimonial({ ...editingTestimonial, content: e.target.value })
                }
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="testPub"
                checked={editingTestimonial.published}
                onChange={(e) =>
                  setEditingTestimonial({
                    ...editingTestimonial,
                    published: e.target.checked,
                  })
                }
                className="accent-safety-orange"
              />
              <label htmlFor="testPub" className="text-xs text-gray-200">
                Visible on public homepage
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel-grey">
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="px-4 py-2 text-xs font-montserrat font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-safety-orange hover:bg-orange-hover text-white px-5 py-2 rounded text-xs font-montserrat font-bold uppercase"
              >
                Save Testimonial
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
