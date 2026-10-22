'use client';

import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { FAQItem } from '@/lib/cms/types';

interface FAQAccordionProps {
  initialFaqs: FAQItem[];
}

export function FAQAccordion({ initialFaqs }: FAQAccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(initialFaqs[0]?.id || null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'General', 'Pricing', 'Site Access', 'Materials'];

  const filteredFaqs = initialFaqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-montserrat font-bold uppercase transition-all tracking-wider ${
                activeCategory === cat
                  ? 'bg-safety-orange text-white border border-safety-orange shadow-md shadow-safety-orange/20'
                  : 'bg-white text-[#111827] border border-[#E2E5E9] hover:bg-[#F3F4F2] shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E2E5E9] rounded-lg px-3 py-2 pl-9 text-xs text-[#111827] placeholder-gray-400 focus:outline-none focus:border-safety-orange focus:ring-1 focus:ring-safety-orange shadow-xs transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 text-[#64748B] text-sm">
            No questions found matching your filter.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = activeId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-[#E2E5E9] rounded-xl overflow-hidden bg-white shadow-xs transition-all duration-200"
              >
                <button
                  onClick={() => setActiveId(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 text-[#111827] hover:text-safety-orange transition-colors"
                >
                  <span className="font-montserrat font-bold text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C2410C] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-sm text-[#334155] leading-relaxed border-t border-[#E2E5E9] whitespace-pre-line space-y-2 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
