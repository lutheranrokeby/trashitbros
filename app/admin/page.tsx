import React from 'react';
import Link from 'next/link';
import { readDatabase } from '@/lib/cms/db';
import {
  Inbox,
  Layers,
  Briefcase,
  HelpCircle,
  Clock,
  ArrowRight,
  PlusCircle,
  Edit3,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const db = readDatabase();

  const totalEnquiries = db.enquiries.length;
  const newEnquiries = db.enquiries.filter((e) => e.status === 'New').length;
  const pendingEnquiries = db.enquiries.filter((e) => e.status === 'Contacted' || e.status === 'Quoted').length;
  const totalServices = db.services.length;
  const totalProjects = db.projects.length;

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

      {/* Metrics Cards (Real data only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat font-bold uppercase text-gray-400">
              New Enquiries
            </span>
            <div className="w-9 h-9 rounded-full bg-safety-orange/15 text-safety-orange flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mb-1">
            {newEnquiries}
          </div>
          <span className="text-[11px] text-gray-400">
            {newEnquiries > 0 ? 'Requires prompt follow-up' : 'All enquiries handled'}
          </span>
        </div>

        <div className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat font-bold uppercase text-gray-400">
              In Progress / Quoted
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-white mb-1">
            {pendingEnquiries}
          </div>
          <span className="text-[11px] text-gray-400">
            Awaiting client confirmation
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
      </div>

      {/* Quick Action Hub */}
      <div className="bg-charcoal border border-steel-grey rounded-xl p-6 shadow-xl">
        <h2 className="font-montserrat font-bold text-base text-white uppercase tracking-wider mb-4 border-l-2 border-safety-orange pl-3">
          Quick Management Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/enquiries"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <Inbox className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              View Enquiries ({totalEnquiries})
            </span>
          </Link>

          <Link
            href="/admin/projects"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <PlusCircle className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Add New Project
            </span>
          </Link>

          <Link
            href="/admin/services"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <Layers className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Update Services
            </span>
          </Link>

          <Link
            href="/admin/media"
            className="p-4 rounded bg-near-black hover:bg-steel-grey/40 border border-steel-grey/60 transition-colors flex flex-col justify-between"
          >
            <FileText className="w-6 h-6 text-safety-orange mb-2" />
            <span className="font-montserrat font-bold text-xs uppercase text-white">
              Open Media Library
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Enquiries Preview */}
      <div className="bg-charcoal border border-steel-grey rounded-xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-steel-grey/60 flex items-center justify-between">
          <h2 className="font-montserrat font-bold text-base text-white uppercase tracking-wider">
            Recent Quote Submissions
          </h2>
          <Link
            href="/admin/enquiries"
            className="text-xs font-montserrat font-bold text-safety-orange hover:text-white transition-colors flex items-center gap-1"
          >
            View All ({totalEnquiries}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {db.enquiries.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No customer quote requests submitted yet. Test submissions will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-near-black text-gray-400 uppercase font-montserrat">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-grey/40 text-gray-300">
                {db.enquiries.slice(0, 5).map((e) => (
                  <tr key={e.id} className="hover:bg-near-black/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-safety-orange">
                      {e.reference}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {e.fullName}
                      <span className="block text-[10px] text-gray-400 font-normal">
                        {e.phone}
                      </span>
                    </td>
                    <td className="px-6 py-4">{e.service}</td>
                    <td className="px-6 py-4">{e.siteAddress}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          e.status === 'New'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : e.status === 'Quoted'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : e.status === 'Won' || e.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-steel-grey text-gray-300'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/admin/enquiries"
                        className="text-safety-orange hover:text-white font-bold"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
