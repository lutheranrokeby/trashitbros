import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { readDatabase } from '@/lib/cms/db';
import {
  ArrowRight,
  CheckCircle,
  MapPin,
  ArrowLeft,
} from 'lucide-react';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const db = readDatabase();
  const service = db.services.find((s) => s.slug === slug && s.published);

  if (!service) {
    notFound();
  }

  const otherServices = db.services.filter((s) => s.slug !== slug && s.published);

  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb & Hero */}
        <section className="relative py-12 sm:py-16 lg:py-24 bg-[#080A0D] border-b border-[#343B46] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={service.cardImage}
              alt={service.name}
              className="w-full h-full object-cover opacity-20 object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080A0D] via-[#080A0D]/95 to-transparent" />
          </div>

          <div className="relative z-10 max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-safety-orange hover:text-white uppercase tracking-wider mb-6 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Services Overview
            </Link>

            <div className="max-w-3xl">
              <span className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
                TRASH IT BROS SERVICE
              </span>
              <h1 className="font-bebas text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
                {service.name}
              </h1>
              <p className="text-gray-300 text-base sm:text-xl leading-relaxed mb-8">
                {service.shortDescription}
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                <Link
                  href="/get-a-quote"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm tracking-wider uppercase px-8 py-4 rounded transition-all shadow-xl shadow-safety-orange/20"
                >
                  <span>REQUEST A QUOTE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <MapPin className="w-4 h-4 text-safety-orange" />
                  <span>Sunshine Coast, QLD Service</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Breakdown (Light Concrete #F3F4F2) */}
        <section className="py-12 lg:py-16 bg-[#F3F4F2] text-[#111827]">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Main Content */}
              <div className="lg:col-span-8 space-y-10">
                <div>
                  <h2 className="font-bebas text-4xl sm:text-5xl text-[#111827] mb-4">
                    OVERVIEW & APPROACH
                  </h2>
                  <p className="text-[#334155] text-base sm:text-lg leading-relaxed mb-4">
                    {service.fullDescription}
                  </p>
                  <p className="text-[#334155] text-base leading-relaxed">
                    Keeping worksites clean should never compromise your operational schedule. Trash It Bros brings the trucks, the heavy-duty loading equipment, and the dedicated manpower to get your materials removed promptly and efficiently.
                  </p>
                </div>

                {/* Key Advantages (White Card) */}
                <div className="bg-white border border-[#E2E5E9] rounded-xl p-6 sm:p-8 shadow-sm">
                  <h3 className="font-montserrat font-bold text-lg text-[#111827] mb-5 border-l-4 border-safety-orange pl-3">
                    Key Advantages
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-safety-orange shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-[#111827]">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials We Collect (White Cards with subtle grey borders) */}
                <div>
                  <h3 className="font-bebas text-3xl sm:text-4xl text-[#111827] mb-2">
                    MATERIALS WE COLLECT
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mb-5">
                    Common items collected under this service include:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.wasteExamples.map((item, i) => (
                      <div
                        key={i}
                        className="bg-white border border-[#E2E5E9] px-4 py-3 rounded-lg flex items-center gap-2.5 text-sm text-[#334155] shadow-xs"
                      >
                        <span className="w-1.5 h-1.5 bg-safety-orange rounded-full shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                {/* Need This Removed? (Prominent Charcoal #14181F Card) */}
                <div className="bg-[#14181F] border-2 border-safety-orange rounded-xl p-6 shadow-xl text-white">
                  <span className="text-xs font-montserrat font-bold tracking-wider uppercase text-safety-orange block mb-1">
                    FAST QUOTE
                  </span>
                  <h3 className="font-bebas text-3xl text-white mb-2">
                    NEED THIS REMOVED?
                  </h3>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed mb-6">
                    Upload photos of your site or rubbish pile and our dispatch team will provide a straightforward quote.
                  </p>
                  <Link
                    href="/get-a-quote"
                    className="w-full flex items-center justify-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase py-3.5 rounded transition-colors shadow-lg"
                  >
                    <span>REQUEST QUOTE NOW</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Other Services (White Card) */}
                <div className="bg-white border border-[#E2E5E9] rounded-xl p-6 shadow-sm">
                  <h4 className="font-montserrat font-bold text-xs uppercase text-[#111827] tracking-wider mb-4 border-b border-[#E2E5E9] pb-2">
                    Other Services
                  </h4>
                  <div className="space-y-2.5">
                    {otherServices.map((other) => (
                      <Link
                        key={other.id}
                        href={`/services/${other.slug}`}
                        className="block p-3 rounded-lg bg-[#F3F4F2] hover:bg-[#E2E5E9] border border-[#E2E5E9] transition-colors group"
                      >
                        <span className="font-bebas text-xl text-[#111827] group-hover:text-safety-orange transition-colors block">
                          {other.name}
                        </span>
                        <span className="text-[11px] text-[#64748B] line-clamp-1">
                          {other.shortDescription}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
