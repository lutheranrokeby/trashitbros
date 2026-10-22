'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Camera,
  X,
  FileText,
  Trash2,
  Save,
} from 'lucide-react';
import { QuoteEnquiry, QuoteStatus } from '@/lib/cms/types';

const statusList: QuoteStatus[] = ['New', 'Contacted', 'Quoted', 'Won', 'Lost', 'Completed'];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<QuoteEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<QuoteEnquiry | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: QuoteStatus) => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNotes(true);
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedEnquiry.id, internalNotes: notesDraft }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, internalNotes: notesDraft } : e))
        );
        setSelectedEnquiry({ ...selectedEnquiry, internalNotes: notesDraft });
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesFilter = activeStatusFilter === 'All' || e.status === activeStatusFilter;
    const matchesSearch =
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.siteAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-steel-grey/60">
        <div>
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange">
            LEAD MANAGEMENT
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            QUOTE ENQUIRIES ({enquiries.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/enquiries?format=csv"
            download
            className="flex items-center gap-2 bg-charcoal hover:bg-steel-grey text-gray-200 border border-steel-grey px-4 py-2.5 rounded text-xs font-montserrat font-bold uppercase transition-colors"
          >
            <Download className="w-4 h-4 text-safety-orange" /> Export to CSV
          </a>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-charcoal p-4 rounded-xl border border-steel-grey">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', ...statusList].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatusFilter(st)}
              className={`px-3 py-1.5 rounded text-xs font-montserrat font-bold uppercase transition-all ${
                activeStatusFilter === st
                  ? 'bg-safety-orange text-white shadow'
                  : 'bg-near-black text-gray-300 hover:bg-steel-grey/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search reference, name, phone, suburb..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-near-black border border-steel-grey rounded px-3 py-2 pl-9 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-safety-orange"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-charcoal border border-steel-grey rounded-xl overflow-hidden shadow-xl">
        {filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            No quote enquiries match your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-near-black text-gray-400 uppercase font-montserrat border-b border-steel-grey/60">
                <tr>
                  <th className="px-6 py-3.5">Ref / Date</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Service & Waste</th>
                  <th className="px-6 py-3.5">Site Address</th>
                  <th className="px-6 py-3.5">Photos</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-grey/40 text-gray-300">
                {filteredEnquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => {
                      setSelectedEnquiry(enq);
                      setNotesDraft(enq.internalNotes || '');
                    }}
                    className={`cursor-pointer transition-colors ${
                      selectedEnquiry?.id === enq.id ? 'bg-near-black' : 'hover:bg-near-black/50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-safety-orange block">
                        {enq.reference}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(enq.createdAt).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-white block">{enq.fullName}</span>
                      <span className="text-[11px] text-gray-400 block">{enq.customerType}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-gray-200 block font-medium">{enq.service}</span>
                      <span className="text-[11px] text-gray-400 block line-clamp-1">{enq.wasteType}</span>
                    </td>

                    <td className="px-6 py-4 max-w-[200px] truncate">{enq.siteAddress}</td>

                    <td className="px-6 py-4">
                      {enq.photos && enq.photos.length > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-near-black border border-steel-grey px-2 py-0.5 rounded text-[11px] text-safety-orange font-bold">
                          <Camera className="w-3 h-3" /> {enq.photos.length} photos
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-[11px] bg-near-black/70 border border-steel-grey/60 px-2 py-0.5 rounded font-medium">
                          No photos provided
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as QuoteStatus)}
                        className={`bg-near-black border rounded px-2.5 py-1 text-[11px] font-bold uppercase focus:outline-none ${
                          enq.status === 'New'
                            ? 'border-amber-600 text-amber-400'
                            : enq.status === 'Quoted'
                            ? 'border-blue-600 text-blue-400'
                            : enq.status === 'Won' || enq.status === 'Completed'
                            ? 'border-emerald-600 text-emerald-400'
                            : 'border-steel-grey text-gray-300'
                        }`}
                      >
                        {statusList.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnquiry(enq);
                          setNotesDraft(enq.internalNotes || '');
                        }}
                        className="text-safety-orange hover:text-white font-bold"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Enquiry Detail Modal / Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-charcoal border border-steel-grey rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-steel-grey/60">
              <div>
                <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange">
                  Quote Details
                </span>
                <h2 className="font-mono text-2xl font-bold text-white mt-1">
                  {selectedEnquiry.reference}
                </h2>
                <span className="text-xs text-gray-400">
                  Received {new Date(selectedEnquiry.createdAt).toLocaleString('en-AU')}
                </span>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-near-black p-4 rounded-lg border border-steel-grey/60 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">Customer Name</span>
                <span className="text-white font-bold text-sm block">{selectedEnquiry.fullName}</span>
                {selectedEnquiry.customerType && (
                  <span className="text-safety-orange font-semibold">{selectedEnquiry.customerType}</span>
                )}
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Contact Details</span>
                {selectedEnquiry.phone ? (
                  <span className="text-white block font-medium">📞 {selectedEnquiry.phone}</span>
                ) : (
                  <span className="text-gray-500 block italic">No phone provided</span>
                )}
                {selectedEnquiry.email ? (
                  <span className="text-gray-300 block">✉️ {selectedEnquiry.email}</span>
                ) : (
                  <span className="text-gray-500 block italic">No email provided</span>
                )}
              </div>
              {selectedEnquiry.siteAddress && (
                <div>
                  <span className="text-gray-400 block mb-0.5">Site Location</span>
                  <span className="text-white font-medium">{selectedEnquiry.siteAddress}</span>
                </div>
              )}
              {selectedEnquiry.service && (
                <div>
                  <span className="text-gray-400 block mb-0.5">Service Requested</span>
                  <span className="text-white font-medium">{selectedEnquiry.service}</span>
                </div>
              )}
              {selectedEnquiry.wasteType && (
                <div>
                  <span className="text-gray-400 block mb-0.5">Waste Type</span>
                  <span className="text-white">{selectedEnquiry.wasteType}</span>
                </div>
              )}
              <div>
                <span className="text-gray-400 block mb-0.5">Photos Submitted</span>
                <span className="text-white">
                  {selectedEnquiry.photos && selectedEnquiry.photos.length > 0
                    ? `${selectedEnquiry.photos.length} photo(s)`
                    : 'No photos provided'}
                </span>
              </div>
            </div>

            {/* Additional details */}
            {selectedEnquiry.additionalDetails && (
              <div className="p-4 rounded bg-near-black/60 border border-steel-grey/50">
                <span className="text-xs font-bold uppercase text-gray-400 block mb-1">
                  Customer Notes:
                </span>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {selectedEnquiry.additionalDetails}
                </p>
              </div>
            )}

            {/* Photos Lightbox Section */}
            <div>
              <h4 className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange mb-3">
                Rubbish Photos
              </h4>
              {selectedEnquiry.photos && selectedEnquiry.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedEnquiry.photos.map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxImage(photo)}
                      className="aspect-square rounded border border-steel-grey overflow-hidden cursor-pointer hover:border-safety-orange transition-colors relative group"
                    >
                      <img src={photo} alt={`Waste photo ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                        Enlarge Photo
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-near-black border border-steel-grey/60 text-xs text-gray-300 flex items-center gap-2.5">
                  <span className="text-gray-400 bg-charcoal px-2.5 py-1 rounded border border-steel-grey/60 font-semibold text-[11px]">
                    No photos provided
                  </span>
                  <span className="text-gray-400">Customer will discuss details directly.</span>
                </div>
              )}
            </div>

            {/* Internal Admin Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-gray-300">
                  Internal Notes & Quoted Price:
                </span>
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="flex items-center gap-1.5 bg-safety-orange hover:bg-orange-hover text-white text-xs font-montserrat font-bold uppercase px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
              <textarea
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Enter quote amount, crew assigned, collection notes, or follow-up details..."
                className="w-full bg-near-black border border-steel-grey rounded p-3 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            {/* Footer controls */}
            <div className="flex items-center justify-between pt-4 border-t border-steel-grey/60">
              <button
                onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" /> Delete Record
              </button>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="bg-steel-grey hover:bg-steel-grey/80 text-white font-montserrat font-bold text-xs uppercase px-5 py-2 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={lightboxImage} alt="Enlarged waste photo" className="max-w-full max-h-[85vh] object-contain rounded" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-2 right-2 bg-charcoal text-white p-2 rounded-full border border-steel-grey"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
