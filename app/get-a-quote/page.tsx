import React from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { QuoteForm } from '@/components/public/QuoteForm';
import { CheckCircle2 } from 'lucide-react';

const trustPoints = [
  'Quick, straightforward quotes.',
  'No photos required.',
  'Clear pricing before collection.',
];

function PricingCard() {
  return (
    <div className="bg-[#14181F] border border-[#343B46] rounded-xl p-6 sm:p-7 text-white shadow-xl max-w-xl">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="w-2.5 h-2.5 rounded-full bg-safety-orange" />
        <span className="font-bebas text-2xl sm:text-3xl tracking-wide text-white">
          RUBBISH REMOVAL FROM <span className="text-safety-orange">$99</span>
        </span>
      </div>
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-inter">
        Starting prices apply to eligible small collections. Final pricing depends on the rubbish, collection requirements and disposal costs.
      </p>
    </div>
  );
}

function TrustList() {
  return (
    <div className="space-y-3.5">
      {trustPoints.map((point) => (
        <div key={point} className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-safety-orange shrink-0 stroke-[2.2]" />
          <span className="text-sm sm:text-base font-montserrat font-semibold text-[#14181F]">
            {point}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function GetAQuotePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1 bg-[#F3F4F2]">
        {/* Cohesive Two-Column Split-Screen Quote Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 lg:gap-x-16 xl:gap-x-20 items-start">
              
              {/* Mobile Header (Heading & Paragraph - visible only on mobile/tablet < lg) */}
              <div className="lg:hidden">
                <span className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                  GET A FREE QUOTE
                </span>
                <h1 className="font-bebas text-5xl sm:text-6xl tracking-tight leading-[0.92] mb-4">
                  <span className="block text-[#14181F]">GOT RUBBISH?</span>
                  <span className="block text-safety-orange">WE&apos;LL TAKE IT.</span>
                </h1>
                <p className="text-slate-700 text-base leading-relaxed font-inter">
                  Getting a quote is simple. Enter your details and upload a few photos of what needs removing. No photos? No worries — you can still send your request.
                </p>
              </div>

              {/* Desktop Left Column (Unified heading + paragraph + trust + pricing) */}
              <div className="hidden lg:flex lg:flex-col lg:col-span-7 space-y-8">
                <div>
                  <span className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-3">
                    GET A FREE QUOTE
                  </span>
                  <h1 className="font-bebas text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] mb-6">
                    <span className="block text-[#14181F]">GOT RUBBISH?</span>
                    <span className="block text-safety-orange">WE&apos;LL TAKE IT.</span>
                  </h1>
                  <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-inter max-w-xl">
                    Getting a quote is simple. Enter your details and upload a few photos of what needs removing. No photos? No worries — you can still send your request.
                  </p>
                </div>

                {/* 3 Trust-building points */}
                <TrustList />

                {/* Compact Dark Charcoal Pricing Highlight */}
                <PricingCard />
              </div>

              {/* Right Column: Dark Charcoal Quote Form */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <QuoteForm />
              </div>

              {/* Mobile Benefits & Pricing (visible only on mobile/tablet < lg, placed after the form) */}
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
