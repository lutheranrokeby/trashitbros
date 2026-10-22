'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { ServiceItem } from '@/lib/cms/types';
import Link from 'next/link';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/cms/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/cms/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      if (res.ok) {
        await fetchServices();
        setEditingService(null);
        setIsCreating(false);
      }
    } catch (err) {
      console.error('Failed to save service:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/cms/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
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
            SERVICE CATALOG
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            MANAGE SERVICES ({services.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingService({
              id: '',
              slug: '',
              name: '',
              shortDescription: '',
              fullDescription: '',
              heroImage: '/images/hero-truck.jpg',
              cardImage: '/images/service-construction.jpg',
              benefits: ['Timely waste clearing', 'Fast rubbish collection'],
              wasteExamples: ['General debris', 'Building materials'],
              order: services.length + 1,
              published: true,
            });
          }}
          className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-2.5 rounded transition-colors shadow"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-charcoal border border-steel-grey rounded-xl overflow-hidden shadow-xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="font-bebas text-3xl text-white">{service.name}</span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    service.published
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}
                >
                  {service.published ? 'Live' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{service.shortDescription}</p>
              <div className="text-[11px] text-gray-500 mb-4">
                Slug: <code className="text-safety-orange">/services/{service.slug}</code>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-steel-grey/60 pt-4">
              <Link
                href={`/services/${service.slug}`}
                className="text-xs text-gray-400 hover:text-white"
                target="_blank"
              >
                View Live Page ↗
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingService(service);
                  }}
                  className="p-1.5 rounded bg-near-black hover:bg-steel-grey text-gray-300 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-1.5 rounded bg-near-black hover:bg-red-950 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSave}
            className="bg-charcoal border border-steel-grey rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-steel-grey pb-3">
              <h3 className="font-bebas text-3xl text-white">
                {isCreating ? 'CREATE NEW SERVICE' : 'EDIT SERVICE'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Service Name
              </label>
              <input
                type="text"
                required
                value={editingService.name}
                onChange={(e) =>
                  setEditingService({ ...editingService, name: e.target.value })
                }
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={editingService.slug}
                onChange={(e) =>
                  setEditingService({ ...editingService, slug: e.target.value })
                }
                placeholder="construction-site-clean-ups"
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={editingService.shortDescription}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    shortDescription: e.target.value,
                  })
                }
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Full Description
              </label>
              <textarea
                rows={3}
                value={editingService.fullDescription}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    fullDescription: e.target.value,
                  })
                }
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Card Image URL
              </label>
              <input
                type="text"
                value={editingService.cardImage}
                onChange={(e) =>
                  setEditingService({ ...editingService, cardImage: e.target.value })
                }
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="srvPub"
                checked={editingService.published}
                onChange={(e) =>
                  setEditingService({ ...editingService, published: e.target.checked })
                }
                className="accent-safety-orange"
              />
              <label htmlFor="srvPub" className="text-xs text-gray-200">
                Published on live website
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel-grey">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-xs font-montserrat font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-safety-orange hover:bg-orange-hover text-white px-5 py-2 rounded text-xs font-montserrat font-bold uppercase"
              >
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
