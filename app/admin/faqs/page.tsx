'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import { FAQItem } from '@/lib/cms/types';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/cms/faqs');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.sort((a: FAQItem, b: FAQItem) => a.order - b.order));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/cms/faqs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaq),
      });

      if (res.ok) {
        await fetchFaqs();
        setEditingFaq(null);
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/cms/faqs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
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
            KNOWLEDGE BASE
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            MANAGE FAQS ({faqs.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingFaq({
              id: '',
              question: '',
              answer: '',
              category: 'General',
              order: faqs.length + 1,
              published: true,
            });
          }}
          className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-2.5 rounded transition-colors shadow"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl flex items-start justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-near-black text-safety-orange border border-steel-grey/60">
                  {faq.category}
                </span>
                <span className="text-xs text-gray-500 font-mono">#{faq.order}</span>
              </div>
              <h3 className="font-montserrat font-bold text-base text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingFaq(faq);
                }}
                className="p-1.5 rounded bg-near-black hover:bg-steel-grey text-gray-300 hover:text-white"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-1.5 rounded bg-near-black hover:bg-red-950 text-gray-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSave}
            className="bg-charcoal border border-steel-grey rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-steel-grey pb-3">
              <h3 className="font-bebas text-3xl text-white">
                {isCreating ? 'NEW FAQ' : 'EDIT FAQ'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingFaq(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Question
              </label>
              <input
                type="text"
                required
                value={editingFaq.question}
                onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Category
              </label>
              <select
                value={editingFaq.category}
                onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value as any })}
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              >
                <option value="General">General</option>
                <option value="Pricing">Pricing</option>
                <option value="Site Access">Site Access</option>
                <option value="Materials">Materials</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Answer
              </label>
              <textarea
                rows={4}
                required
                value={editingFaq.answer}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editingFaq.order}
                  onChange={(e) => setEditingFaq({ ...editingFaq, order: parseInt(e.target.value) || 1 })}
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="faq-published"
                  checked={editingFaq.published}
                  onChange={(e) => setEditingFaq({ ...editingFaq, published: e.target.checked })}
                  className="w-4 h-4 accent-safety-orange rounded"
                />
                <label htmlFor="faq-published" className="text-xs font-montserrat font-medium text-gray-300 cursor-pointer">
                  Published live
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel-grey">
              <button
                type="button"
                onClick={() => setEditingFaq(null)}
                className="px-4 py-2 text-xs font-montserrat font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-safety-orange hover:bg-orange-hover text-white px-5 py-2 rounded text-xs font-montserrat font-bold uppercase"
              >
                Save FAQ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
