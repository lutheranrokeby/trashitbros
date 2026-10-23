'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Home,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  X,
  Phone,
  MapPin,
  BadgeDollarSign,
} from 'lucide-react';
import { OfferItem } from '@/lib/cms/types';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/cms/offers');
      if (res.ok) {
        const data = await res.json();
        setOffers(data || []);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleHome = async (offer: OfferItem) => {
    // If activating on home, make sure this offer is active and others are deactivated
    const updated = offers.map((o) => {
      if (o.id === offer.id) {
        return { ...o, showOnHome: !o.showOnHome };
      }
      // If turning this one on, turn others off so only 1 offer is featured on home
      if (!offer.showOnHome) {
        return { ...o, showOnHome: false };
      }
      return o;
    });

    setOffers(updated);
    try {
      const res = await fetch('/api/cms/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        notify(`Homepage offer status updated!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLanding = async (offer: OfferItem) => {
    const updated = offers.map((o) =>
      o.id === offer.id ? { ...o, landingPageEnabled: !o.landingPageEnabled } : o
    );
    setOffers(updated);
    try {
      const res = await fetch('/api/cms/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        notify(`Landing page access updated for "${offer.headline}"`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    setSaving(true);

    try {
      let updatedList: OfferItem[];
      if (isNew) {
        updatedList = [...offers, editingOffer];
      } else {
        updatedList = offers.map((o) => (o.id === editingOffer.id ? editingOffer : o));
      }

      const res = await fetch('/api/cms/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });

      if (res.ok) {
        setOffers(updatedList);
        setEditingOffer(null);
        setIsNew(false);
        notify(isNew ? 'New promotional offer created!' : 'Offer updated successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional offer?')) return;
    const updated = offers.filter((o) => o.id !== id);
    setOffers(updated);
    try {
      await fetch('/api/cms/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      notify('Offer deleted.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNew = () => {
    const newOffer: OfferItem = {
      id: `offer-${Date.now()}`,
      slug: `offer-${Date.now().toString().slice(-4)}`,
      badge: '',
      headline: 'RUBBISH REMOVAL',
      priceHighlight: 'FROM $99',
      hook: 'GOT RUBBISH, OLD FURNITURE, GREEN WASTE, OR A GARAGE THAT NEEDS CLEARING?',
      summary: 'We remove it, load it, dispose of it, and leave the area tidy.',
      serviceAreas: 'Serving the Sunshine Coast, Noosa, and Caboolture.',
      pricingNote: "Jobs from $99. Send us photos of what needs removing and we'll provide an upfront quote.",
      ctaText: 'CLAIM THIS OFFER NOW',
      phone: '0481 975 170',
      showOnHome: false,
      landingPageEnabled: true,
      published: true,
    };
    setEditingOffer(newOffer);
    setIsNew(true);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-steel-grey/60">
        <div>
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> PROMOTIONAL CAMPAIGNS
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            OFFER & LANDING PAGE MANAGEMENT
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {notification && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950 px-3 py-1.5 rounded border border-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" /> {notification}
            </span>
          )}

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-2.5 rounded transition-colors shadow-lg shadow-safety-orange/20"
          >
            <Plus className="w-4 h-4" /> Create New Offer
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-charcoal border border-steel-grey rounded-xl p-5 text-xs text-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-bold text-white block mb-0.5">Homepage & Landing Page Controls</span>
          Use the toggles below to choose which offer displays <strong>directly below the hero on the homepage</strong>, and whether each offer&apos;s standalone landing page at <code>/offers/[slug]</code> is publicly accessible.
        </div>
        <Link
          href="/"
          target="_blank"
          className="text-safety-orange hover:text-white font-montserrat font-bold text-xs uppercase whitespace-nowrap flex items-center gap-1"
        >
          View Live Homepage <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Offers Cards List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Loading promotional offers...</div>
      ) : offers.length === 0 ? (
        <div className="bg-charcoal border border-steel-grey rounded-xl p-12 text-center text-gray-400 space-y-4">
          <p className="text-sm">No promotional offers created yet.</p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 bg-safety-orange text-white font-montserrat font-bold text-xs uppercase px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> Create First Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {offers.map((offer) => {
            const isHomeActive = !!offer.showOnHome;
            const isLandingActive = !!offer.landingPageEnabled;

            return (
              <div
                key={offer.id}
                className="bg-charcoal border border-steel-grey rounded-xl p-6 sm:p-8 shadow-xl space-y-6"
              >
                {/* Header row: Badge, Headline, Statuses */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-steel-grey/60">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <span className="text-xs font-mono text-gray-400">
                        Route: <code className="text-gray-200">/offers/{offer.slug}</code>
                      </span>
                      <span className="text-[11px] font-bold font-montserrat uppercase px-2.5 py-0.5 rounded bg-safety-orange/15 text-safety-orange border border-safety-orange/30">
                        CTA: {offer.ctaText || 'CLAIM THIS OFFER NOW'}
                      </span>
                    </div>

                    <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-tight">
                      {offer.headline}{' '}
                      <span className="text-safety-orange">{offer.priceHighlight}</span>
                    </h2>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingOffer(offer);
                        setIsNew(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-near-black hover:bg-steel-grey/60 text-gray-200 border border-steel-grey font-montserrat font-bold text-xs uppercase transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-safety-orange" /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-2 rounded bg-near-black hover:bg-red-950/60 text-gray-400 hover:text-red-400 border border-steel-grey hover:border-red-800 transition-colors"
                      title="Delete offer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Offer Preview Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-near-black/70 border border-steel-grey/60 rounded-lg p-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Customer Hook (Speech Bubble)
                    </span>
                    <p className="text-gray-200 font-bebas text-base uppercase leading-tight">
                      &quot;{offer.hook}&quot;
                    </p>
                    <p className="text-gray-400 pt-1 border-t border-steel-grey/40">
                      {offer.summary}
                    </p>
                  </div>

                  <div className="bg-near-black/70 border border-steel-grey/60 rounded-lg p-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">
                      Target Service Areas & Pricing Note
                    </span>
                    <p className="text-gray-300 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-safety-orange" /> {offer.serviceAreas}
                    </p>
                    <p className="text-gray-400 pt-1 border-t border-steel-grey/40">
                      {offer.pricingNote}
                    </p>
                  </div>
                </div>

                {/* Controls Bar: Two Primary Toggles */}
                <div className="pt-4 border-t border-steel-grey/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Toggle: Active on Home */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleHome(offer)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-montserrat font-bold uppercase transition-all ${
                          isHomeActive
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 shadow'
                            : 'bg-near-black text-gray-400 border border-steel-grey hover:text-white'
                        }`}
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span>
                          {isHomeActive ? 'Active on Homepage (Below Hero)' : 'Inactive on Homepage'}
                        </span>
                      </button>
                    </div>

                    {/* Toggle: Landing Page Accessible */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleLanding(offer)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-montserrat font-bold uppercase transition-all ${
                          isLandingActive
                            ? 'bg-blue-950 text-blue-300 border border-blue-600 shadow'
                            : 'bg-near-black text-gray-400 border border-steel-grey hover:text-white'
                        }`}
                      >
                        {isLandingActive ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Landing Page: Accessible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-red-400" />
                            <span>Landing Page: Hidden (404)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Direct Link to landing page if accessible */}
                  {isLandingActive && (
                    <Link
                      href={`/offers/${offer.slug}`}
                      target="_blank"
                      className="text-xs font-montserrat font-bold text-safety-orange hover:text-white uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Landing Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-charcoal border border-steel-grey rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-steel-grey/60">
              <h2 className="font-bebas text-3xl text-white tracking-wide">
                {isNew ? 'CREATE NEW PROMOTIONAL OFFER' : 'EDIT PROMOTIONAL OFFER'}
              </h2>
              <button
                onClick={() => setEditingOffer(null)}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                    Offer Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingOffer.badge || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, badge: e.target.value })}
                    placeholder="Leave empty or enter custom tag"
                    className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingOffer.slug}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                      })
                    }
                    placeholder="e.g. initial-offer"
                    className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white font-mono focus:outline-none focus:border-safety-orange"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={editingOffer.headline}
                    onChange={(e) => setEditingOffer({ ...editingOffer, headline: e.target.value })}
                    placeholder="e.g. RUBBISH REMOVAL"
                    className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                    Price Highlight
                  </label>
                  <input
                    type="text"
                    value={editingOffer.priceHighlight}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, priceHighlight: e.target.value })
                    }
                    placeholder="e.g. FROM $99"
                    className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange font-bold text-safety-orange"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  Customer Hook (Speech Bubble Text)
                </label>
                <textarea
                  rows={2}
                  value={editingOffer.hook}
                  onChange={(e) => setEditingOffer({ ...editingOffer, hook: e.target.value })}
                  placeholder="GOT RUBBISH, OLD FURNITURE, GREEN WASTE, OR A GARAGE THAT NEEDS CLEARING?"
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  Summary / Inclusion Pitch
                </label>
                <input
                  type="text"
                  value={editingOffer.summary}
                  onChange={(e) => setEditingOffer({ ...editingOffer, summary: e.target.value })}
                  placeholder="We remove it, load it, dispose of it, and leave the area tidy."
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                    Service Areas
                  </label>
                  <input
                    type="text"
                    value={editingOffer.serviceAreas}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, serviceAreas: e.target.value })
                    }
                    placeholder="Serving the Sunshine Coast, Noosa, and Caboolture."
                    className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                    required
                  />
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={editingOffer.phone}
                    onChange={(e) => setEditingOffer({ ...editingOffer, phone: e.target.value })}
                    placeholder="0481 975 170"
                    className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                    CTA Button Text (Links to Form Section)
                  </label>
                  <input
                    type="text"
                    value={editingOffer.ctaText || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, ctaText: e.target.value })}
                    placeholder="e.g. CLAIM THIS OFFER NOW"
                    className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-safety-orange font-bold font-montserrat uppercase focus:outline-none focus:border-safety-orange"
                    required
                  />
                </div>
              </div>
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  Pricing Note
                </label>
                <input
                  type="text"
                  value={editingOffer.pricingNote}
                  onChange={(e) =>
                    setEditingOffer({ ...editingOffer, pricingNote: e.target.value })
                  }
                  placeholder="Jobs from $99. Send us photos of what needs removing and we'll provide an upfront quote."
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                  required
                />
              </div>

              <div className="pt-4 border-t border-steel-grey/60 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingOffer.showOnHome}
                      onChange={(e) =>
                        setEditingOffer({ ...editingOffer, showOnHome: e.target.checked })
                      }
                      className="rounded accent-safety-orange w-4 h-4"
                    />
                    <span>Active on Homepage (Below Hero)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingOffer.landingPageEnabled}
                      onChange={(e) =>
                        setEditingOffer({
                          ...editingOffer,
                          landingPageEnabled: e.target.checked,
                        })
                      }
                      className="rounded accent-safety-orange w-4 h-4"
                    />
                    <span>Landing Page Accessible</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingOffer(null)}
                    className="px-4 py-2.5 rounded text-xs font-montserrat font-bold uppercase text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-6 py-2.5 rounded transition-colors shadow-lg disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Offer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
