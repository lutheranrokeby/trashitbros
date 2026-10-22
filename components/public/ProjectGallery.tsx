'use client';

import React, { useState } from 'react';
import { ProjectItem } from '@/lib/cms/types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { MapPin, Tag } from 'lucide-react';

interface ProjectGalleryProps {
  initialProjects: ProjectItem[];
}

export function ProjectGallery({ initialProjects }: ProjectGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Construction', 'Renovation', 'Commercial', 'Residential'];

  const filteredProjects = initialProjects.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="space-y-10">
      {/* Category Filter Pills (Light surface context) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-lg text-xs font-montserrat font-bold uppercase transition-all tracking-wider ${
              activeCategory === cat
                ? 'bg-safety-orange text-white border border-safety-orange shadow-md shadow-safety-orange/20'
                : 'bg-white text-[#111827] border border-[#E2E5E9] hover:bg-[#F3F4F2] shadow-xs'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Projects (Deep Charcoal #14181F Cards framing photography) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-[#14181F] border border-[#343B46] rounded-xl overflow-hidden shadow-xl flex flex-col"
          >
            {/* Interactive Before/After Comparison */}
            <div className="p-3 bg-[#080A0D]">
              <BeforeAfterSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                beforeAlt={`${project.title} - Before`}
                afterAlt={`${project.title} - After`}
              />
              <div className="flex items-center justify-between px-2 pt-2.5 text-[11px] text-gray-400">
                <span>◀ Slide to inspect results ▶</span>
                <span className="text-safety-orange font-bold uppercase">{project.category}</span>
              </div>
            </div>

            {/* Info Card */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 text-xs text-[#CBD5E1] mb-2.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-safety-orange" /> {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-safety-orange" /> {project.wasteType}
                  </span>
                </div>
                <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-[#CBD5E1] leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
