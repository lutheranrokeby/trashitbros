import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-charcoal text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center py-24 px-4 text-center">
        <div className="max-w-md mx-auto">
          <span className="font-bebas text-9xl text-safety-orange block leading-none">
            404
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white mb-4">
            PAGE NOT FOUND
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed mb-8">
            The page you are looking for does not exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-6 py-3.5 rounded transition-all shadow-lg shadow-safety-orange/20"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-steel-grey hover:bg-steel-grey/80 text-white font-montserrat font-bold text-xs uppercase px-6 py-3.5 rounded transition-colors"
            >
              <span>Our Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
