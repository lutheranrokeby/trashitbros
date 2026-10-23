import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { ProjectGallery } from '@/components/public/ProjectGallery';
import { InlineText } from '@/components/cms/InlineText';
import { CMSSection } from '@/components/cms/CMSSection';
import { readDatabase } from '@/lib/cms/db';
import { ArrowRight } from 'lucide-react';

export default function OurWorkPage() {
  const db = readDatabase();
  const projects = db.projects.filter((p) => p.published);

  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-[#080A0D] border-b border-[#343B46] text-center px-4">
          <div className="max-w-site mx-auto">
            <InlineText
              fieldKey="hero_eyebrow"
              defaultValue="PROJECT PORTFOLIO"
              as="span"
              className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2"
            />
            <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
              <InlineText
                fieldKey="hero_headline_1"
                defaultValue="REAL PROJECTS."
                as="span"
                className="block text-white"
              />
              <InlineText
                fieldKey="hero_headline_2"
                defaultValue="CLEAN RESULTS."
                as="span"
                className="block text-safety-orange"
              />
            </h1>
            <InlineText
              fieldKey="hero_description"
              defaultValue="Inspect our verified before-and-after clean-up projects across the Sunshine Coast. Drag the comparison sliders to see the transformation."
              as="p"
              multiline
              className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-6 font-inter"
            />
          </div>
        </section>

        {/* Gallery (Light Concrete #F3F4F2) */}
        <CMSSection sectionKey="our_work_gallery" label="Project Showcase Gallery">
          <section className="py-16 lg:py-20 bg-[#F3F4F2] text-[#111827]">
            <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
              <ProjectGallery initialProjects={projects} />
            </div>
          </section>
        </CMSSection>

        {/* Project CTA (Deep Black #080A0D) */}
        <CMSSection sectionKey="our_work_cta" label="Bottom Call to Action">
          <section className="py-16 bg-[#080A0D] border-t border-[#343B46] px-4 text-center">
            <div className="max-w-site mx-auto max-w-2xl">
              <InlineText
                fieldKey="cta_heading"
                defaultValue="HAVE A SIMILAR PROJECT IN MIND?"
                as="h2"
                className="font-bebas text-4xl sm:text-5xl text-white mb-3"
              />
              <InlineText
                fieldKey="cta_subheading"
                defaultValue="Upload site photos and get an upfront quote for your clean-up."
                as="p"
                multiline
                className="text-gray-300 max-w-md mx-auto text-sm sm:text-base mb-6 font-inter"
              />
              <Link
                href="/get-a-quote"
                className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs sm:text-sm uppercase px-8 py-4 rounded transition-all shadow-xl shadow-safety-orange/20"
              >
                <InlineText
                  fieldKey="cta_button"
                  defaultValue="GET A FREE QUOTE"
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
