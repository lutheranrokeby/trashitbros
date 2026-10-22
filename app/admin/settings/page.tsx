'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '@/lib/cms/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/cms/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <div className="text-sm text-gray-400">Loading settings...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-steel-grey/60">
        <div>
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange">
            CONFIGURATION
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            SITE SETTINGS
          </h1>
        </div>

        {success && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950 px-3 py-1.5 rounded border border-emerald-800">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-charcoal border border-steel-grey rounded-xl p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
              Primary Brand Headline
            </label>
            <input
              type="text"
              value={settings.primaryHeadline}
              onChange={(e) => setSettings({ ...settings, primaryHeadline: e.target.value })}
              className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
              Public Phone Number
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
              Public Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
              Service Area Description
            </label>
            <input
              type="text"
              value={settings.serviceArea}
              onChange={(e) => setSettings({ ...settings, serviceArea: e.target.value })}
              className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
              Business Hours
            </label>
            <input
              type="text"
              value={settings.hours}
              onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
              className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
              Quote Notification Recipient Email
            </label>
            <input
              type="email"
              value={settings.notificationEmail}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-steel-grey flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-6 py-3 rounded transition-colors shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
