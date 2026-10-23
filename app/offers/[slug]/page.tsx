import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CRMFormEmbed } from '@/components/public/CRMFormEmbed';
import { PromotionalOfferSection } from '@/components/public/PromotionalOfferSection';
import { readDatabase } from '@/lib/cms/db';
import { Phone } from 'lucide-react';

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
        {/* SHARED PROMOTIONAL OFFER SECTION */}
        <PromotionalOfferSection offer={currentOffer} isLandingPage={true} />

        {/* CLAIM OFFER SECTION WITH FORM EMBED */}
        <section id="claim-offer" className="py-12 sm:py-16 lg:py-24 bg-[#080A0D] border-t border-[#343B46] text-white">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-tight leading-none mb-3">
                REQUEST YOUR $99+ UPFRONT QUOTE
              </h2>
              <p className="text-sm text-gray-300">
                Fill out the quick form below or call directly. We provide fast, transparent quotes across the Sunshine Coast, Noosa, and Caboolture.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-[#14181F] border border-[#343B46] rounded-2xl p-4 sm:p-8 shadow-2xl">
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
