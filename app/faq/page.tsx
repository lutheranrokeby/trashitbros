import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { FAQAccordion } from '@/components/public/FAQAccordion';
import { InlineText } from '@/components/cms/InlineText';
import { CMSSection } from '@/components/cms/CMSSection';
import { readDatabase } from '@/lib/cms/db';
import { ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const db = readDatabase();
  const faqs = db.faqs.filter((f) => f.published);

  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-[#080A0D] border-b border-[#343B46] text-center px-4">
          <div className="max-w-site mx-auto">
            <InlineText
              fieldKey="hero_eyebrow"
              defaultValue="FREQUENTLY ASKED QUESTIONS"
              as="span"
              className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2"
            />
            <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
              <InlineText
                fieldKey="hero_headline_1"
                defaultValue="GOOD TO "
                as="span"
                className="text-white"
              />
              <InlineText
                fieldKey="hero_headline_2"
                defaultValue="KNOW."
                as="span"
                className="text-safety-orange"
              />
            </h1>
            <InlineText
              fieldKey="hero_description"
              defaultValue="Answers to common questions regarding waste collection, acceptable materials, pricing, and how our process works."
              as="p"
              multiline
              className="text-gray-300 max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-6 font-inter"
            />
          </div>
        </section>

        {/* FAQs (Light Concrete #F3F4F2) */}
        <CMSSection sectionKey="faq_list" label="FAQ Accordion List">
          <section className="py-14 lg:py-18 bg-[#F3F4F2] text-[#111827]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <FAQAccordion initialFaqs={faqs} />
            </div>
          </section>
        </CMSSection>

        {/* Still Have Questions? (Deep Charcoal #14181F) */}
        <CMSSection sectionKey="faq_cta" label="Bottom Call to Action">
          <section className="py-16 bg-[#14181F] border-t border-[#343B46] px-4 text-center">
            <div className="max-w-site mx-auto max-w-xl">
              <InlineText
                fieldKey="cta_heading"
                defaultValue="STILL HAVE QUESTIONS?"
                as="h2"
                className="font-bebas text-4xl sm:text-5xl text-white mb-3"
              />
              <InlineText
                fieldKey="cta_subheading"
                defaultValue="Our team is ready to assist with any questions about your specific site or materials."
                as="p"
                multiline
                className="text-[#CBD5E1] max-w-md mx-auto text-sm sm:text-base mb-6 font-inter"
              />
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs sm:text-sm uppercase px-8 py-4 rounded transition-all shadow-xl shadow-safety-orange/20"
              >
                <InlineText
                  fieldKey="cta_btn"
                  defaultValue="CONTACT US"
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
