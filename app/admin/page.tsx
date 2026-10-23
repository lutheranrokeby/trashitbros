import React from 'react';
import Link from 'next/link';
import { readDatabase } from '@/lib/cms/db';
import {
  Layers,
  Briefcase,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  PlusCircle,
  Edit3,
  FileText,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  Tag,
  FormInput,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const db = readDatabase();

  const totalServices = db.services.length;
  const totalProjects = db.projects.length;
  const totalFaqs = db.faqs.length;
  const totalTestimonials = db.testimonials.length;
  const totalOffers = db.offers?.length || 0;
  const totalForms = db.forms?.length || 0;
  const hiddenSections = db.settings.hiddenSections || {};
  const hiddenCount = Object.values(hiddenSections).filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-steel-grey/60">
        <div>
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange">
            CMS CONTROL CENTER
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            DASHBOARD OVERVIEW
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/?edit=true"
            className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-2.5 rounded transition-colors shadow-lg shadow-safety-orange/20"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Live Website
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat font-bold uppercase text-gray-400">
              Promos & Offers
            </span>
            <div className="w-9 h-9 rounded-full bg-safety-orange/15 text-safety-orange flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mb-1">
            {totalOffers}
          </div>
          <span className="text-[11px] text-gray-400">
            Active landing pages & cards
          </span>
        </div>

        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat font-bold uppercase text-gray-400">
              Published Services
            </span>
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mb-1">
            {totalServices}
          </div>
          <span className="text-[11px] text-gray-400">
            Active on public website
          </span>
        </div>

        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat font-bold uppercase text-gray-400">
              Portfolio Projects
            </span>
            <div className="w-9 h-9 rounded-full bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mb-1">
            {totalProjects}
          </div>
          <span className="text-[11px] text-gray-400">
            Before/after showcases
          </span>
        </div>

        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat font-bold uppercase text-gray-400">
              Active FAQs
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mb-1">
            {totalFaqs}
          </div>
          <span className="text-[11px] text-gray-400">
            Self-service questions
          </span>
        </div>

        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat font-bold uppercase text-gray-400">
              Client Reviews
            </span>
            <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mb-1">
            {totalTestimonials}
          </div>
          <span className="text-[11px] text-gray-400">
            Verified testimonials
          </span>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl">
        <h2 className="font-montserrat font-bold text-base text-white uppercase tracking-wider mb-4 border-l-2 border-safety-orange pl-3">
          Quick Management Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <Link
            href="/admin/forms"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <FormInput className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Forms ({totalForms})
            </span>
          </Link>

          <Link
            href="/admin/offers"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <Tag className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Offers ({totalOffers})
            </span>
          </Link>

          <Link
            href="/admin/projects"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <PlusCircle className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Projects ({totalProjects})
            </span>
          </Link>

          <Link
            href="/admin/services"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <Layers className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Services ({totalServices})
            </span>
          </Link>

          <Link
            href="/admin/faqs"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <HelpCircle className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              FAQs ({totalFaqs})
            </span>
          </Link>

          <Link
            href="/admin/testimonials"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <MessageSquare className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Reviews ({totalTestimonials})
            </span>
          </Link>

          <Link
            href="/admin/media"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <FileText className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Media Library
            </span>
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <Settings className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Visibility & Settings
            </span>
          </Link>
        </div>
      </div>

      {/* Section Visibility & Status Panel */}
      <div className="bg-charcoal border border-steel-grey rounded-xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-steel-grey/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-montserrat font-bold text-base text-white uppercase tracking-wider">
              Section Visibility & Build Status
            </h2>
            {hiddenCount > 0 ? (
              <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> {hiddenCount} Hidden
              </span>
            ) : (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All Sections Visible
              </span>
            )}
          </div>
          <Link
            href="/admin/settings"
            className="text-xs font-montserrat font-bold text-safety-orange hover:text-white transition-colors flex items-center gap-1"
          >
            Manage Visibility Toggles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-near-black/60 border border-steel-grey/60 rounded-lg p-4 flex items-center justify-between">
              <div>
                <span className="font-montserrat font-bold text-xs uppercase text-white block">
                  Home: Featured Projects (Before & After)
                </span>
                <span className="text-[11px] text-gray-400">
                  {hiddenSections.home_projects ? 'Excluded from live website and builds' : 'Publicly visible on homepage'}
                </span>
              </div>
              <span
                className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded flex items-center gap-1.5 ${
                  hiddenSections.home_projects
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                }`}
              >
                {hiddenSections.home_projects ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Hidden
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Visible
                  </>
                )}
              </span>
            </div>

            <div className="bg-near-black/60 border border-steel-grey/60 rounded-lg p-4 flex items-center justify-between">
              <div>
                <span className="font-montserrat font-bold text-xs uppercase text-white block">
                  Header & Footer: &quot;Our Work&quot; Link
                </span>
                <span className="text-[11px] text-gray-400">
                  {hiddenSections.home_projects || hiddenSections.nav_our_work
                    ? 'Hidden from desktop navbar, mobile menu & footer'
                    : 'Shown across all navigation bars'}
                </span>
              </div>
              <span
                className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded flex items-center gap-1.5 ${
                  hiddenSections.home_projects || hiddenSections.nav_our_work
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                }`}
              >
                {hiddenSections.home_projects || hiddenSections.nav_our_work ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Hidden
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Visible
                  </>
                )}
              </span>
            </div>

            <div className="bg-near-black/60 border border-steel-grey/60 rounded-lg p-4 flex items-center justify-between">
              <div>
                <span className="font-montserrat font-bold text-xs uppercase text-white block">
                  Home: Services Overview Grid
                </span>
                <span className="text-[11px] text-gray-400">
                  {hiddenSections.home_services ? 'Excluded from build' : 'Publicly visible'}
                </span>
              </div>
              <span
                className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded flex items-center gap-1.5 ${
                  hiddenSections.home_services
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                }`}
              >
                {hiddenSections.home_services ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {hiddenSections.home_services ? 'Hidden' : 'Visible'}
              </span>
            </div>

            <div className="bg-near-black/60 border border-steel-grey/60 rounded-lg p-4 flex items-center justify-between">
              <div>
                <span className="font-montserrat font-bold text-xs uppercase text-white block">
                  Home: Customer Testimonials
                </span>
                <span className="text-[11px] text-gray-400">
                  {hiddenSections.home_testimonials ? 'Excluded from build' : 'Publicly visible'}
                </span>
              </div>
              <span
                className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded flex items-center gap-1.5 ${
                  hiddenSections.home_testimonials
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                }`}
              >
                {hiddenSections.home_testimonials ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {hiddenSections.home_testimonials ? 'Hidden' : 'Visible'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded bg-steel-grey/20 border border-steel-grey/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-gray-300">
              <span className="font-bold text-white block sm:inline mr-2">Tip:</span>
              Sections can also be hidden directly on the live website by clicking <strong>&quot;Edit Live Website&quot;</strong> and using the <strong>&quot;Hide Section&quot;</strong> buttons on each block.
            </div>
            <Link
              href="/admin/settings"
              className="text-xs font-montserrat font-bold text-safety-orange hover:text-white uppercase whitespace-nowrap"
            >
              Configure All Sections →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
