import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080A0D] text-white">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-[#080A0D] border-b border-[#343B46] text-center px-4">
          <div className="max-w-site mx-auto">
            <span className="text-xs sm:text-sm font-montserrat font-bold tracking-widest uppercase text-safety-orange block mb-2">
              GET IN TOUCH
            </span>
            <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
              <span className="block text-white">TALK TO</span>
              <span className="block text-safety-orange">THE TEAM.</span>
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-6 font-inter">
              Reach out for quotes, recurring construction accounts, or general collection enquiries across the Sunshine Coast.
            </p>
          </div>
        </section>

        {/* Content Section (Light Concrete #F3F4F2) */}
        <section className="py-14 lg:py-18 bg-[#F3F4F2] text-[#111827]">
          <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Details */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h2 className="font-bebas text-4xl text-[#111827] mb-2 tracking-tight">
                    CONTACT INFORMATION
                  </h2>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    Have questions about waste acceptance, site clearance timelines, or pricing? Contact us directly or submit your details online.
                  </p>
                </div>

                {/* White Contact Cards */}
                <div className="bg-white border border-[#E2E5E9] rounded-xl p-6 sm:p-7 space-y-5 shadow-sm">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#64748B] uppercase block mb-0.5">Phone</span>
                      <a href="tel:0481975170" className="text-base font-semibold text-[#111827] hover:text-safety-orange transition-colors">
                        0481 975 170
                      </a>
                      <span className="text-[11px] text-[#64748B] block mt-0.5">Available 24/7 for quotes & urgent requests</span>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#64748B] uppercase block mb-0.5">Operating Hours</span>
                      <span className="text-base font-semibold text-[#111827]">Mon – Sat: 6:00 AM – 6:00 PM</span>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center bg-safety-orange/15 border border-safety-orange/30 text-[#C2410C] font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wide">
                          ★ 24/7 On-Call Service
                        </span>
                        <span className="text-[11px] text-[#64748B]">Emergency & site clean-ups</span>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C2410C] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-montserrat font-bold text-[#64748B] uppercase block mb-0.5">Email</span>
                      <span className="text-base font-semibold text-[#111827]">info@trashitbros.com.au</span>
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
                      <span className="text-base font-semibold text-[#111827]">Sunshine Coast, QLD</span>
                      <span className="text-[11px] text-[#64748B] block mt-0.5">Caloundra to Noosa & Hinterland</span>
                    </div>
                  </div>
                </div>

                {/* Reminder Box */}
                <div className="p-5 rounded-xl bg-white border border-[#E2E5E9] shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-montserrat font-bold text-safety-orange uppercase mb-1.5">
                    <ShieldCheck className="w-4 h-4" /> Important Reminder
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    Trash It Bros collects and removes rubbish directly using our trucks and crew. <strong>We provide full truck loading and site clearance.</strong>
                  </p>
                </div>
              </div>

              {/* Right: Request a Quote card (Deep Charcoal #14181F for strong visual contrast) */}
              <div className="lg:col-span-7 bg-[#14181F] border border-[#343B46] rounded-xl p-8 sm:p-12 shadow-xl flex flex-col justify-center text-white">
                <span className="text-xs font-montserrat font-bold uppercase tracking-widest text-safety-orange block mb-2">
                  NEED A FAST PRICE?
                </span>
                <h3 className="font-bebas text-5xl sm:text-6xl text-white mb-4 tracking-tight">
                  REQUEST A FREE QUOTE ONLINE
                </h3>
                <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed mb-8 font-inter">
                  For the quickest quotation, use our dedicated quote form where you can attach photos of the waste pile and specify site access details.
                </p>
                <div>
                  <Link
                    href="/get-a-quote"
                    className="inline-flex items-center justify-center gap-2.5 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-sm tracking-wider uppercase py-4 px-8 rounded-md transition-all shadow-xl shadow-safety-orange/20"
                  >
                    <span>GO TO QUOTE REQUEST FORM</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
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
