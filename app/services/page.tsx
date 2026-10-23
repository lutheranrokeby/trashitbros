import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { InlineText } from '@/components/cms/InlineText';
import { CMSSection } from '@/components/cms/CMSSection';
import { readDatabase } from '@/lib/cms/db';
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export default function ServicesPage() {
  const db = readDatabase();
  const services = db.services.filter((s) => s.published);

  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1">
        {/* Services Hero with Seamless Black to Image Fade */}
        <section className="relative min-h-[65vh] lg:min-h-[75vh] flex flex-col justify-center overflow-hidden bg-[#080A0D] border-b border-[#343B46]">
          {/* Background Image with Seamless Atmospheric Gradient Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#080A0D]">
            {/* Full-width responsive hero image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="/images/services-hero-framing.jpg"
                alt="Construction framing site with rubbish removal pile"
                className="w-full h-full object-cover object-right"
              />
            </div>

            {/* Desktop & Tablet: Multi-stop horizontal gradient from solid black (#080A0D) on left to crisp framing image on right */}
            <div
              className="hidden md:block absolute inset-0 pointer-events-none z-10"
              style={{
                background: `linear-gradient(
                  90deg,
                  #080A0D 0%,
                  #080A0D 24%,
                  rgba(8, 10, 13, 0.98) 32%,
                  rgba(8, 10, 13, 0.86) 44%,
                  rgba(8, 10, 13, 0.52) 58%,
                  rgba(8, 10, 13, 0.18) 75%,
                  rgba(8, 10, 13, 0.08) 88%,
                  rgba(8, 10, 13, 0.08) 100%
                )`,
              }}
            />

            {/* Mobile: Atmospheric vertical gradient ensuring maximum text readability across full width */}
            <div
              className="block md:hidden absolute inset-0 pointer-events-none z-10"
              style={{
                background: `linear-gradient(
                  180deg,
                  rgba(8, 10, 13, 0.94) 0%,
                  rgba(8, 10, 13, 0.86) 40%,
                  rgba(8, 10, 13, 0.90) 75%,
                  #080A0D 100%
                )`,
              }}
            />

            {/* Top fade (blends seamlessly with dark navigation bar) */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#080A0D] via-[#080A0D]/80 to-transparent z-10 pointer-events-none" />

            {/* Bottom fade (soft transition into services grid) */}
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#080A0D] via-[#080A0D]/75 to-transparent z-10 pointer-events-none" />
          </div>

          <div className="relative z-20 max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 w-full">
            <div className="max-w-2xl text-left">
              <span className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-3">
                <InlineText fieldKey="hero_eyebrow" defaultValue="OUR SERVICES" />
              </span>
              <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
                <span className="block text-white">RUBBISH REMOVAL</span>
                <span className="block text-safety-orange">FOR EVERY PROJECT.</span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                <InlineText
                  fieldKey="hero_paragraph"
                  defaultValue="From active building sites and commercial fit-outs to home renovations and general clean-outs, Trash It Bros provides fast, heavy-duty rubbish removal solutions across the Sunshine Coast."
                />
              </p>
              <Link
                href="/get-a-quote"
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm tracking-wider uppercase px-8 py-4 rounded transition-all shadow-xl shadow-safety-orange/20"
              >
                <span>GET A FREE QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Core Services Overview Grid (Light Concrete #F3F4F2 with White Cards) */}
        <CMSSection sectionKey="services_list" label="Services Overview Grid">
          <section className="py-14 sm:py-20 bg-[#F3F4F2] text-[#111827]">
            <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                  WHAT WE HANDLE
                </span>
                <h2 className="font-bebas text-4xl sm:text-5xl text-[#111827] tracking-tight">
                  TAILORED RUBBISH REMOVAL SOLUTIONS
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="bg-white border border-[#E2E5E9] rounded-xl overflow-hidden shadow-md flex flex-col justify-between hover:border-safety-orange transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={service.cardImage}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-safety-orange text-white font-montserrat font-bold text-xs px-3 py-1 rounded shadow">
                        0{index + 1}
                      </div>
                    </div>

                    <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bebas text-3xl sm:text-4xl text-[#111827] mb-3">
                          {service.name}
                        </h3>
                        <p className="text-sm text-[#334155] leading-relaxed mb-6">
                          {service.fullDescription}
                        </p>

                        <div className="space-y-2 mb-6">
                          <span className="text-xs font-montserrat font-bold uppercase text-safety-orange tracking-wider block">
                            Key Benefits:
                          </span>
                          {service.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-[#334155]">
                              <CheckCircle className="w-3.5 h-3.5 text-safety-orange shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#E2E5E9] pt-5 flex items-center justify-between">
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-safety-orange hover:text-[#C2410C] transition-colors"
                        >
                          <span>VIEW FULL SERVICE DETAILS</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/get-a-quote"
                          className="bg-[#14181F] hover:bg-[#242B35] text-white font-montserrat font-bold text-xs px-4 py-2 rounded transition-colors"
                        >
                          Request Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </CMSSection>

        {/* Section: What We Can and Cannot Remove (Deep Charcoal #14181F with Steel Cards #242B35) */}
        <CMSSection sectionKey="services_guidelines" label="Acceptable Waste Guidelines">
          <section className="py-14 sm:py-20 bg-[#14181F] text-white border-t border-[#343B46]">
            <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                  ACCEPTABLE WASTE GUIDELINES
                </span>
                <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-tight">
                  WHAT WE CAN & CANNOT REMOVE
                </h2>
                <p className="text-sm text-[#CBD5E1] mt-2">
                  Clear transparency so you know exactly what our trucks and crews can haul.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Accepted Materials */}
                <div className="bg-[#242B35] border border-[#343B46] rounded-xl p-5 sm:p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#343B46]">
                    <div className="w-10 h-10 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-bold text-lg text-white">Accepted Materials</h3>
                      <span className="text-xs text-[#CBD5E1]">Suitable for standard collection</span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm text-[#CBD5E1]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Construction & renovation timber off-cuts</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Gyprock, plasterboard, and insulation batts</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Cardboard packaging, pallets, and plastics</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Bricks, pavers, concrete chunks, and tiles</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Metal framing, pipes, roofing iron, and ducting</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Commercial fit-out fixtures, shelves, and carpet</span>
                    </li>
                  </ul>
                </div>

                {/* Excluded Materials */}
                <div className="bg-[#242B35] border border-[#343B46] rounded-xl p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#343B46]">
                    <div className="w-10 h-10 rounded-full bg-red-950/60 text-red-400 border border-red-800 flex items-center justify-center">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-bold text-lg text-white">Excluded Hazardous Waste</h3>
                      <span className="text-xs text-[#CBD5E1]">Requires licensed hazardous treatment</span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm text-[#CBD5E1]">
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Asbestos or bonded asbestos sheeting (AC)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Wet paints, solvents, thinners, and chemicals</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Gas bottles and pressurized cylinders</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Biohazardous waste and medical sharps</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Explosives and radioactive materials</span>
                    </li>
                  </ul>

                  <div className="mt-6 p-3 rounded bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      If you have questions about an uncertain material on your site, please disclose it when requesting your quote so our team can provide guidance.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </CMSSection>

        {/* Ready to Clear Your Site? (Closing CTA #080A0D) */}
        <CMSSection sectionKey="services_cta" label="Bottom Call to Action">
          <section className="bg-[#080A0D] text-white py-12 sm:py-16 px-4 border-t border-[#343B46]">
            <div className="max-w-site mx-auto text-center">
              <h2 className="font-bebas text-4xl sm:text-5xl text-white mb-4">
                READY TO CLEAR YOUR SITE?
              </h2>
              <p className="text-gray-300 max-w-lg mx-auto text-sm sm:text-base mb-8">
                Tell us what needs to be removed and request a straightforward, no-obligation quote today.
              </p>
              <Link
                href="/get-a-quote"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm tracking-wider uppercase px-8 py-4 rounded transition-all shadow-xl shadow-safety-orange/20"
              >
                <span>REQUEST A QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </CMSSection>
      </main>

      <Footer />
    </div>
  );
}
