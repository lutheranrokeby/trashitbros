import React from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { CRMFormEmbed } from '@/components/public/CRMFormEmbed';
import { InlineText } from '@/components/cms/InlineText';
import { CheckCircle2 } from 'lucide-react';
import { readDatabase } from '@/lib/cms/db';

function PricingCard() {
  return (
    <div className="bg-[#14181F] border border-[#343B46] rounded-xl p-4 sm:p-7 text-white shadow-xl max-w-xl">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="w-2.5 h-2.5 rounded-full bg-safety-orange" />
        <span className="font-bebas text-2xl sm:text-3xl tracking-wide text-white">
          <InlineText fieldKey="pricing_headline_prefix" defaultValue="RUBBISH REMOVAL FROM " as="span" />
          <span className="text-safety-orange">
            <InlineText fieldKey="pricing_starting_price" defaultValue="$99" as="span" />
          </span>
        </span>
      </div>
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-inter">
        <InlineText
          fieldKey="pricing_subtext"
          defaultValue="Starting prices apply to eligible small collections. Final pricing depends on the rubbish, collection requirements and disposal costs."
          as="span"
          multiline
        />
      </p>
    </div>
  );
}

function TrustList() {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-safety-orange shrink-0 stroke-[2.2]" />
        <span className="text-sm sm:text-base font-montserrat font-semibold text-[#14181F]">
          <InlineText fieldKey="trust_point_1" defaultValue="Quick, straightforward quotes." as="span" />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-safety-orange shrink-0 stroke-[2.2]" />
        <span className="text-sm sm:text-base font-montserrat font-semibold text-[#14181F]">
          <InlineText fieldKey="trust_point_2" defaultValue="No photos required." as="span" />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-safety-orange shrink-0 stroke-[2.2]" />
        <span className="text-sm sm:text-base font-montserrat font-semibold text-[#14181F]">
          <InlineText fieldKey="trust_point_3" defaultValue="Clear pricing before collection." as="span" />
        </span>
      </div>
    </div>
  );
}

export default function GetAQuotePage() {
  const db = readDatabase();
  const form = db.forms?.find((f) => f.id === 'quote-form');

  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1 bg-[#F3F4F2]">
        {/* Cohesive Two-Column Split-Screen Quote Section */}
        <section className="py-10 sm:py-16 lg:py-24">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:gap-x-16 xl:gap-x-20 items-start">
              
              {/* Mobile Header */}
              <div className="lg:hidden">
                <span className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                  <InlineText fieldKey="quote_eyebrow" defaultValue="GET A FREE QUOTE" as="span" />
                </span>
                <h1 className="font-bebas text-4xl sm:text-6xl tracking-tight leading-[0.92] mb-4">
                  <span className="block text-[#14181F]">
                    <InlineText fieldKey="quote_title_1" defaultValue="GOT RUBBISH?" as="span" />
                  </span>
                  <span className="block text-safety-orange">
                    <InlineText fieldKey="quote_title_2" defaultValue="WE'LL TAKE IT." as="span" />
                  </span>
                </h1>
                <p className="text-slate-700 text-base leading-relaxed font-inter">
                  <InlineText
                    fieldKey="quote_desc"
                    defaultValue="Getting a quote is simple. Enter your details and upload a few photos of what needs removing. No photos? No worries — you can still send your request."
                    as="span"
                    multiline
                  />
                </p>
              </div>

              {/* Desktop Left Column */}
              <div className="hidden lg:flex lg:flex-col lg:col-span-6 space-y-8">
                <div>
                  <span className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-3">
                    <InlineText fieldKey="quote_eyebrow" defaultValue="GET A FREE QUOTE" as="span" />
                  </span>
                  <h1 className="font-bebas text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] mb-6">
                    <span className="block text-[#14181F]">
                      <InlineText fieldKey="quote_title_1" defaultValue="GOT RUBBISH?" as="span" />
                    </span>
                    <span className="block text-safety-orange">
                      <InlineText fieldKey="quote_title_2" defaultValue="WE'LL TAKE IT." as="span" />
                    </span>
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-inter max-w-xl">
                    <InlineText
                      fieldKey="quote_desc"
                      defaultValue="Getting a quote is simple. Enter your details and upload a few photos of what needs removing. No photos? No worries — you can still send your request."
                      as="span"
                      multiline
                    />
                  </p>
                </div>

                {/* 3 Trust-building points */}
                <TrustList />

                {/* Compact Dark Charcoal Pricing Highlight */}
                <PricingCard />
              </div>

              {/* Right Column: CRM Form Embed */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
                <div className="w-full bg-[#14181F] border border-[#343B46] rounded-2xl p-3.5 sm:p-6 shadow-2xl">
                  <CRMFormEmbed
                    formId="quote-form"
                    defaultName="Get a Quote Form"
                    initialEmbedCode={form?.embedCode}
                  />
                </div>
              </div>

              {/* Mobile Benefits & Pricing */}
              <div className="lg:hidden space-y-6 pt-2">
                <TrustList />
                <PricingCard />
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
