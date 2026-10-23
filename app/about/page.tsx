import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { InlineText } from '@/components/cms/InlineText';
import { InlineImage } from '@/components/cms/InlineImage';
import { CMSSection } from '@/components/cms/CMSSection';
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
            <InlineImage
              fieldKey="hero_bg_image"
              defaultSrc="/images/truck-site.jpg"
              alt="Trash It Bros Construction Truck"
              className="w-full h-full object-cover opacity-25 object-center"
              containerClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080A0D] via-[#080A0D]/90 to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <InlineText
                fieldKey="hero_eyebrow"
                defaultValue="ABOUT TRASH IT BROS"
                as="span"
                className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-3"
              />
              <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
                <InlineText
                  fieldKey="hero_title_1"
                  defaultValue="HARD WORK."
                  as="span"
                  className="block text-white"
                />
                <InlineText
                  fieldKey="hero_title_2"
                  defaultValue="CLEAN RESULTS."
                  as="span"
                  className="block text-safety-orange"
                />
              </h1>
              <InlineText
                fieldKey="hero_description"
                defaultValue="Straightforward, dependable rubbish removal designed for Sunshine Coast builders, trades, business owners, and property managers."
                as="p"
                multiline
                className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-8 font-inter"
              />
              <Link
                href="/get-a-quote"
                className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm tracking-wider uppercase px-8 py-4 rounded transition-all shadow-xl shadow-safety-orange/20"
              >
                <InlineText
                  fieldKey="hero_cta_text"
                  defaultValue="REQUEST A QUOTE"
                  as="span"
                />
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Story & Philosophy (Light Concrete #F3F4F2) */}
        <CMSSection sectionKey="about_story" label="Our Philosophy & Story">
          <section className="py-20 bg-[#F3F4F2] text-[#111827]">
            <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <InlineText
                    fieldKey="story_eyebrow"
                    defaultValue="OUR PHILOSOPHY"
                    as="span"
                    className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2"
                  />
                  <InlineText
                    fieldKey="story_title"
                    defaultValue="KEEPING WORKSITES SAFE & PROGRESSING"
                    as="h2"
                    className="font-bebas text-4xl sm:text-5xl text-[#111827] mb-6 tracking-tight"
                  />
                  <div className="space-y-4 text-[#334155] text-base leading-relaxed">
                    <InlineText
                      fieldKey="story_p1"
                      defaultValue="Trash It Bros was established with a singular focus: to deliver fast, no-nonsense rubbish removal that construction teams and businesses can truly depend on."
                      as="p"
                      multiline
                    />
                    <InlineText
                      fieldKey="story_p2"
                      defaultValue="Worksites move at high speed. Uncollected timber off-cuts, gyprock scraps, packaging, and demolition debris create safety hazards, trade congestion, and costly downtime. We remove that friction by providing scheduled collections, prompt response times, and full-service manual loading."
                      as="p"
                      multiline
                    />
                    <InlineText
                      fieldKey="story_p3"
                      defaultValue="Importantly, we are a collection and haulage service. We provide full truck loading and site clearance. Our team arrives with the truck, loads the agreed materials, and clears the site so you get an immediate result without unsightly bins sitting in driveways or requiring council permits."
                      as="p"
                      multiline
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="clip-badge-orange rounded-xl overflow-hidden shadow-xl border border-[#E2E5E9]">
                    <InlineImage
                      fieldKey="story_image"
                      defaultSrc="/images/worker-clean.jpg"
                      alt="Trash It Bros Crew on Site"
                      className="w-full h-auto object-cover aspect-4/3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </CMSSection>

        {/* Core Values (Dark Charcoal #14181F with Steel Cards #242B35) */}
        <CMSSection sectionKey="about_values" label="What Sets Us Apart & Core Values">
          <section className="py-20 bg-[#14181F] text-white border-t border-[#343B46]">
            <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-16">
                <InlineText
                  fieldKey="values_eyebrow"
                  defaultValue="WHAT SETS US APART"
                  as="span"
                  className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2"
                />
                <InlineText
                  fieldKey="values_heading"
                  defaultValue="OUR CORE VALUES"
                  as="h2"
                  className="font-bebas text-4xl sm:text-5xl text-white tracking-tight"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-6">
                    <Truck className="w-6 h-6" />
                  </div>
                  <InlineText
                    fieldKey="value_1_title"
                    defaultValue="Reliability"
                    as="h3"
                    className="font-montserrat font-bold text-lg text-white mb-2"
                  />
                  <InlineText
                    fieldKey="value_1_desc"
                    defaultValue="When we schedule a collection, we show up on time. Construction schedules depend on certainty."
                    as="p"
                    multiline
                    className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed"
                  />
                </div>

                <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-6">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <InlineText
                    fieldKey="value_2_title"
                    defaultValue="Safety & Site Care"
                    as="h3"
                    className="font-montserrat font-bold text-lg text-white mb-2"
                  />
                  <InlineText
                    fieldKey="value_2_desc"
                    defaultValue="We respect site rules, wear required PPE, and leave driveways and access ways completely clear."
                    as="p"
                    multiline
                    className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed"
                  />
                </div>

                <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-6">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <InlineText
                    fieldKey="value_3_title"
                    defaultValue="Straightforward Rates"
                    as="h3"
                    className="font-montserrat font-bold text-lg text-white mb-2"
                  />
                  <InlineText
                    fieldKey="value_3_desc"
                    defaultValue="No surprise fuel charges or hidden tipping surcharges. Upfront volume rates you can trust."
                    as="p"
                    multiline
                    className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed"
                  />
                </div>

                <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-6">
                    <Target className="w-6 h-6" />
                  </div>
                  <InlineText
                    fieldKey="value_4_title"
                    defaultValue="Clean Results"
                    as="h3"
                    className="font-montserrat font-bold text-lg text-white mb-2"
                  />
                  <InlineText
                    fieldKey="value_4_desc"
                    defaultValue="We do not just throw rubbish into the back. We sweep down and leave the work area thoroughly ready for the next trade."
                    as="p"
                    multiline
                    className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </section>
        </CMSSection>

        {/* Closing CTA (Deep Black #080A0D) */}
        <CMSSection sectionKey="about_cta" label="Bottom Call to Action">
          <section className="py-16 bg-[#080A0D] text-center px-4 border-t border-[#343B46]">
            <div className="max-w-site mx-auto max-w-2xl">
              <InlineText
                fieldKey="cta_heading"
                defaultValue="EXPERIENCE THE DIFFERENCE"
                as="h2"
                className="font-bebas text-4xl sm:text-5xl text-white mb-4"
              />
              <InlineText
                fieldKey="cta_paragraph"
                defaultValue="Reach out today to discuss your next construction project or waste clearance across the Sunshine Coast."
                as="p"
                multiline
                className="text-gray-300 max-w-lg mx-auto text-sm sm:text-base mb-8"
              />
              <Link
                href="/get-a-quote"
                className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm uppercase px-8 py-4 rounded transition-all shadow-xl shadow-safety-orange/20"
              >
                <InlineText
                  fieldKey="cta_btn_text"
                  defaultValue="REQUEST A QUOTE"
                  as="span"
                />
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
