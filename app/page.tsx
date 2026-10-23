import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { InlineText } from '@/components/cms/InlineText';
import { InlineImage } from '@/components/cms/InlineImage';
import { CMSSection } from '@/components/cms/CMSSection';
import { BeforeAfterSlider } from '@/components/public/BeforeAfterSlider';
import { readDatabase } from '@/lib/cms/db';
import {
  ArrowRight,
  HardHat,
  BadgeDollarSign,
  Recycle,
  CheckCircle,
  CheckCircle2,
  Truck,
  Sparkles,
  ShieldCheck,
  ClipboardCheck,
  PackageCheck,
  ChevronRight,
  Star,
  Phone,
  MapPin,
} from 'lucide-react';

export default function HomePage() {
  const db = readDatabase();
  const services = db.services.filter((s) => s.published);
  const featuredProject = db.projects.find((p) => p.featured) || db.projects[0];
  const testimonials = db.testimonials.filter((t) => t.published);
  const activeOffer = db.offers?.find((o) => o.showOnHome && o.published);

  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1">
        {/* SECTION 1: HERO (Original black-to-photo blend) */}
        <section className="relative min-h-[85vh] lg:min-h-[92vh] max-h-[950px] flex flex-col justify-between overflow-hidden bg-[#080A0D]">
          {/* Background Image with Seamless Atmospheric Gradient Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#080A0D]">
            {/* Full-width responsive hero image */}
            <div className="absolute inset-0 w-full h-full">
              <InlineImage
                fieldKey="hero_image"
                defaultSrc="/images/hero-truck-scene.jpg"
                alt="Trash It Bros Construction Clean-Up Truck"
                className="w-full h-full object-cover object-right"
                containerClassName="w-full h-full"
              />
            </div>

            {/* Desktop & Tablet: Multi-stop horizontal gradient from solid black (#080A0D) on left to crisp truck scene on right */}
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

            {/* Top fade (blends seamlessly with dark menu bar) */}
            <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#080A0D] via-[#080A0D]/80 to-transparent z-10 pointer-events-none" />

            {/* Bottom fade (soft transition into feature strip) */}
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#080A0D] via-[#080A0D]/75 to-transparent z-10 pointer-events-none" />
          </div>

          {/* Hero Content - Strictly anchored to reader's left side */}
          <div className="relative z-20 w-full max-w-site mx-auto px-4 sm:px-10 lg:px-14 xl:px-16 pt-16 sm:pt-24 pb-12 sm:pb-16 flex-1 flex flex-col justify-center items-start text-left">
            <div className="w-full max-w-xl lg:max-w-xl xl:max-w-2xl text-left">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4 text-left">
                <span className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange text-left">
                  <InlineText
                    fieldKey="hero_eyebrow"
                    defaultValue="CONSTRUCTION SITE CLEAN-UPS & RUBBISH REMOVAL"
                  />
                </span>
              </div>

              {/* Bold Bebas Neue Stacked Headline */}
              <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight leading-[0.92] mb-5 sm:mb-6 drop-shadow-sm text-left">
                <span className="block text-white">
                  <InlineText fieldKey="hero_headline_1" defaultValue="YOU BUILD IT." />
                </span>
                <span className="block text-safety-orange">
                  <InlineText fieldKey="hero_headline_2" defaultValue="WE TAKE IT." />
                </span>
              </h1>

              {/* Paragraph */}
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-lg font-inter text-left">
                <InlineText
                  fieldKey="hero_paragraph"
                  defaultValue="Fast, reliable and hassle-free rubbish removal for construction sites, renovations, businesses and homes across the Sunshine Coast."
                  multiline
                />
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 text-left w-full sm:w-auto">
                <Link
                  href="/get-a-quote"
                  className="group flex items-center justify-center gap-2.5 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-md transition-all duration-200 shadow-xl shadow-safety-orange/25 hover:shadow-safety-orange/40"
                >
                  <span>
                    <InlineText fieldKey="hero_cta_primary" defaultValue="GET A FREE QUOTE" />
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/services"
                  className="flex items-center justify-center gap-2 bg-[#080A0D]/70 hover:bg-[#080A0D] text-white border border-[#343B46] hover:border-white font-montserrat font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-4 rounded-md transition-colors backdrop-blur-sm"
                >
                  <span>
                    <InlineText fieldKey="hero_cta_secondary" defaultValue="OUR SERVICES" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: SPECIAL PROMOTIONAL OFFER (Directly below Hero) */}
        {activeOffer && (
          <CMSSection sectionKey="home_offer" label="Special Offer Promotion">
            <section className="relative bg-gradient-to-b from-[#080A0D] via-[#14181F] to-[#080A0D] border-y border-[#343B46] py-12 lg:py-16 overflow-hidden">
              <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#080A0D] border-2 border-safety-orange/40 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Details */}
                    <div className="lg:col-span-7 space-y-5">
                      <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[0.92]">
                        {activeOffer.headline}{' '}
                        <span className="text-safety-orange">{activeOffer.priceHighlight}</span>
                      </h2>

                      {/* Speech Bubble Hook */}
                      <div className="relative bg-white text-[#111827] rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-white max-w-xl">
                        <div className="hidden sm:block absolute -left-3 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-r-[14px] border-r-white border-b-[10px] border-b-transparent" />
                        <p className="font-bebas text-2xl sm:text-3xl text-[#111827] tracking-wide leading-tight uppercase">
                          {activeOffer.hook}
                        </p>
                      </div>

                      {/* Core Inclusions Box with Drop Shadow */}
                      <div className="bg-white border-2 border-[#111827] rounded-xl p-5 sm:p-6 text-[#111827] shadow-[6px_6px_0px_rgba(0,0,0,0.85)] space-y-3 max-w-xl">
                        <p className="font-inter font-bold text-base sm:text-lg text-[#111827]">
                          {activeOffer.summary}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-[#334155] font-semibold">
                          <MapPin className="w-4 h-4 text-safety-orange shrink-0" />
                          <span>{activeOffer.serviceAreas}</span>
                        </div>

                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                            <span className="bg-[#111827] text-white font-mono font-bold px-2 py-0.5 rounded text-xs uppercase mr-1.5">
                              Jobs from $99
                            </span>
                            {activeOffer.pricingNote}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: CTA Box linking to form section below */}
                    <div className="lg:col-span-5 bg-[#14181F] border-2 border-safety-orange/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
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
                        <Link
                          href={`/offers/${activeOffer.slug}#claim-offer`}
                          className="w-full inline-flex items-center justify-center gap-2.5 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm sm:text-base tracking-wider uppercase px-8 py-4 rounded-xl shadow-xl shadow-safety-orange/25 transition-all hover:scale-[1.02] text-center"
                        >
                          <span>{activeOffer.ctaText || 'CLAIM THIS OFFER NOW'}</span>
                          <ArrowRight className="w-5 h-5" />
                        </Link>

                        <a
                          href={`tel:${(activeOffer.phone || '0481975170').replace(/\s+/g, '')}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#080A0D] hover:bg-[#1C222B] text-white border border-[#343B46] font-montserrat font-bold text-sm tracking-wider uppercase px-6 py-3.5 rounded-xl transition-colors text-center"
                        >
                          <Phone className="w-4 h-4 text-safety-orange" />
                          <span>Call {activeOffer.phone || '0481 975 170'}</span>
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
              </div>
            </section>
          </CMSSection>
        )}


        {/* SECTION 2: ABOUT INTRODUCTION (Light Concrete #F3F4F2) */}
        <CMSSection sectionKey="home_about" label="About Us Overview">
        <section className="bg-[#F3F4F2] text-[#111827] py-20 lg:py-28 border-b border-[#E2E5E9]">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Construction truck photo with angular badge accent */}
              <div className="relative">
                <div className="clip-badge-orange relative rounded-lg overflow-hidden shadow-2xl">
                  <InlineImage
                    fieldKey="about_image"
                    defaultSrc="/images/about-construction-truck.jpg"
                    alt="Active construction site rubbish removal truck loaded with timber and waste"
                    className="w-full h-auto object-cover rounded-lg aspect-[4/3]"
                  />
                </div>
                {/* Side Tag Badge */}
                <div className="absolute -bottom-6 right-6 bg-[#14181F] text-white p-4 rounded shadow-xl border-l-4 border-safety-orange hidden sm:block">
                  <span className="font-bebas text-2xl text-safety-orange block leading-none">
                    LESS MESS.
                  </span>
                  <span className="font-bebas text-2xl text-white block leading-none">
                    MORE PROGRESS.
                  </span>
                </div>
              </div>

              {/* Right Content */}
              <div>
                <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                  <InlineText fieldKey="about_eyebrow" defaultValue="ABOUT US" />
                </span>
                <h2 className="font-bebas text-5xl sm:text-6xl text-[#111827] tracking-tight leading-[0.95] mb-6">
                  <InlineText fieldKey="about_headline" defaultValue="HARD WORK. CLEAN RESULTS." />
                </h2>
                <p className="text-[#334155] text-base sm:text-lg leading-relaxed mb-8">
                  <InlineText
                    fieldKey="about_paragraph"
                    defaultValue="At Trash It Bros, we take the mess off your hands so you can focus on what matters. With a strong work ethic and reliable service, we help builders, tradespeople, businesses and homeowners keep their sites clean, safe and ready for the next stage."
                    multiline
                  />
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-safety-orange shrink-0" />
                    <span className="font-montserrat font-semibold text-sm text-[#111827]">
                      <InlineText
                        fieldKey="about_benefit_1"
                        defaultValue="On-time and reliable collection"
                      />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-safety-orange shrink-0" />
                    <span className="font-montserrat font-semibold text-sm text-[#111827]">
                      <InlineText
                        fieldKey="about_benefit_2"
                        defaultValue="Competitive, straightforward pricing"
                      />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-safety-orange shrink-0" />
                    <span className="font-montserrat font-semibold text-sm text-[#111827]">
                      <InlineText
                        fieldKey="about_benefit_3"
                        defaultValue="Flexible solutions for any project size"
                      />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-safety-orange shrink-0" />
                    <span className="font-montserrat font-semibold text-sm text-[#111827]">
                      <InlineText
                        fieldKey="about_benefit_4"
                        defaultValue="Responsible waste handling and disposal"
                      />
                    </span>
                  </div>
                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-[#14181F] hover:bg-[#242B35] text-white font-montserrat font-bold text-xs uppercase px-7 py-3.5 rounded transition-colors shadow-md"
                >
                  <span>MORE ABOUT US</span>
                  <ArrowRight className="w-4 h-4 text-safety-orange" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        </CMSSection>

        {/* SECTION 3: SERVICES (Dark Charcoal #14181F with Steel Cards #242B35) */}
        <CMSSection sectionKey="home_services" label="Services Overview Grid">
        <section className="bg-[#14181F] text-white py-20 lg:py-28">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                  <InlineText fieldKey="services_eyebrow" defaultValue="OUR SERVICES" />
                </span>
                <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-tight leading-[0.95]">
                  <InlineText fieldKey="services_heading_1" defaultValue="RUBBISH REMOVAL FOR " />
                  <span className="text-safety-orange">
                    <InlineText fieldKey="services_heading_2" defaultValue="EVERY PROJECT." />
                  </span>
                </h2>
              </div>
              <p className="text-[#CBD5E1] text-sm sm:text-base max-w-md mt-4 md:mt-0 leading-relaxed">
                <InlineText
                  fieldKey="services_intro"
                  defaultValue="From large construction sites to small home clean-ups, we provide efficient and professional waste removal solutions across the Sunshine Coast and surrounding areas."
                />
              </p>
            </div>

            {/* 4 Cards Grid - STEEL #242B35 CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group relative rounded-xl overflow-hidden border border-[#343B46] bg-[#242B35] flex flex-col justify-between hover:border-safety-orange transition-all duration-300 shadow-xl hover:-translate-y-1"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#080A0D]">
                    <img
                      src={service.cardImage}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#242B35] via-[#242B35]/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-safety-orange text-white font-montserrat font-bold text-xs px-2 py-0.5 rounded">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bebas text-2xl sm:text-3xl text-white group-hover:text-safety-orange transition-colors tracking-wide mb-2">
                        {service.name}
                      </h3>
                      <p className="text-xs text-[#CBD5E1] line-clamp-3 leading-relaxed mb-4">
                        {service.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-montserrat font-bold text-safety-orange group-hover:translate-x-1 transition-transform">
                      <span>LEARN MORE</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        </CMSSection>

        {/* SECTION 4: HOW IT WORKS (Light Concrete #F3F4F2) */}
        <CMSSection sectionKey="home_process" label="How It Works (4 Steps)">
        <section id="how-it-works" className="relative bg-[#F3F4F2] text-[#111827] py-16 lg:py-20 overflow-hidden border-t border-[#E2E5E9]">
          <div className="relative z-10 max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-left mb-10 max-w-xl">
              <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-1">
                <InlineText fieldKey="process_eyebrow" defaultValue="OUR PROCESS" />
              </span>
              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-[#111827] tracking-tight leading-none">
                <InlineText fieldKey="process_heading_1" defaultValue="SIMPLE. FAST. " />
                <span className="text-safety-orange">
                  <InlineText fieldKey="process_heading_2" defaultValue="DONE." />
                </span>
              </h2>
            </div>

            {/* 4 Process Steps Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative items-stretch">
              {/* Step 1 */}
              <div className="group relative bg-[#FFFFFF] border border-[#D9DEE5] rounded-[16px] p-7 sm:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_32px_rgba(15,23,42,0.10)] hover:border-safety-orange/40 hover:-translate-y-1 transition-all duration-[220ms] ease-out flex flex-col items-center text-center justify-start overflow-hidden">
                {/* Subtle orange accent top line */}
                <div className="absolute top-0 inset-x-8 h-[2px] bg-safety-orange/30 group-hover:bg-safety-orange transition-colors duration-[220ms]" />

                {/* Step Number & Icon */}
                <div className="flex items-center justify-center gap-3 w-full mb-4">
                  <span className="font-bebas text-5xl sm:text-6xl text-[#CBD5E1] group-hover:text-slate-400 tracking-wider select-none leading-none transition-colors duration-[220ms]">
                    01
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-safety-orange/[0.09] border border-safety-orange/20 flex items-center justify-center shrink-0 text-safety-orange group-hover:bg-safety-orange group-hover:text-white transition-colors duration-[220ms]">
                    <ClipboardCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                </div>

                <h3 className="font-montserrat font-bold text-base sm:text-lg text-[#080A0D] mb-2 text-center tracking-tight">
                  <InlineText fieldKey="step_1_title" defaultValue="Get a Quote" />
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-center font-inter">
                  <InlineText
                    fieldKey="step_1_desc"
                    defaultValue="Tell us what you need removed and upload photos."
                  />
                </p>
              </div>

              {/* Step 2 */}
              <div className="group relative bg-[#FFFFFF] border border-[#D9DEE5] rounded-[16px] p-7 sm:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_32px_rgba(15,23,42,0.10)] hover:border-safety-orange/40 hover:-translate-y-1 transition-all duration-[220ms] ease-out flex flex-col items-center text-center justify-start overflow-hidden">
                {/* Subtle orange accent top line */}
                <div className="absolute top-0 inset-x-8 h-[2px] bg-safety-orange/30 group-hover:bg-safety-orange transition-colors duration-[220ms]" />

                {/* Step Number & Icon */}
                <div className="flex items-center justify-center gap-3 w-full mb-4">
                  <span className="font-bebas text-5xl sm:text-6xl text-[#CBD5E1] group-hover:text-slate-400 tracking-wider select-none leading-none transition-colors duration-[220ms]">
                    02
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-safety-orange/[0.09] border border-safety-orange/20 flex items-center justify-center shrink-0 text-safety-orange group-hover:bg-safety-orange group-hover:text-white transition-colors duration-[220ms]">
                    <Truck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                </div>

                <h3 className="font-montserrat font-bold text-base sm:text-lg text-[#080A0D] mb-2 text-center tracking-tight">
                  <InlineText fieldKey="step_2_title" defaultValue="We Arrive" />
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-center font-inter">
                  <InlineText
                    fieldKey="step_2_desc"
                    defaultValue="On time and ready to get to work on your site."
                  />
                </p>
              </div>

              {/* Step 3 */}
              <div className="group relative bg-[#FFFFFF] border border-[#D9DEE5] rounded-[16px] p-7 sm:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_32px_rgba(15,23,42,0.10)] hover:border-safety-orange/40 hover:-translate-y-1 transition-all duration-[220ms] ease-out flex flex-col items-center text-center justify-start overflow-hidden">
                {/* Subtle orange accent top line */}
                <div className="absolute top-0 inset-x-8 h-[2px] bg-safety-orange/30 group-hover:bg-safety-orange transition-colors duration-[220ms]" />

                {/* Step Number & Icon */}
                <div className="flex items-center justify-center gap-3 w-full mb-4">
                  <span className="font-bebas text-5xl sm:text-6xl text-[#CBD5E1] group-hover:text-slate-400 tracking-wider select-none leading-none transition-colors duration-[220ms]">
                    03
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-safety-orange/[0.09] border border-safety-orange/20 flex items-center justify-center shrink-0 text-safety-orange group-hover:bg-safety-orange group-hover:text-white transition-colors duration-[220ms]">
                    <PackageCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                </div>

                <h3 className="font-montserrat font-bold text-base sm:text-lg text-[#080A0D] mb-2 text-center tracking-tight">
                  <InlineText fieldKey="step_3_title" defaultValue="We Take It" />
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-center font-inter">
                  <InlineText
                    fieldKey="step_3_desc"
                    defaultValue="We load and clear all agreed waste completely."
                  />
                </p>
              </div>

              {/* Step 4 */}
              <div className="group relative bg-[#FFFFFF] border border-[#D9DEE5] rounded-[16px] p-7 sm:p-8 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_32px_rgba(15,23,42,0.10)] hover:border-safety-orange/40 hover:-translate-y-1 transition-all duration-[220ms] ease-out flex flex-col items-center text-center justify-start overflow-hidden">
                {/* Subtle orange accent top line */}
                <div className="absolute top-0 inset-x-8 h-[2px] bg-safety-orange/30 group-hover:bg-safety-orange transition-colors duration-[220ms]" />

                {/* Step Number & Icon */}
                <div className="flex items-center justify-center gap-3 w-full mb-4">
                  <span className="font-bebas text-5xl sm:text-6xl text-[#CBD5E1] group-hover:text-slate-400 tracking-wider select-none leading-none transition-colors duration-[220ms]">
                    04
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-safety-orange/[0.09] border border-safety-orange/20 flex items-center justify-center shrink-0 text-safety-orange group-hover:bg-safety-orange group-hover:text-white transition-colors duration-[220ms]">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                  </div>
                </div>

                <h3 className="font-montserrat font-bold text-base sm:text-lg text-[#080A0D] mb-2 text-center tracking-tight">
                  <InlineText fieldKey="step_4_title" defaultValue="You Get a Clean Site" />
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed text-center font-inter">
                  <InlineText
                    fieldKey="step_4_desc"
                    defaultValue="Simple, fast and hassle-free results."
                  />
                </p>
              </div>
            </div>
          </div>
        </section>
        </CMSSection>

        {/* SECTION 5: WHY CHOOSE US (Dark Charcoal #14181F with Steel Cards #242B35) */}
        <CMSSection sectionKey="home_why" label="Why Choose Us">
        <section className="bg-[#14181F] text-white py-20 lg:py-24 border-t border-[#343B46]">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                WHY TRASH IT BROS
              </span>
              <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-tight mb-3">
                <InlineText fieldKey="why_heading" defaultValue="RUBBISH REMOVAL. DONE RIGHT." />
              </h2>
              <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed">
                <InlineText
                  fieldKey="why_subheading"
                  defaultValue="Any site, any size. We handle the heavy loading so you can stay focused on your work."
                />
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg">
                <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-5">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-base sm:text-lg text-white mb-2">
                  Reliable & On-Time
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  Scheduled collection times builders and trades can bank on. We show up when promised to eliminate downtime.
                </p>
              </div>

              <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg">
                <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-5">
                  <HardHat className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-base sm:text-lg text-white mb-2">
                  Heavy Lifting Included
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  No heavy lifting for your crew. Our team loads every timber off-cut, rubble pile and junk item directly.
                </p>
              </div>

              <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg">
                <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-5">
                  <BadgeDollarSign className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-base sm:text-lg text-white mb-2">
                  Transparent Pricing
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  Straightforward rates based on volume and waste type with zero hidden tipping or fuel surcharges.
                </p>
              </div>

              <div className="bg-[#242B35] border border-[#343B46] p-7 rounded-xl shadow-lg">
                <div className="w-12 h-12 rounded-full bg-safety-orange/15 border border-safety-orange/40 flex items-center justify-center text-safety-orange mb-5">
                  <Recycle className="w-6 h-6" />
                </div>
                <h3 className="font-montserrat font-bold text-base sm:text-lg text-white mb-2">
                  Responsible Disposal
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                  We sort and recycle construction timber, scrap metal and masonry at licensed local Sunshine Coast facilities.
                </p>
              </div>
            </div>
          </div>
        </section>
        </CMSSection>

        {/* SECTION 6: FEATURED WORK (Light Concrete #F3F4F2) */}
        <CMSSection sectionKey="home_projects" label="Featured Projects (Before & After)" initialHidden={true}>
        <section className="bg-[#F3F4F2] text-[#111827] py-16 lg:py-20 border-t border-[#E2E5E9]">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-5">
                <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-1">
                  <InlineText fieldKey="work_eyebrow" defaultValue="OUR WORK" />
                </span>
                <h2 className="font-bebas text-4xl sm:text-5xl text-[#111827] tracking-tight leading-none mb-3">
                  <InlineText
                    fieldKey="work_heading"
                    defaultValue="REAL PROJECTS. REAL RESULTS."
                  />
                </h2>
                <p className="text-[#334155] text-xs sm:text-sm leading-relaxed mb-4">
                  <InlineText
                    fieldKey="work_paragraph"
                    defaultValue="From large construction sites to home renovations, we have helped countless clients keep their spaces clean and safe."
                    multiline
                  />
                </p>
                <div className="mb-5">
                  <span className="text-[11px] uppercase font-bold text-[#64748B] block mb-0.5">
                    Current Featured Project:
                  </span>
                  <div className="font-montserrat font-bold text-sm text-safety-orange">
                    {featuredProject.title} ({featuredProject.location})
                  </div>
                </div>

                <Link
                  href="/our-work"
                  className="inline-flex items-center gap-2 bg-[#14181F] hover:bg-[#242B35] text-white font-montserrat font-bold text-xs uppercase px-6 py-3 rounded shadow-md transition-colors"
                >
                  <span>VIEW ALL PROJECTS</span>
                  <ArrowRight className="w-3.5 h-3.5 text-safety-orange" />
                </Link>
              </div>

              {/* Right Column: Before/After Slider inside clean white frame */}
              <div className="lg:col-span-7 bg-white border border-[#E2E5E9] p-3 rounded-xl shadow-md">
                <BeforeAfterSlider
                  beforeImage={featuredProject.beforeImage}
                  afterImage={featuredProject.afterImage}
                  beforeAlt="Construction site before clean-up"
                  afterAlt="Clean site after Trash It Bros collection"
                  className="max-h-[280px] sm:max-h-[320px] rounded-lg overflow-hidden"
                />
                <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-2.5 px-1 font-medium">
                  <span>◀ Slide left and right to inspect the clean-up</span>
                  <span className="text-safety-orange font-bold uppercase">100% Real Results</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        </CMSSection>

        {/* SECTION 7: TESTIMONIALS (Light Concrete #F3F4F2 - visually compatible adjoining light surface) */}
        <CMSSection sectionKey="home_testimonials" label="Customer Testimonials">
        {testimonials.length > 0 && (
          <section className="bg-[#F3F4F2] text-[#111827] py-16 sm:py-20 lg:py-24 border-t border-[#E2E5E9]">
            <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                {/* Left Column */}
                <div className="lg:col-span-5">
                  <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-1">
                    WHAT OUR CLIENTS SAY
                  </span>
                  <h2 className="font-bebas text-3xl sm:text-4xl text-[#111827] tracking-tight leading-[0.95] mb-3">
                    TRUSTED BY BUILDERS, BUSINESSES & HOMEOWNERS.
                  </h2>

                  {/* Google Reviews Aggregate Badge */}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span className="font-montserrat font-bold text-xs text-[#111827]">5.0</span>
                    <div className="flex items-center gap-0.5 text-[#FBBC04]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC04]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#64748B] font-medium">Google Reviews</span>
                  </div>
                </div>

                {/* Right Column: Clean White Google Review Card */}
                <div className="lg:col-span-7">
                  <div className="bg-white border border-[#E2E5E9] p-5 sm:p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span className="text-[11px] font-montserrat font-bold text-[#111827]">Verified Google Review</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[#FBBC04]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC04]" />
                        ))}
                      </div>
                    </div>

                    <p className="text-[#334155] text-xs sm:text-sm leading-relaxed mb-3">
                      &quot;{testimonials[0]?.content || 'Trash It Bros keep our sites clean and running smoothly. Reliable, punctual and easy to deal with. Highly recommend!'}&quot;
                    </p>

                    <div className="flex items-center justify-between border-t border-[#E2E5E9] pt-2.5">
                      <div>
                        <span className="font-montserrat font-bold text-xs text-[#111827] inline">
                          {testimonials[0]?.name || 'Local Builder'}
                        </span>
                        <span className="text-[11px] text-[#64748B] ml-2">
                          {testimonials[0]?.role || 'Residential Builder'} • {testimonials[0]?.location || 'Sunshine Coast'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748B] font-medium">via Google</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        </CMSSection>

        {/* SECTION 8: CLOSING CTA (Deep Black #080A0D with Safety Orange Accent) */}
        <CMSSection sectionKey="home_cta" label="Bottom Call to Action">
        <section className="bg-[#080A0D] text-white py-16 lg:py-24 border-t border-[#343B46] text-center px-4">
          <div className="max-w-site mx-auto max-w-3xl">
            <span className="text-xs sm:text-sm font-montserrat font-bold uppercase tracking-wider text-safety-orange block mb-2">
              <InlineText
                fieldKey="cta_eyebrow"
                defaultValue="READY TO GET RID OF THE MESS?"
              />
            </span>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-4 text-white">
              <span className="block text-white">GOT RUBBISH?</span>
              <span className="block text-safety-orange">WE&apos;LL TAKE IT.</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 font-inter max-w-xl mx-auto">
              <InlineText
                fieldKey="cta_subheading"
                defaultValue="No obligation. Fast response. Competitive pricing for Sunshine Coast projects."
              />
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/get-a-quote"
                className="inline-flex items-center gap-2.5 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-md shadow-xl shadow-safety-orange/20 transition-all duration-200 hover:scale-105"
              >
                <span>
                  <InlineText fieldKey="cta_button" defaultValue="Get a Free Quote" />
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:0481975170"
                className="inline-flex items-center gap-2 bg-[#14181F] hover:bg-[#242B35] text-white border border-[#343B46] font-montserrat font-bold text-sm tracking-wider uppercase px-7 py-4 rounded-md transition-colors"
              >
                <Phone className="w-4 h-4 text-safety-orange" />
                <span>Call 0481 975 170</span>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
              <span>Mon – Sat: 6:00 AM – 6:00 PM</span>
              <span>•</span>
              <span className="text-safety-orange font-semibold">★ 24/7 On-Call Available</span>
              <span>•</span>
              <span>Sunshine Coast & Surrounds</span>
            </div>
          </div>
        </section>
        </CMSSection>
      </main>

      <Footer />
    </div>
  );
}
