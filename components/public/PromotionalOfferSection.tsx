import React from 'react';
import Link from 'next/link';
import { OfferItem } from '@/lib/cms/types';
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  Truck,
  FileCheck2,
  MapPin,
  Info,
} from 'lucide-react';

interface PromotionalOfferSectionProps {
  offer: OfferItem;
  isLandingPage?: boolean;
}

export function PromotionalOfferSection({
  offer,
  isLandingPage = false,
}: PromotionalOfferSectionProps) {
  const claimUrl = isLandingPage ? '#claim-offer' : `/offers/${offer.slug}#claim-offer`;
  const cleanPhone = (offer.phone || '0481975170').replace(/\s+/g, '');
  const displayPhone = offer.phone || '0481 975 170';

  // Eyebrow logic: only use 'LIMITED-TIME' if a genuine expiry or badge exists, otherwise straightforward
  const eyebrowText = offer.badge
    ? offer.badge
    : 'STRAIGHTFORWARD RUBBISH REMOVAL';

  const defaultDescription =
    offer.summary ||
    "Got unwanted rubbish, old furniture, green waste or a garage that needs clearing? We'll take care of the lifting, loading and removal.";

  const defaultPricingConditions =
    offer.pricingNote ||
    "Prices start from $99 for eligible small collections. Final pricing depends on rubbish volume, type, site access and disposal requirements. We'll confirm your price before collection.";

  return (
    <section className="relative bg-[#080A0D] border-y border-[#343B46] py-16 sm:py-20 lg:py-24 text-white overflow-hidden">
      {/* Background industrial architectural subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* =========================================================
              LEFT COLUMN (55% on desktop: lg:col-span-7)
              Editorial Composition: Display Heading & Benefits
              ========================================================= */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* Eyebrow */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange">
                <span className="w-2 h-2 rounded-full bg-safety-orange animate-pulse" />
                {eyebrowText}
              </span>
            </div>

            {/* Main Display Headline (Bebas Neue) */}
            <div className="space-y-1 sm:space-y-2">
              <h2 className="font-bebas tracking-tight leading-[0.88] text-white flex flex-col">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-white">
                  {offer.headline || 'RUBBISH REMOVAL'}
                </span>
                <span className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] text-safety-orange font-bold tracking-normal mt-1">
                  {offer.priceHighlight || 'FROM $99'}
                </span>
              </h2>
            </div>

            {/* Supporting Editorial Paragraph */}
            <p className="font-inter text-base sm:text-lg text-[#CBD5E1] leading-relaxed max-w-2xl">
              {defaultDescription}
            </p>

            {/* 3 Concise Key Benefits with Safety Orange Icons */}
            <div className="pt-2 space-y-3 sm:space-y-3.5 max-w-xl">
              <div className="flex items-start gap-3 text-sm sm:text-base text-gray-200 font-medium font-inter">
                <div className="p-1.5 rounded-md bg-[#14181F] border border-[#343B46] text-safety-orange shrink-0 mt-0.5">
                  <Truck className="w-4 h-4 text-safety-orange" />
                </div>
                <span>We load and remove the rubbish.</span>
              </div>

              <div className="flex items-start gap-3 text-sm sm:text-base text-gray-200 font-medium font-inter">
                <div className="p-1.5 rounded-md bg-[#14181F] border border-[#343B46] text-safety-orange shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4 text-safety-orange" />
                </div>
                <span>Straightforward upfront quotes.</span>
              </div>

              <div className="flex items-start gap-3 text-sm sm:text-base text-gray-200 font-medium font-inter">
                <div className="p-1.5 rounded-md bg-[#14181F] border border-[#343B46] text-safety-orange shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-safety-orange" />
                </div>
                <span>Sunshine Coast and surrounding areas.</span>
              </div>
            </div>

            {/* Pricing Conditions Row (Understated Separator & Info Text) */}
            <div className="pt-4 sm:pt-5 border-t border-[#343B46]/70 max-w-2xl">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-inter">
                <Info className="w-4 h-4 text-safety-orange/80 shrink-0 mt-0.5" />
                <p>{defaultPricingConditions}</p>
              </div>
            </div>

          </div>

          {/* =========================================================
              RIGHT COLUMN (45% on desktop: lg:col-span-5)
              Action Container — Seamlessly links to existing quotation workflow
              ========================================================= */}
          <div className="lg:col-span-5">
            <div className="bg-[#14181F] border border-[#343B46] rounded-xl p-6 sm:p-8 xl:p-9 space-y-6 shadow-2xl relative">
              
              {/* Header inside card */}
              <div className="space-y-2">
                <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block">
                  FAST &amp; UPFRONT PRICING
                </span>
                <h3 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide leading-tight">
                  READY TO GET RID OF THE MESS?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-inter">
                  Request your upfront quote now. We load it, clear it, dispose of it responsibly, and leave your space clean and tidy.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <Link
                  href={claimUrl}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm sm:text-base tracking-wider uppercase px-7 py-4 rounded-md shadow-lg shadow-safety-orange/20 transition-all hover:scale-[1.01] text-center"
                >
                  <span>{offer.ctaText || 'CLAIM THIS OFFER NOW'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`tel:${cleanPhone}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#080A0D] hover:bg-[#1C222B] text-white border border-[#343B46] font-montserrat font-bold text-sm tracking-wider uppercase px-6 py-3.5 rounded-md transition-colors text-center"
                >
                  <Phone className="w-4 h-4 text-safety-orange" />
                  <span>Call {displayPhone}</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-[#343B46] flex items-center justify-between text-xs text-gray-400 font-semibold">
                <div className="flex items-center gap-1.5 text-gray-300 font-inter">
                  <CheckCircle2 className="w-4 h-4 text-safety-orange shrink-0" />
                  <span>Upfront Quote</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300 font-inter">
                  <CheckCircle2 className="w-4 h-4 text-safety-orange shrink-0" />
                  <span>Full Heavy Lifting</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}