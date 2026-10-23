import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CRMFormEmbed } from '@/components/public/CRMFormEmbed';
import { readDatabase } from '@/lib/cms/db';
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

interface OfferPageProps {
  params: Promise<{ slug: string }>;
}

export default async function OfferLandingPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const db = readDatabase();
  const offer = db.offers?.find((o) => o.slug === slug);
  const form = db.forms?.find((f) => f.id === 'offer-form');

  // If offer not found, or not published, or landing page access is disabled, return 404
  if (!offer || !offer.published || offer.landingPageEnabled === false) {
    notFound();
  }

  const currentOffer = offer;

  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION (Clean typographic look with CTA on right-hand side) */}
        <section className="relative py-14 lg:py-20 bg-gradient-to-b from-[#080A0D] via-[#14181F] to-[#080A0D] border-b border-[#343B46] overflow-hidden">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Offer Details */}
              <div className="lg:col-span-7 space-y-6">
                {/* Main Headline */}
                <div>
                  <h1 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] text-white">
                    {currentOffer.headline}{' '}
                    <span className="text-safety-orange inline-block">
                      {currentOffer.priceHighlight}
                    </span>
                  </h1>
                </div>

                {/* Speech Bubble Hook */}
                <div className="relative bg-white text-[#111827] rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-white max-w-xl">
                  <div className="hidden sm:block absolute -left-3 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-r-[14px] border-r-white border-b-[10px] border-b-transparent" />
                  <p className="font-bebas text-2xl sm:text-3xl text-[#111827] tracking-wide leading-tight uppercase">
                    {currentOffer.hook}
                  </p>
                </div>

                {/* Core Offer Inclusions Card */}
                <div className="bg-white border-2 border-[#111827] rounded-xl p-5 sm:p-6 text-[#111827] shadow-[6px_6px_0px_rgba(0,0,0,0.85)] space-y-3.5 max-w-xl">
                  <p className="font-inter font-bold text-base sm:text-lg text-[#111827]">
                    {currentOffer.summary}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-[#334155] font-semibold">
                    <MapPin className="w-4 h-4 text-safety-orange shrink-0" />
                    <span>{currentOffer.serviceAreas}</span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                      <span className="bg-[#111827] text-white font-mono font-bold px-2 py-0.5 rounded text-xs uppercase mr-1.5">
                        Jobs from $99
                      </span>
                      {currentOffer.pricingNote}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: CTA Box linking to Form Section Below */}
              <div className="lg:col-span-5 bg-[#14181F] border-2 border-safety-orange/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
                <div className="space-y-3">
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

                <div className="space-y-3 pt-2">
                  <a
                    href="#claim-offer"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm sm:text-base tracking-wider uppercase px-8 py-4 rounded-xl shadow-xl shadow-safety-orange/25 transition-all hover:scale-[1.02] text-center"
                  >
                    <span>{currentOffer.ctaText || 'CLAIM THIS OFFER NOW'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>

                  <a
                    href={`tel:${(currentOffer.phone || '0481975170').replace(/\s+/g, '')}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#080A0D] hover:bg-[#1C222B] text-white border border-[#343B46] font-montserrat font-bold text-sm tracking-wider uppercase px-6 py-3.5 rounded-xl transition-colors text-center"
                  >
                    <Phone className="w-4 h-4 text-safety-orange" />
                    <span>Call {currentOffer.phone || '0481 975 170'}</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-[#343B46] flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-safety-orange" />
                    <span>Upfront Quote</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-safety-orange" />
                    <span>Full Heavy Lifting</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CLAIM OFFER SECTION WITH FORM EMBED */}
        <section id="claim-offer" className="py-16 lg:py-24 bg-[#080A0D] border-t border-[#343B46] text-white">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-tight leading-none mb-3">
                REQUEST YOUR $99+ UPFRONT QUOTE
              </h2>
              <p className="text-sm text-gray-300">
                Fill out the quick form below or call directly. We provide fast, transparent quotes across the Sunshine Coast, Noosa, and Caboolture.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-[#14181F] border border-[#343B46] rounded-2xl p-6 sm:p-8 shadow-2xl">
              <CRMFormEmbed
                formId="offer-form"
                defaultName="Promotional Offers Form"
                initialEmbedCode={form?.embedCode}
              />
            </div>

            {/* Direct phone call alternative */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 mb-2">Prefer to speak with our crew directly?</p>
              <a
                href={`tel:${(currentOffer.phone || '0481975170').replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-safety-orange hover:text-white font-montserrat font-bold text-base transition-colors"
              >
                <Phone className="w-4 h-4" /> {currentOffer.phone || '0481 975 170'}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
