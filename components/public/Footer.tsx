'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCMS } from '@/components/cms/CMSContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { hiddenSections, settings } = useCMS();
  const logoSrc = settings?.logoUrl || '/brand/logo-dark-cropped.png';
  const phone = settings?.phone || '0481 975 170';
  const email = settings?.email || 'info@trashitbros.com.au';
  const serviceArea = settings?.serviceArea || 'Sunshine Coast & Surrounding Regions, QLD';
  const hours = settings?.hours || 'Mon – Sat: 5:00 AM – 8:00 PM';

  const hideOurWork = hiddenSections?.home_projects || hiddenSections?.nav_our_work;
  const hideServices = hiddenSections?.nav_services;
  const hideAbout = hiddenSections?.nav_about;
  const hideFaq = hiddenSections?.nav_faq;

  return (
    <footer className="bg-near-black text-gray-300 border-t border-steel-grey mt-auto">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Column 1: Logo & Mission */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src={logoSrc}
                alt="Trash It Bros"
                className="h-11 sm:h-14 w-auto object-contain max-w-[200px]"
              />
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Fast, reliable rubbish removal and construction site clean-ups across the Sunshine Coast, QLD. Hard work, clean results.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 text-xs font-montserrat font-semibold text-safety-orange bg-safety-orange/10 px-3 py-1.5 rounded border border-safety-orange/30">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>YOU BUILD IT. WE TAKE IT.</span>
              </div>
            </div>
          </div>

          {/* Column 2: Our Services (Hidden on mobile viewport as it exists in Quick Links) */}
          <div className="hidden sm:block">
            <h4 className="font-montserrat font-bold text-white text-base tracking-wider uppercase mb-5 border-l-2 border-safety-orange pl-3">
              Services
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link
                  href="/services/construction-site-clean-ups"
                  className="hover:text-safety-orange transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-safety-orange" /> Construction Site Clean-Ups
                </Link>
              </li>
              <li>
                <Link
                  href="/services/renovation-waste-removal"
                  className="hover:text-safety-orange transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-safety-orange" /> Renovation & Demolition Waste
                </Link>
              </li>
              <li>
                <Link
                  href="/services/commercial-rubbish-removal"
                  className="hover:text-safety-orange transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-safety-orange" /> Commercial & Industrial Rubbish
                </Link>
              </li>
              <li>
                <Link
                  href="/services/residential-junk-removal"
                  className="hover:text-safety-orange transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-safety-orange" /> General Junk Removal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h4 className="font-montserrat font-bold text-white text-base tracking-wider uppercase mb-5 border-l-2 border-safety-orange pl-3">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-safety-orange transition-colors">
                  Home
                </Link>
              </li>
              {!hideServices && (
                <li>
                  <Link href="/services" className="hover:text-safety-orange transition-colors">
                    All Services
                  </Link>
                </li>
              )}
              {!hideAbout && (
                <li>
                  <Link href="/about" className="hover:text-safety-orange transition-colors">
                    About Us
                  </Link>
                </li>
              )}
              {!hideOurWork && (
                <li>
                  <Link href="/our-work" className="hover:text-safety-orange transition-colors">
                    Our Work (Projects)
                  </Link>
                </li>
              )}
              {!hideFaq && (
                <li>
                  <Link href="/faq" className="hover:text-safety-orange transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
              )}
              <li>
                <Link href="/get-a-quote" className="hover:text-safety-orange transition-colors font-bold text-safety-orange">
                  Request a Free Quote →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Area */}
          <div>
            <h4 className="font-montserrat font-bold text-white text-base tracking-wider uppercase mb-5 border-l-2 border-safety-orange pl-3">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-safety-orange shrink-0 mt-0.5" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-safety-orange transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-safety-orange shrink-0 mt-0.5" />
                <a href={`mailto:${email}`} className="hover:text-safety-orange transition-colors break-all">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-safety-orange shrink-0 mt-0.5" />
                <span>{serviceArea}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-safety-orange shrink-0 mt-0.5" />
                <span>{hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-steel-grey/60 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4 text-center sm:text-left">
          <p>© {currentYear} Trash It Bros. All rights reserved. Locally owned & operated on the Sunshine Coast.</p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/admin" className="hover:text-safety-orange text-gray-500 transition-colors">
              CMS Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
