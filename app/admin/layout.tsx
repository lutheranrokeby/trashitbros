'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCMS } from '@/components/cms/CMSContext';
import {
  LayoutDashboard,
  Tag,
  Briefcase,
  Layers,
  HelpCircle,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  Globe,
  LogOut,
  Menu,
  X,
  Edit3,
  Loader2,
  FormInput,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/offers', label: 'Offers & Promos', icon: Tag },
  { href: '/admin/forms', label: 'Forms & Embeds', icon: FormInput },
  { href: '/admin/services', label: 'Services', icon: Layers },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, setEditMode, settings } = useCMS();
  const logoSrc = settings?.logoUrl || '/brand/logo-dark-cropped.png';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Route protection: if done loading and user is not authenticated, redirect to /admin/login
  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [loading, user, pathname, router]);

  // If on login page, render children without sidebar shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-near-black flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-safety-orange" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-near-black text-white flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-charcoal border-b border-steel-grey px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <img src={logoSrc} alt="Logo" className="h-8 w-auto object-contain" />
          <span className="font-montserrat font-bold text-xs tracking-wider uppercase text-safety-orange">
            CMS Admin
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-gray-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-charcoal border-r border-steel-grey flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Branding */}
          <div className="p-6 border-b border-steel-grey/60">
            <Link href="/" className="block mb-2">
              <img
                src={logoSrc}
                alt="Trash It Bros Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-montserrat font-bold text-gray-300">
                {user ? user.name : 'CMS Active'}
              </span>
              <span className="text-[10px] text-safety-orange font-bold uppercase">
                ({user?.role || 'Admin'})
              </span>
            </div>
          </div>

          {/* Quick Action: Inline Edit Toggle */}
          <div className="px-4 py-3 border-b border-steel-grey/40">
            <Link
              href="/?edit=true"
              onClick={() => setEditMode(true)}
              className="w-full flex items-center justify-center gap-2 bg-safety-orange/15 hover:bg-safety-orange text-safety-orange hover:text-white border border-safety-orange/40 rounded px-3 py-2 text-xs font-montserrat font-bold uppercase tracking-wider transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Launch Inline Editor
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-montserrat font-semibold tracking-wide transition-colors ${
                    isActive
                      ? 'bg-safety-orange text-white shadow'
                      : 'text-gray-300 hover:bg-steel-grey/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-steel-grey/60 space-y-2">
          <Link
            href="/"
            onClick={() => setEditMode(false)}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white py-1 px-2 rounded hover:bg-steel-grey/40 transition-colors"
          >
            <Globe className="w-4 h-4 text-safety-orange" />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 py-1.5 px-2 rounded hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
