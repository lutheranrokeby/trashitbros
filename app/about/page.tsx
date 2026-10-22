import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  HardHat,
  Target,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1">
        {/* About Hero (Black #080A0D) */}
        <section className="relative py-20 lg:py-28 bg-[#080A0D] border-b border-[#343B46] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/truck-site.jpg"
              alt="Trash It Bros Construction Truck"
              className="w-full h-full object-cover opacity-25 object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080A0D] via-[#080A0D]/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-3">
                ABOUT TRASH IT BROS
              </span>
              <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
                <span className="block text-white">HARD WORK.</span>
                <span className="block text-safety-orange">CLEAN RESULTS.</span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
                Straightforward, dependable rubbish removal designed for Sunshine Coast builders, trades, business owners, and property managers.
              </p>
              <Link
                href="/get-a-quote"
                className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm tracking-wider uppercase px-8 py-4 rounded transition-all shadow-xl shadow-safety-orange/20"
              >
                <span>REQUEST A QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Story & Philosophy (Light Concrete #F3F4F2) */}
        <section className="py-20 bg-[#F3F4F2] text-[#111827]">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                  OUR PHILOSOPHY
                </span>
                <h2 className="font-bebas text-4xl sm:text-5xl text-[#111827] mb-6 tracking-tight">
                  KEEPING WORKSITES SAFE & PROGRESSING
                </h2>
                <div className="space-y-4 text-[#334155] text-base leading-relaxed">
                  <p>
                    Trash It Bros was established with a singular focus: to deliver fast, no-nonsense rubbish removal that construction teams and businesses can truly depend on.
                  </p>
                  <p>
                    Worksites move at high speed. Uncollected timber off-cuts, gyprock scraps, packaging, and demolition debris create safety hazards, trade congestion, and costly downtime. We remove that friction by providing scheduled collections, prompt response times, and full-service manual loading.
                  </p>
                  <p>
                    Importantly, we are a collection and haulage service. <strong>We provide full truck loading and site clearance.</strong> Our team arrives with the truck, loads the agreed materials, and clears the site so you get an immediate result without unsightly bins sitting in driveways or requiring council permits.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="clip-badge-orange rounded-xl overflow-hidden shadow-xl border border-[#E2E5E9]">
                  <img
                    src="/images/worker-clean.jpg"
                    alt="Trash It Bros Crew on Site"
                    className="w-full h-auto object-cover aspect-4/3"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values (Dark Charcoal #14181F with Steel Cards #242B35) */}
        <section className="py-20 bg-[#14181F] text-white border-t border-[#343B46]">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                WHAT SETS US APART
              </span>
              <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-tight">
                OUR CORE VALUES
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg h-full flex flex-col">
                <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-6">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-lg text-white mb-2">
                  Reliability
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  When we schedule a collection, we show up on time. Construction schedules depend on certainty.
                </p>
              </div>

              <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg h-full flex flex-col">
                <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-lg text-white mb-2">
                  Honest Pricing
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  Clear, upfront estimates based on volume, weight, and waste type. Zero hidden surprises or fuel fees.
                </p>
              </div>

              <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg h-full flex flex-col">
                <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-6">
                  <HardHat className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-lg text-white mb-2">
                  Site Safety
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  Full adherence to worksite safety guidelines, appropriate PPE, and cautious operation around active trades.
                </p>
              </div>

              <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg h-full flex flex-col">
                <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-lg text-white mb-2">
                  Heavy Lifting Done
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  We don&apos;t leave you with a bin to fill. Our team loads everything straight onto the truck and sweeps up.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA (Deep Black #080A0D) */}
        <section className="py-16 bg-[#080A0D] text-center px-4 border-t border-[#343B46]">
          <div className="max-w-site mx-auto max-w-2xl">
            <h2 className="font-bebas text-4xl sm:text-5xl text-white mb-4">
              EXPERIENCE THE DIFFERENCE
            </h2>
            <p className="text-gray-300 max-w-lg mx-auto text-sm sm:text-base mb-8">
              Reach out today to discuss your next construction project or waste clearance across the Sunshine Coast.
            </p>
            <Link
              href="/get-a-quote"
              className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm uppercase px-8 py-4 rounded transition-all shadow-xl shadow-safety-orange/20"
            >
              <span>REQUEST A QUOTE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
