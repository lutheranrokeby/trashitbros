'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';

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

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md transition-colors">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo - transparent blend with black header */}
        <Link href="/" className="flex items-center group">
          <img
            src="/brand/logo-header-transparent.png"
            alt="Trash It Bros Logo"
            className="h-11 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
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

          <Link
            href="/about"
            className={`font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange ${
              isActive('/about') ? 'text-safety-orange' : 'text-gray-300'
            }`}
          >
            About
          </Link>

          <Link
            href="/our-work"
            className={`font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange ${
              isActive('/our-work') ? 'text-safety-orange' : 'text-gray-300'
            }`}
          >
            Our Work
          </Link>

          <Link
            href="/faq"
            className={`font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange ${
              isActive('/faq') ? 'text-safety-orange' : 'text-gray-300'
            }`}
          >
            FAQ
          </Link>

          <Link
            href="/contact"
            className={`font-montserrat text-sm font-semibold tracking-wider transition-colors hover:text-safety-orange ${
              isActive('/contact') ? 'text-safety-orange' : 'text-gray-300'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* CTA Button matching reference image */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/get-a-quote"
            className="group flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs sm:text-sm tracking-wide px-5 py-2.5 rounded-md transition-all duration-200 shadow-md shadow-safety-orange/20"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-200 hover:text-safety-orange transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/98 border-b border-steel-grey/60 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-montserrat text-sm font-bold tracking-wider text-gray-200 hover:text-safety-orange"
          >
            Home
          </Link>
          <div className="border-l-2 border-safety-orange pl-3 py-1 space-y-2">
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-montserrat text-xs font-bold uppercase text-safety-orange"
            >
              Our Services (Overview)
            </Link>
            {serviceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block font-montserrat text-xs text-gray-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-montserrat text-sm font-bold tracking-wider text-gray-200 hover:text-safety-orange"
          >
            About
          </Link>
          <Link
            href="/our-work"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-montserrat text-sm font-bold tracking-wider text-gray-200 hover:text-safety-orange"
          >
            Our Work
          </Link>
          <Link
            href="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-montserrat text-sm font-bold tracking-wider text-gray-200 hover:text-safety-orange"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-montserrat text-sm font-bold tracking-wider text-gray-200 hover:text-safety-orange"
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link
              href="/get-a-quote"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-safety-orange text-white font-montserrat font-bold text-sm tracking-wider uppercase py-3 rounded-md"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
