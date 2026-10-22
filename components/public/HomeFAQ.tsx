'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { FAQItem } from '@/lib/cms/types';
import { InlineText } from '@/components/cms/InlineText';

interface HomeFAQProps {
  faqs: FAQItem[];
}

export function HomeFAQ({ faqs }: HomeFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayFaqs = [...faqs]
    .filter((f) => f.published !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {displayFaqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.id || index}
            className="border-b border-neutral-800 pb-4 transition-colors"
          >
            <div
              onClick={() => toggleFAQ(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFAQ(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left py-2 group focus:outline-none cursor-pointer select-none"
            >
              <span className="font-montserrat font-medium text-sm sm:text-base text-gray-200 group-hover:text-safety-orange transition-colors pr-4">
                <InlineText
                  fieldKey={`faq_${faq.id}_question`}
                  defaultValue={faq.question}
                />
              </span>
              <span className="text-safety-orange shrink-0 pl-4">
                <ChevronDown
                  className={`w-4 h-4 text-safety-orange stroke-[2.2] transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </span>
            </div>
            {isOpen && (
              <div className="pt-2 pb-1 text-sm text-gray-400 leading-relaxed font-normal whitespace-pre-line space-y-2">
                <InlineText
                  fieldKey={`faq_${faq.id}_answer`}
                  defaultValue={faq.answer}
                  as="div"
                  multiline
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Premium CTA Card beneath the final FAQ */}
      <div className="mt-8 bg-[#121212] border border-neutral-800/80 border-l-4 border-l-safety-orange rounded-xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bebas text-xl sm:text-2xl text-white tracking-wide">
            STILL HAVE QUESTIONS?
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md">
            Not sure what you need removed? Send us a few details and we&apos;ll help you find the right solution.
          </p>
        </div>
        <Link
          href="/get-a-quote"
          className="inline-flex items-center justify-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-3 rounded-lg transition-all shrink-0 shadow-lg shadow-safety-orange/20 hover:scale-[1.02]"
        >
          <span>GET A FREE QUOTE</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
