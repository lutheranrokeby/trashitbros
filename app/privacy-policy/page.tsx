import React from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
            LEGAL
          </span>
          <h1 className="font-bebas text-5xl sm:text-6xl text-white mb-8">
            PRIVACY POLICY
          </h1>

          <div className="space-y-6 text-sm text-[#CBD5E1] leading-relaxed bg-[#14181F] border border-[#343B46] p-8 rounded-xl shadow-xl">
            <p>
              This Privacy Policy explains how Trash It Bros (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and safeguards personal information gathered through our website and quote enquiry system in accordance with the Australian Privacy Principles (APPs) set out in the Privacy Act 1988 (Cth).
            </p>

            <h3 className="font-montserrat font-bold text-base text-white pt-2">
              1. Information We Collect
            </h3>
            <p>
              When you submit a quote request or contact enquiry, we collect details including your name, email address, phone number, customer type, site address or suburb, project specifications, and any photographs of waste materials you choose to upload.
            </p>

            <h3 className="font-montserrat font-bold text-base text-white pt-2">
              2. How We Use Your Information
            </h3>
            <p>
              We use your information solely to assess waste collection requirements, calculate accurate pricing, contact you regarding your quotation, schedule services, and provide customer support.
            </p>

            <h3 className="font-montserrat font-bold text-base text-white pt-2">
              3. Protection of Uploaded Media
            </h3>
            <p>
              Photographs uploaded through our quotation system are treated as private enquiry records and are not published or made visible in public website galleries without prior customer consent.
            </p>

            <h3 className="font-montserrat font-bold text-base text-white pt-2">
              4. Contacting Us
            </h3>
            <p>
              If you have any questions or wish to update your details, please reach out to our team at info@trashitbros.com.au.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
