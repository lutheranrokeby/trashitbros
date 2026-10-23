'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FormInput,
  Save,
  CheckCircle2,
  AlertCircle,
  Code,
  ExternalLink,
  Plus,
  RefreshCw,
  Copy,
  Trash2,
  Eye,
  Info,
  Sparkles,
} from 'lucide-react';
import { FormEmbedItem } from '@/lib/cms/types';

const LUTHERAN_CRM_TEMPLATE = `<iframe
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

function FormsManagerContent() {
  const searchParams = useSearchParams();
  const requestedFormId = searchParams.get('form');

  const [forms, setForms] = useState<FormEmbedItem[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>('quote-form');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form draft state for currently selected form
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPageUrl, setFormPageUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  const previewContainerRef = useRef<HTMLDivElement>(null);

  const fetchForms = useCallback(async () => {
    try {
      const res = await fetch('/api/cms/forms');
      if (res.ok) {
        const data = await res.json();
        setForms(data || []);

        // Pick requested form from URL if provided, otherwise first form
        const initialId =
          requestedFormId && data.some((f: FormEmbedItem) => f.id === requestedFormId)
            ? requestedFormId
            : data[0]?.id || 'quote-form';

        setSelectedFormId(initialId);
        loadSelectedIntoState(initialId, data);
      }
    } catch (err) {
      console.error('Failed to load forms:', err);
    } finally {
      setLoading(false);
    }
  }, [requestedFormId]);

  // Fetch all forms on mount
  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const loadSelectedIntoState = (id: string, list = forms) => {
    const found = list.find((f) => f.id === id);
    if (found) {
      setFormName(found.name || '');
      setFormDesc(found.description || '');
      setFormPageUrl(found.pageUrl || '');
      setEmbedCode(found.embedCode || '');
    } else {
      setFormName('');
      setFormDesc('');
      setFormPageUrl('');
      setEmbedCode('');
    }
  };

  // When selected form changes
  const handleSelectForm = (id: string) => {
    setSelectedFormId(id);
    loadSelectedIntoState(id, forms);
    setNotification(null);
  };

  // Sync preview whenever embedCode changes
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const container = previewContainerRef.current;
    container.innerHTML = embedCode || '<div class="text-gray-500 text-xs text-center py-12">No embed code to preview.</div>';

    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

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

  // Save current form
  const handleSave = async () => {
    setSaving(true);
    setNotification(null);

    const updatedItem: FormEmbedItem = {
      id: selectedFormId,
      name: formName.trim() || 'Untitled Form',
      description: formDesc.trim(),
      pageUrl: formPageUrl.trim(),
      embedCode: embedCode.trim(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/cms/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (res.ok) {
        setNotification({
          type: 'success',
          message: `Saved "${updatedItem.name}" embed code! Changes are now live on the website.`,
        });
        // Update local list
        setForms((prev) => {
          const index = prev.findIndex((f) => f.id === selectedFormId);
          if (index !== -1) {
            const next = [...prev];
            next[index] = updatedItem;
            return next;
          }
          return [...prev, updatedItem];
        });
      } else {
        const err = await res.json();
        setNotification({ type: 'error', message: err.error || 'Failed to save form.' });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network error saving form.';
      setNotification({ type: 'error', message: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleAddNewSlot = () => {
    const newId = `custom-form-${Date.now().toString().slice(-4)}`;
    const newForm: FormEmbedItem = {
      id: newId,
      name: 'New Custom Form',
      description: 'Custom CRM or questionnaire embed',
      pageUrl: '/',
      embedCode: '',
      updatedAt: new Date().toISOString(),
    };
    setForms((prev) => [...prev, newForm]);
    setSelectedFormId(newId);
    setFormName(newForm.name);
    setFormDesc(newForm.description || '');
    setFormPageUrl(newForm.pageUrl || '');
    setEmbedCode('');
  };

  const selectedForm = forms.find((f) => f.id === selectedFormId);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-steel-grey/60">
        <div>
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange">
            CRM & LEAD CAPTURE
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            FORMS & EMBED CODES
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Manage embedded forms across the website. Paste iframe or script embed codes from your CRM (Lutheran CRM, HubSpot, etc.) to immediately connect forms to your lead workflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNewSlot}
            className="flex items-center gap-2 bg-near-black hover:bg-steel-grey/40 text-white font-montserrat font-bold text-xs uppercase px-4 py-2.5 rounded border border-steel-grey transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-safety-orange" /> Add Form Slot
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-2.5 rounded transition-colors shadow-lg shadow-safety-orange/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-700/80 text-emerald-200'
              : 'bg-red-950/70 border-red-700/80 text-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs uppercase font-bold opacity-75 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Two-Column Layout: Form Selector & Form Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Slots List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-gray-400">
              Active Website Form Slots ({forms.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {forms.map((item) => {
              const isSelected = item.id === selectedFormId;
              const hasCode = Boolean(item.embedCode && item.embedCode.trim().length > 0);

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectForm(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-charcoal border-safety-orange shadow-lg shadow-safety-orange/10'
                      : 'bg-charcoal/50 hover:bg-charcoal border-steel-grey/60 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-montserrat font-bold text-sm ${
                        isSelected ? 'text-white' : 'text-gray-200'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        hasCode
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {hasCode ? 'Active Embed' : 'Empty'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                    {item.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span className="text-safety-orange">{item.pageUrl || 'Global'}</span>
                    <span className="text-[10px] text-gray-500">ID: {item.id}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="p-4 rounded-xl bg-near-black/60 border border-steel-grey/60 text-xs text-gray-300 space-y-2 mt-6">
            <div className="flex items-center gap-2 text-white font-montserrat font-bold">
              <Info className="w-4 h-4 text-safety-orange" /> Embedding Instructions
            </div>
            <p className="leading-relaxed">
              When an admin is logged in or editing the website, a <strong>&quot;Change Form Embed Code&quot;</strong> button appears directly above the form on any page. Clicking it brings you right here to update the code.
            </p>
          </div>
        </div>

        {/* Right Column: Code Editor & Live Preview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-charcoal border border-steel-grey rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-steel-grey/60 pb-5">
              <div>
                <span className="text-xs font-montserrat font-bold uppercase text-safety-orange tracking-wider block">
                  EDITING FORM SLOT
                </span>
                <h2 className="font-bebas text-3xl text-white tracking-wide mt-0.5">
                  {formName || selectedFormId}
                </h2>
              </div>

              {formPageUrl && (
                <Link
                  href={formPageUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-montserrat font-bold text-gray-300 hover:text-safety-orange transition-colors bg-near-black px-3 py-2 rounded border border-steel-grey/80"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View on Live Website
                </Link>
              )}
            </div>

            {/* Form Meta Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
                  Form Name / Label
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Get a Quote Form"
                  className="w-full bg-near-black border border-steel-grey rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-safety-orange transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
                  Website Page URL
                </label>
                <input
                  type="text"
                  value={formPageUrl}
                  onChange={(e) => setFormPageUrl(e.target.value)}
                  placeholder="e.g. /get-a-quote"
                  className="w-full bg-near-black border border-steel-grey rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-safety-orange transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1.5">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. Main customer quote request form with photo upload"
                  className="w-full bg-near-black border border-steel-grey rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-safety-orange transition-colors"
                />
              </div>
            </div>

            {/* Code Editor Header & Quick Actions */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <label className="text-xs font-montserrat font-bold uppercase text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-safety-orange" /> Paste Form Embed HTML Code
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEmbedCode(LUTHERAN_CRM_TEMPLATE)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-montserrat font-bold text-safety-orange hover:text-white bg-safety-orange/10 hover:bg-safety-orange/20 border border-safety-orange/30 px-3 py-1.5 rounded transition-colors"
                  >
                    <Sparkles className="w-3 h-3" /> Paste Lutheran CRM Template
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmbedCode('')}
                    className="text-[11px] font-montserrat font-bold text-gray-400 hover:text-red-400 px-2 py-1.5 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Textarea Code Editor */}
              <div className="relative">
                <textarea
                  rows={9}
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder="Paste your <iframe ...> and <script> embed code here..."
                  className="w-full bg-near-black border border-steel-grey rounded-xl p-4 font-mono text-xs sm:text-sm text-amber-200 leading-relaxed placeholder-gray-600 focus:outline-none focus:border-safety-orange transition-colors"
                  spellCheck={false}
                />
              </div>
              <span className="text-[11px] text-gray-400 block mt-1.5">
                Tip: Paste complete code blocks including <code>&lt;iframe&gt;</code> and <code>&lt;script&gt;</code>. Both are executed safely and responsive auto-resizing is enabled automatically.
              </span>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-steel-grey/60">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-6 py-3 rounded transition-colors shadow-lg shadow-safety-orange/20 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving Form Embed...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Form Embed Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Interactive Preview Box */}
          <div className="bg-charcoal border border-steel-grey rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-steel-grey/60 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-safety-orange" />
                <h3 className="font-montserrat font-bold text-sm uppercase text-white tracking-wide">
                  Live Form Preview
                </h3>
              </div>
              <span className="text-[11px] text-gray-400 font-mono">
                {embedCode.trim() ? 'Rendering code above' : 'No code entered'}
              </span>
            </div>

            <div className="bg-[#14181F] border border-[#343B46] rounded-xl p-4 sm:p-6 overflow-hidden">
              <div ref={previewContainerRef} className="w-full overflow-hidden min-h-[300px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminFormsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-gray-400 font-mono text-sm">
          Loading Forms & Embeds...
        </div>
      }
    >
      <FormsManagerContent />
    </Suspense>
  );
}
