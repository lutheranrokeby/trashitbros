'use client';

import React, { useState, useRef, useCallback } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = 'Before Clean-Up',
  afterAlt = 'After Clean-Up',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-label="Before and after image comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={handleKeyDown}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-lg border border-steel-grey shadow-2xl bg-charcoal aspect-video max-h-[500px] cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-safety-orange ${className}`}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 z-10 bg-near-black/80 backdrop-blur-sm text-white font-montserrat font-bold text-xs px-3 py-1 rounded border border-steel-grey/60 tracking-wider">
        AFTER
      </div>

      {/* Before Image (Clipped layer) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
          }}
        />
        <div className="absolute top-4 left-4 z-10 bg-near-black/80 backdrop-blur-sm text-white font-montserrat font-bold text-xs px-3 py-1 rounded border border-steel-grey/60 tracking-wider">
          BEFORE
        </div>
      </div>

      {/* Divider line and handle */}
      <div
        className="absolute top-0 bottom-0 z-20 w-1 bg-safety-orange shadow-[0_0_10px_rgba(249,115,22,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-safety-orange border-2 border-white shadow-xl flex items-center justify-center text-white">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M8 9l-4 3 4 3m8-6l4 3-4 3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
