'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCMS } from '@/components/cms/CMSContext';
import { Edit3, FormInput, Phone, AlertCircle } from 'lucide-react';

interface CRMFormEmbedProps {
  formId?: string;
  defaultName?: string;
  initialEmbedCode?: string;
  className?: string;
}

const DEFAULT_LUTHERAN_EMBED = `<iframe
  id="lcrm-form-11d189de"
  src="https://lutheran.netlify.app/portal/forms/11d189de-8cd7-4cb9-b2af-31f1a8986654?embed=true"
  width="100%"
  height="680"
  style="border:none; width:100%; overflow:hidden;"
  loading="lazy"
  title="Connect with us!"
></iframe>
<script>
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'LCRM_FORM_RESIZE' && e.data.templateId === '11d189de-8cd7-4cb9-b2af-31f1a8986654') {
      var el = document.getElementById('lcrm-form-11d189de');
      if (el && e.data.height) el.style.height = e.data.height + 'px';
    }
  });
</script>`;

export function CRMFormEmbed({
  formId = 'quote-form',
  defaultName = 'Quote Form',
  initialEmbedCode,
  className = '',
}: CRMFormEmbedProps) {
  const { user, isEditMode } = useCMS();
  const [name, setName] = useState(defaultName);
  const [embedCode, setEmbedCode] = useState<string>(
    typeof initialEmbedCode === 'string' ? initialEmbedCode : DEFAULT_LUTHERAN_EMBED
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync client-side with database in case embed code was updated dynamically
  useEffect(() => {
    let isMounted = true;
    async function loadForm() {
      try {
        const res = await fetch(`/api/cms/forms?id=${encodeURIComponent(formId)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            if (data.name) setName(data.name);
            if (typeof data.embedCode === 'string') setEmbedCode(data.embedCode);
          }
        }
      } catch {
        // Keep initial or fallback embed code
      }
    }
    loadForm();
    return () => {
      isMounted = false;
    };
  }, [formId]);

  // Execute scripts inside embed code safely & setup resize listeners
  useEffect(() => {
    if (!containerRef.current || !embedCode.trim()) return;

    const container = containerRef.current;

    // Dynamically re-execute any <script> tags inside the embed HTML
    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    // Auto-resize message listener for Lutheran CRM and standard postMessage embeds
    function handleResize(e: MessageEvent) {
      if (e.data && e.data.type === 'LCRM_FORM_RESIZE' && e.data.height) {
        const iframes = container.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
          iframe.style.height = `${e.data.height}px`;
        });
      }
    }

    window.addEventListener('message', handleResize);
    return () => {
      window.removeEventListener('message', handleResize);
    };
  }, [embedCode]);

  const isAdmin = Boolean(user || isEditMode);
  const hasEmbedCode = Boolean(embedCode && embedCode.trim().length > 0);

  return (
    <div className={`w-full ${className}`}>
      {/* Admin Quick Action Bar */}
      {isAdmin && (
        <div className="bg-[#1C222B] border border-safety-orange/40 rounded-xl p-3 sm:p-4 mb-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-safety-orange animate-pulse shrink-0" />
            <div>
              <span className="text-xs font-montserrat font-bold text-white uppercase tracking-wider block">
                {name || defaultName}
              </span>
              <span className="text-[11px] text-gray-400">
                Form Slot: <code className="text-gray-300 font-mono">{formId}</code> • Admin Controls Active
              </span>
            </div>
          </div>

          <Link
            href={`/admin/forms?form=${encodeURIComponent(formId)}`}
            className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white text-xs font-montserrat font-bold uppercase px-3.5 py-2 rounded transition-colors shadow-md shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" /> Change Form Embed Code
          </Link>
        </div>
      )}

      {/* Embedded Form or Fallback */}
      {hasEmbedCode ? (
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: embedCode }}
          className="w-full overflow-hidden rounded-xl bg-transparent min-h-[380px] max-w-full [&_iframe]:!w-full [&_iframe]:!max-w-full [&_iframe]:!min-w-0 [&_iframe]:border-0"
        />
      ) : isAdmin ? (
        /* Admin Empty State */
        <div className="border-2 border-dashed border-steel-grey/70 bg-near-black/50 rounded-xl p-8 text-center">
          <FormInput className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h4 className="font-montserrat font-bold text-sm uppercase text-white mb-1">
            No Form Embed Code Configured
          </h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            There is currently no embed code set for <span className="text-white font-semibold">{name || defaultName}</span>. Click below to paste your CRM iframe or embed snippet in the admin dashboard.
          </p>
          <Link
            href={`/admin/forms?form=${encodeURIComponent(formId)}`}
            className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white text-xs font-montserrat font-bold uppercase px-4 py-2.5 rounded transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Paste Form Embed Code
          </Link>
        </div>
      ) : (
        /* Visitor Fallback when no embed code configured */
        <div className="bg-[#14181F] border border-[#343B46] rounded-xl p-8 text-center text-white">
          <AlertCircle className="w-10 h-10 text-safety-orange mx-auto mb-3" />
          <h4 className="font-bebas text-2xl tracking-wide mb-2">
            CONNECT WITH TRASH IT BROS
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-5">
            Our online quote form is temporarily updating. You can contact our operations crew directly by phone for an immediate upfront quote.
          </p>
          <a
            href="tel:0481975170"
            className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-3 rounded transition-colors"
          >
            <Phone className="w-4 h-4" /> Call 0481 975 170
          </a>
        </div>
      )}
    </div>
  );
}
