'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight, Phone } from 'lucide-react';
import { useCMS } from '@/components/cms/CMSContext';

const serviceLinks = [
  { href: '/services/construction-site-clean-ups', label: 'Construction Site Clean-Ups' },
  { href: '/services/renovation-waste-removal', label: 'Renovation & Demolition Waste' },
  { href: '/services/commercial-rubbish-removal', label: 'Commercial & Industrial Rubbish' },
  { href: '/services/residential-junk-removal', label: 'General Junk Removal' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { hiddenSections, settings } = useCMS();
  const logoSrc = settings?.logoUrl || '/brand/logo-header-transparent.png';
  const phone = settings?.phone || '0481 975 170';

  const hideOurWork = hiddenSections?.home_projects || hiddenSections?.nav_our_work;
  const hideServices = hiddenSections?.nav_services;
  const hideAbout = hiddenSections?.nav_about;
  const hideFaq = hiddenSections?.nav_faq;

  const isActive = (path: string) => pathname === path;

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#080A0D] border-b border-white/10 transition-colors">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo - transparent blend with black header */}
        <Link href="/" className="flex items-center group shrink-0">
          <img
            src={logoSrc}
            alt="Trash It Bros Logo"
            className="h-9 sm:h-11 md:h-12 w-auto max-w-[170px] sm:max-w-none object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link
            href="/"
            className={`font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange ${
              isActive('/') ? 'text-safety-orange' : 'text-gray-300'
            }`}
          >
            Home
          </Link>

          {/* Services Dropdown */}
          {!hideServices && (
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link
                href="/services"
                className={`flex items-center gap-1 font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange py-2 ${
                  pathname.startsWith('/services') ? 'text-safety-orange' : 'text-gray-300'
                }`}
              >
                Services <ChevronDown className="w-3.5 h-3.5" />
              </Link>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-near-black border border-steel-grey/80 rounded-b-md shadow-2xl py-2 z-50">
                  <Link
                    href="/services"
                    className="block px-4 py-2 text-xs font-montserrat font-bold text-safety-orange hover:bg-steel-grey/50 transition-colors uppercase border-b border-steel-grey/40"
                  >
                    All Services Overview →
                  </Link>
                  {serviceLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-xs font-montserrat font-semibold text-gray-200 hover:text-white hover:bg-steel-grey/50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {!hideAbout && (
            <Link
              href="/about"
              className={`font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange ${
                isActive('/about') ? 'text-safety-orange' : 'text-gray-300'
              }`}
            >
              About
            </Link>
          )}

          {!hideOurWork && (
            <Link
              href="/our-work"
              className={`font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange ${
                isActive('/our-work') ? 'text-safety-orange' : 'text-gray-300'
              }`}
            >
              Our Work
            </Link>
          )}

          {!hideFaq && (
            <Link
              href="/faq"
              className={`font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange ${
                isActive('/faq') ? 'text-safety-orange' : 'text-gray-300'
              }`}
            >
              FAQ
            </Link>
          )}

          <Link
            href="/contact"
            className={`font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange ${
              isActive('/contact') ? 'text-safety-orange' : 'text-gray-300'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/get-a-quote"
            className="group flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs sm:text-sm tracking-wide px-5 py-2.5 rounded-md transition-all duration-200 shadow-md shadow-safety-orange/20"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Header Actions (Call Button + Hamburger) */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 bg-[#14181F] hover:bg-[#1F2633] text-white border border-[#343B46] text-xs font-montserrat font-bold uppercase px-3 py-2 rounded-md transition-colors"
            aria-label="Call Trash It Bros"
          >
            <Phone className="w-3.5 h-3.5 text-safety-orange" />
            <span className="hidden min-[380px]:inline">Call</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-200 hover:text-safety-orange transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-safety-orange/40 cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Drawer Navigation with Smooth Scroll (Sibling to header to avoid stacking context traps) */}
    {mobileMenuOpen && (
      <div className="lg:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-[#080A0D]/98 backdrop-blur-xl border-t border-steel-grey/60 z-50 flex flex-col justify-between overflow-y-auto overscroll-contain">
        <div className="px-5 py-6 space-y-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between py-3 px-3 rounded-lg font-montserrat text-base font-bold tracking-wider transition-colors ${
              isActive('/') ? 'bg-safety-orange/15 text-safety-orange' : 'text-gray-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Home</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
          </Link>

          {!hideServices && (
            <div className="bg-[#14181F]/70 border border-[#343B46]/70 rounded-xl p-3.5 space-y-2">
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between font-montserrat text-xs font-bold uppercase tracking-wider text-safety-orange py-1"
              >
                <span>All Services</span>
                <span>View All →</span>
              </Link>
              <div className="pt-1.5 space-y-1">
                {serviceLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-2.5 rounded text-xs font-montserrat font-semibold text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!hideAbout && (
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-3 px-3 rounded-lg font-montserrat text-base font-bold tracking-wider transition-colors ${
                isActive('/about') ? 'bg-safety-orange/15 text-safety-orange' : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>About</span>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </Link>
          )}

          {!hideOurWork && (
            <Link
              href="/our-work"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-3 px-3 rounded-lg font-montserrat text-base font-bold tracking-wider transition-colors ${
                isActive('/our-work') ? 'bg-safety-orange/15 text-safety-orange' : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Our Work</span>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </Link>
          )}

          {!hideFaq && (
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between py-3 px-3 rounded-lg font-montserrat text-base font-bold tracking-wider transition-colors ${
                isActive('/faq') ? 'bg-safety-orange/15 text-safety-orange' : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>FAQ</span>
              <ArrowRight className="w-4 h-4 opacity-50" />
            </Link>
          )}

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between py-3 px-3 rounded-lg font-montserrat text-base font-bold tracking-wider transition-colors ${
              isActive('/contact') ? 'bg-safety-orange/15 text-safety-orange' : 'text-gray-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Contact</span>
            <ArrowRight className="w-4 h-4 opacity-50" />
          </Link>
        </div>

        {/* Bottom Action Stack */}
        <div className="p-5 border-t border-[#343B46] bg-[#080A0D] space-y-3 mt-auto">
          <Link
            href="/get-a-quote"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm tracking-wider uppercase py-3.5 rounded-lg shadow-lg shadow-safety-orange/20 transition-colors"
          >
            <span>Get a Free Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="flex items-center justify-center gap-2 w-full bg-[#14181F] hover:bg-[#1F2633] text-white border border-[#343B46] font-montserrat font-bold text-sm tracking-wider uppercase py-3 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4 text-safety-orange" />
            <span>Call {phone}</span>
          </a>
        </div>
      </div>
    )}
  </>
);
}
