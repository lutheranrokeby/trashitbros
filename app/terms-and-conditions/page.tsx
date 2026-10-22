import React from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
            LEGAL
          </span>
          <h1 className="font-bebas text-5xl sm:text-6xl text-white mb-8">
            TERMS & CONDITIONS
          </h1>

          <div className="space-y-6 text-sm text-[#CBD5E1] leading-relaxed bg-[#14181F] border border-[#343B46] p-8 rounded-xl shadow-xl">
            <h3 className="font-montserrat font-bold text-base text-white pt-2">
              1. Service Scope & Important Notice
            </h3>
            <p>
              Trash It Bros provides manual rubbish removal and construction site waste collection services. <strong>We provide full-service truck haulage and rubbish loading.</strong> All collections involve our team arriving with a transport vehicle, loading agreed materials, and hauling them for disposal or recycling.
            </p>

            <h3 className="font-montserrat font-bold text-base text-white pt-2">
              2. Quotations & Pricing
            </h3>
            <p>
              Online quotes provided based on photographs or estimated quantities are preliminary and subject to physical verification of waste volume, weight, and site access upon our arrival. Any discrepancy will be discussed and agreed upon prior to loading.
            </p>

            <h3 className="font-montserrat font-bold text-base text-white pt-2">
              3. Prohibited Materials
            </h3>
            <p>
              Customers warrant that waste presented for collection does not contain asbestos, regulated hazardous chemicals, flammable liquids, pressurized cylinders, or biohazardous waste. Trash It Bros reserves the right to refuse collection of any dangerous or non-compliant materials.
            </p>

            <h3 className="font-montserrat font-bold text-base text-white pt-2">
              4. Site Access & Safety
            </h3>
            <p>
              The client is responsible for ensuring reasonable, safe access to the rubbish pile for our vehicles and personnel.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
