import React from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { InlineText } from '@/components/cms/InlineText';
import { CRMFormEmbed } from '@/components/public/CRMFormEmbed';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { readDatabase } from '@/lib/cms/db';

export default function ContactPage() {
  const db = readDatabase();
  const form = db.forms?.find((f) => f.id === 'contact-form');

  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-14 sm:py-20 lg:py-28 bg-[#080A0D] border-b border-[#343B46] text-center px-4">
          <div className="max-w-site mx-auto">
            <InlineText
              fieldKey="hero_eyebrow"
              defaultValue="GET IN TOUCH"
              as="span"
              className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2"
            />
            <h1 className="font-bebas text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
              <InlineText
                fieldKey="hero_title_1"
                defaultValue="TALK TO"
                as="span"
                className="block text-white"
              />
              <InlineText
                fieldKey="hero_title_2"
                defaultValue="THE TEAM."
                as="span"
                className="block text-safety-orange"
              />
            </h1>
            <InlineText
              fieldKey="hero_description"
              defaultValue="Reach out for quotes, recurring construction accounts, or general collection enquiries across the Sunshine Coast."
              as="p"
              multiline
              className="text-gray-300 max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-6 font-inter"
            />
          </div>
        </section>

        {/* Content Section (Light Concrete #F3F4F2) */}
        <section className="py-10 sm:py-14 lg:py-18 bg-[#F3F4F2] text-[#111827]">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Details */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <InlineText
                    fieldKey="info_heading"
                    defaultValue="CONTACT INFORMATION"
                    as="h2"
                    className="font-bebas text-4xl text-[#111827] mb-2 tracking-tight"
                  />
                  <InlineText
                    fieldKey="info_subheading"
                    defaultValue="Have questions about waste acceptance, site clearance timelines, or pricing? Contact us directly or submit your details online."
                    as="p"
                    multiline
                    className="text-sm text-[#334155] leading-relaxed"
                  />
                </div>

                {/* White Contact Cards */}
                <div className="bg-white border border-[#E2E5E9] rounded-xl p-4 sm:p-7 space-y-5 shadow-sm">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#64748B] uppercase block mb-0.5">Phone</span>
                      <a href="tel:0481975170" className="text-base font-semibold text-[#111827] hover:text-safety-orange transition-colors">
                        <InlineText fieldKey="contact_phone" defaultValue="0481 975 170" as="span" />
                      </a>
                      <span className="text-[11px] text-[#64748B] block mt-0.5">Fast turnaround for quotes & requests</span>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#64748B] uppercase block mb-0.5">Operating Hours</span>
                      <InlineText
                        fieldKey="contact_hours"
                        defaultValue="Mon – Sat: 5:00 AM – 8:00 PM"
                        as="span"
                        className="text-base font-semibold text-[#111827] block"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#64748B] uppercase block mb-0.5">Email</span>
                      <InlineText
                        fieldKey="contact_email"
                        defaultValue="info@trashitbros.com.au"
                        as="span"
                        className="text-base font-semibold text-[#111827]"
                      />
                      <span className="text-[11px] text-[#64748B] block mt-0.5">Fast email turnaround</span>
                    </div>
                  </div>

                  {/* Service Area */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#64748B] uppercase block mb-0.5">Service Area</span>
                      <InlineText
                        fieldKey="contact_area"
                        defaultValue="Sunshine Coast, QLD"
                        as="span"
                        className="text-base font-semibold text-[#111827] block"
                      />
                      <span className="text-[11px] text-[#64748B] block mt-0.5">Caloundra to Noosa & Hinterland</span>
                    </div>
                  </div>
                </div>

                {/* Trust Callout */}
                <div className="bg-[#14181F] border border-[#343B46] rounded-xl p-5 text-white flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-safety-orange/15 border border-safety-orange/30 flex items-center justify-center text-safety-orange shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-sm text-white">Direct Builder Support</h4>
                    <p className="text-xs text-gray-300">Speak with our local operations team directly.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: CRM Form Embed */}
              <div className="lg:col-span-7 bg-[#14181F] border border-[#343B46] rounded-2xl p-4 sm:p-8 text-white shadow-xl">
                <div className="mb-6">
                  <InlineText
                    fieldKey="form_cta_eyebrow"
                    defaultValue="ONLINE ENQUIRY"
                    as="span"
                    className="text-xs font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2"
                  />
                  <InlineText
                    fieldKey="form_cta_title"
                    defaultValue="SEND US A MESSAGE"
                    as="h3"
                    className="font-bebas text-4xl sm:text-5xl text-white tracking-tight"
                  />
                </div>
                <CRMFormEmbed
                  formId="contact-form"
                  defaultName="Contact Us Form"
                  initialEmbedCode={form?.embedCode}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
