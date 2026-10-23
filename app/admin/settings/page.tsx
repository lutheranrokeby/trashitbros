'use client';

import React, { useState, useEffect } from 'react';
import { useCMS } from '@/components/cms/CMSContext';
import { Settings, Save, Image as ImageIcon, CheckCircle2, Eye, EyeOff, Layout, Navigation, AlertCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/cms/types';

interface SectionDef {
  key: string;
  name: string;
  page: string;
  description: string;
  affectsNav?: string;
}

const sectionDefinitions: SectionDef[] = [
  {
    key: 'home_projects',
    name: 'Home: Featured Projects (Before & After)',
    page: 'Home Page',
    description: 'Displays the before/after interactive image slider. Disabling this also hides "Our Work" from all navbars.',
    affectsNav: 'Our Work link in Header & Footer',
  },
  {
    key: 'nav_our_work',
    name: 'Navigation: "Our Work" Navbar & Footer Links',
    page: 'Global Navigation',
    description: 'Header and Footer links to /our-work portfolio page.',
  },
  {
    key: 'home_services',
    name: 'Home: Services Overview Grid',
    page: 'Home Page',
    description: 'The 4-service overview cards on the main landing page.',
  },
  {
    key: 'home_offer',
    name: 'Home: Special Offer Promotion ($99+)',
    page: 'Home Page',
    description: 'Promotional banner card linking to the /offers/initial-offer landing page.',
  },
  {
    key: 'home_process',
    name: 'Home: How It Works (4 Steps)',
    page: 'Home Page',
    description: 'The 4-step workflow (Quote -> Arrive -> Take It -> Clean Site).',
  },
  {
    key: 'home_why',
    name: 'Home: Why Choose Us',
    page: 'Home Page',
    description: 'The 4 value proposition cards (Reliable, Heavy Lifting, Transparent, Responsible).',
  },
  {
    key: 'home_testimonials',
    name: 'Home: Customer Testimonials',
    page: 'Home Page',
    description: 'Client reviews and Google rating badge on homepage.',
  },
  {
    key: 'home_features',
    name: 'Home: Key Highlights Strip',
    page: 'Home Page',
    description: 'Under-hero banner highlighting 24/7 service, all site sizes, etc.',
  },
  {
    key: 'home_about',
    name: 'Home: About Us Overview',
    page: 'Home Page',
    description: 'Introductory preview of Trash It Bros philosophy and team.',
  },
  {
    key: 'home_cta',
    name: 'Home: Bottom Call To Action',
    page: 'Home Page',
    description: 'Full-width closing call to action strip before the footer.',
  },
  {
    key: 'our_work_gallery',
    name: 'Our Work: Project Showcase Gallery',
    page: 'Our Work Page (/our-work)',
    description: 'All before-and-after comparison cards on the portfolio page.',
  },
  {
    key: 'about_story',
    name: 'About: Our Philosophy & Story',
    page: 'About Page (/about)',
    description: 'The story and mission block on the about page.',
  },
  {
    key: 'about_values',
    name: 'About: Core Values & Standards',
    page: 'About Page (/about)',
    description: 'Reliability, Safety, Straightforward Rates, and Clean Results.',
  },
  {
    key: 'services_list',
    name: 'Services: Tailored Solutions Grid',
    page: 'Services Page (/services)',
    description: 'Detailed cards for construction, renovation, commercial, and general rubbish.',
  },
  {
    key: 'services_guidelines',
    name: 'Services: Acceptable Waste Guidelines',
    page: 'Services Page (/services)',
    description: 'Accepted materials vs excluded hazardous waste columns.',
  },
  {
    key: 'faq_list',
    name: 'FAQ: Question Accordions',
    page: 'FAQ Page (/faq)',
    description: 'Categorized accordions for pricing, site access, and materials.',
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { openMediaPicker } = useCMS();

  useEffect(() => {
    fetch('/api/cms/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(console.error);
  }, []);

  const handleToggleSection = (key: string) => {
    if (!settings) return;
    const currentHidden = !!settings.hiddenSections?.[key];
    const newHidden = !currentHidden;
    const updated = {
      ...(settings.hiddenSections || {}),
      [key]: newHidden,
    };

    // If toggling home_projects, sync nav_our_work too
    if (key === 'home_projects') {
      updated.nav_our_work = newHidden;
    }

    setSettings({
      ...settings,
      hiddenSections: updated,
    });
  };

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

  const hiddenSections = settings.hiddenSections || {};

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between pb-6 border-b border-steel-grey/60">
        <div>
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange">
            CONFIGURATION & VISIBILITY
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section Visibility Controls */}
        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-steel-grey/60">
            <div>
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-safety-orange" />
                <h2 className="font-montserrat font-bold text-base text-white uppercase tracking-wider">
                  Section & Navigation Visibility
                </h2>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                When a section is marked <strong>Hidden</strong>, it is completely excluded from the public website DOM and production builds.
              </p>
            </div>
            <div className="text-xs text-gray-400">
              <span className="text-amber-400 font-bold">
                {Object.values(hiddenSections).filter(Boolean).length}
              </span>{' '}
              section(s) hidden
            </div>
          </div>

          <div className="divide-y divide-steel-grey/40">
            {sectionDefinitions.map((sec) => {
              const isHidden = !!hiddenSections[sec.key];
              return (
                <div
                  key={sec.key}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-near-black/30 px-3 rounded transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-montserrat font-bold text-xs uppercase text-white">
                        {sec.name}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-near-black text-gray-400 border border-steel-grey/60">
                        {sec.page}
                      </span>
                      {sec.affectsNav && isHidden && (
                        <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                          {sec.affectsNav}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleSection(sec.key)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-montserrat font-bold uppercase transition-all ${
                        isHidden
                          ? 'bg-amber-950 text-amber-300 border border-amber-700 hover:bg-amber-900'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                      }`}
                    >
                      {isHidden ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          <span>Hidden (Excluded)</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Visible (Included)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Brand Logo & Browser Tab Icon (Favicon) */}
        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-l-2 border-safety-orange pl-3">
            <ImageIcon className="w-5 h-5 text-safety-orange" />
            <h2 className="font-montserrat font-bold text-base text-white uppercase tracking-wider">
              Brand Logo & Site Icon (Favicon)
            </h2>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Configure the brand logo displayed in the header and navigation bars. This image is also automatically configured as the <strong>site icon (favicon in browser tabs)</strong> across all pages.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-44 h-24 bg-near-black border border-steel-grey rounded-xl p-3 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              <img
                src={settings.logoUrl || '/brand/logo-header-transparent.png'}
                alt="Brand Logo Preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
                  Logo / Icon Image Path or URL
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={settings.logoUrl || ''}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="/brand/logo-header-transparent.png"
                    className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => setSettings({ ...settings, logoUrl: url }))}
                    className="px-4 py-2.5 rounded bg-near-black hover:bg-steel-grey/60 border border-steel-grey text-xs font-montserrat font-bold uppercase whitespace-nowrap text-safety-orange transition-colors"
                  >
                    Media Library
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-gray-400">
                Transparent PNG or SVG images look best on dark navigation headers and browser tabs.
              </p>
            </div>
          </div>
        </div>

        {/* General Business Information */}
        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="font-montserrat font-bold text-base text-white uppercase tracking-wider mb-4 border-l-2 border-safety-orange pl-3">
            Company & Contact Information
          </h2>

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
              className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-8 py-3.5 rounded transition-colors shadow-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Changes...' : 'Save All Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
