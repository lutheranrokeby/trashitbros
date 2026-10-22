'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-near-black text-gray-300 border-t border-steel-grey mt-auto">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo & Mission */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/brand/logo-dark-cropped.png"
                alt="Trash It Bros"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fast, reliable rubbish removal and construction site clean-ups across the Sunshine Coast, QLD. Hard work, clean results.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 text-xs font-montserrat font-semibold text-safety-orange bg-safety-orange/10 px-3 py-1.5 rounded border border-safety-orange/30">
                <ShieldCheck className="w-4 h-4" />
                <span>YOU BUILD IT. WE TAKE IT.</span>
              </div>
            </div>
          </div>

          {/* Column 2: Our Services (NO rubbish collection!) */}
          <div>
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
              <li>
                <Link href="/services" className="hover:text-safety-orange transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-safety-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-work" className="hover:text-safety-orange transition-colors">
                  Our Work (Projects)
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-safety-orange transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
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
                <a href="tel:0481975170" className="hover:text-safety-orange transition-colors">
                  0481 975 170
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-safety-orange shrink-0 mt-0.5" />
                <span>info@trashitbros.com.au</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-safety-orange shrink-0 mt-0.5" />
                <span>Sunshine Coast & Surrounding Regions, QLD</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-safety-orange shrink-0 mt-0.5" />
                <div>
                  <span className="block text-gray-200">Mon – Sat: 6:00 AM – 6:00 PM</span>
                  <span className="inline-flex items-center gap-1 mt-1 bg-safety-orange/15 border border-safety-orange/40 text-safety-orange font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wide">
                    ★ 24/7 On-Call Available
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-steel-grey/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {currentYear} Trash It Bros. All rights reserved. Australian Business.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/admin/login" className="hover:text-safety-orange transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
