'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Upload,
  X,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_COUNT = 10;

function validateEmail(email: string): boolean {
  if (!email.trim()) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePhone(phone: string): boolean {
  if (!phone.trim()) return false;
  const clean = phone.replace(/[\s\-\(\)\.]/g, '');
  if (!/^\+?[0-9]{8,15}$/.test(clean)) return false;
  const digits = clean.replace(/^\+/, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function QuoteForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [noPhotos, setNoPhotos] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    contact?: string;
    email?: string;
    phone?: string;
    photos?: string;
  }>({});
  const [successData, setSuccessData] = useState<{ reference: string; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incomingFiles: File[]) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setErrorMessage('');

    const validNewFiles: File[] = [];
    const errors: string[] = [];

    incomingFiles.forEach((file) => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        errors.push(`"${file.name}" is not a supported image format. Please use JPG, PNG, or WebP.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" exceeds the 10MB limit.`);
        return;
      }
      validNewFiles.push(file);
    });

    if (errors.length > 0) {
      setErrorMessage(errors[0]);
    }

    if (validNewFiles.length === 0) return;

    const combined = [...selectedFiles, ...validNewFiles].slice(0, MAX_FILE_COUNT);
    setSelectedFiles(combined);

    // Previews
    const previews = combined.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);

    // Automatically untick the noPhotos checkbox if photos are added
    if (noPhotos) {
      setNoPhotos(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    handleFiles(files);
  };

  const removeFile = (index: number) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);

    const updatedPreviews = [...filePreviews];
    updatedPreviews.splice(index, 1);
    setFilePreviews(updatedPreviews);
  };

  const handleNoPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked && selectedFiles.length > 0) {
      const confirmClear = window.confirm(
        'Selecting "I don\'t have photos" will clear your currently uploaded photos. Continue?'
      );
      if (confirmClear) {
        setSelectedFiles([]);
        setFilePreviews([]);
        setNoPhotos(true);
        if (fieldErrors.photos) {
          setFieldErrors((prev) => ({ ...prev, photos: undefined }));
        }
      }
    } else {
      setNoPhotos(checked);
      if (fieldErrors.photos) {
        setFieldErrors((prev) => ({ ...prev, photos: undefined }));
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: {
      fullName?: string;
      contact?: string;
      email?: string;
      phone?: string;
      photos?: string;
    } = {};

    // 1. Full name required
    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }

    // 2. Contact validation (email OR phone required)
    const hasEmail = Boolean(email.trim());
    const hasPhone = Boolean(phone.trim());

    if (!hasEmail && !hasPhone) {
      errors.contact = 'Please provide either an email address or phone number so we can reach you.';
    } else {
      if (hasEmail && !validateEmail(email)) {
        errors.email = 'Please enter a valid email address (e.g. name@example.com).';
      }
      if (hasPhone && !validatePhone(phone)) {
        errors.phone = 'Please enter a valid Australian phone number.';
      }
    }

    // 3. Photo requirement (photos OR noPhotos checkbox)
    if (selectedFiles.length === 0 && !noPhotos) {
      errors.photos = 'Please upload at least one photo of your rubbish, or tick the box below if no photos are available.';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.fullName) {
        setErrorMessage(errors.fullName);
      } else if (errors.contact) {
        setErrorMessage(errors.contact);
      } else if (errors.email) {
        setErrorMessage(errors.email);
      } else if (errors.phone) {
        setErrorMessage(errors.phone);
      } else if (errors.photos) {
        setErrorMessage(errors.photos);
      }
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      // Bot detected, silently fake success
      setSuccessData({
        reference: 'TIB-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-0000',
        message: 'Your enquiry has been received.',
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append('noPhotos', noPhotos ? 'true' : 'false');
      formData.append('customerType', 'General Enquiry');
      formData.append('wasteTypes', 'General Rubbish');
      formData.append('estimatedVolume', 'Standard');
      formData.append('siteAccess', 'Standard');
      formData.append('propertyType', 'Residential');
      formData.append('preferredTimeframe', 'As soon as possible');
      formData.append('additionalDetails', noPhotos ? 'Quote submitted without photos' : 'Quote submitted with photos');

      selectedFiles.forEach((file) => {
        formData.append('photos', file);
      });

      const res = await fetch('/api/quote', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to submit quote request. Please try again.');
        if (data.field) {
          setFieldErrors((prev) => ({ ...prev, [data.field]: data.error }));
        }
        return;
      }

      setSuccessData({
        reference: data.reference,
        message: data.message || 'Quote request received successfully.',
      });
    } catch {
      setErrorMessage('A network error occurred. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (successData) {
    return (
      <div className="bg-[#14181F] border border-[#343B46] rounded-2xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Subtle top safety-orange accent line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-safety-orange" />

        <div className="w-16 h-16 bg-safety-orange/15 text-safety-orange rounded-full flex items-center justify-center mx-auto mb-6 border border-safety-orange/30">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-montserrat font-bold text-safety-orange uppercase tracking-widest block mb-2">
          QUOTE REQUEST RECEIVED
        </span>

        <h2 className="font-bebas text-4xl sm:text-5xl text-white tracking-tight mb-4">
          THANKS! WE&apos;VE GOT YOUR REQUEST.
        </h2>

        <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8 font-inter">
          Your enquiry has been sent to Trash It Bros. We&apos;ll review your details and get in touch using the contact information you provided.
        </p>

        {/* Reference Code Card */}
        <div className="bg-[#242B35] border border-[#343B46] rounded-xl p-5 max-w-sm mx-auto mb-8">
          <div className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-gray-400 mb-1">
            Enquiry Reference
          </div>
          <div className="text-2xl font-mono font-bold text-safety-orange tracking-wider">
            {successData.reference}
          </div>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-8 py-3.5 rounded-lg transition-all shadow-lg shadow-safety-orange/20 hover:scale-[1.02]"
          >
            <span>BACK TO HOME</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // SINGLE-PAGE MINIMAL ENQUIRY FORM VIEW
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-[#14181F] border border-[#343B46] rounded-xl p-8 sm:p-10 shadow-xl space-y-6 relative w-full max-w-[560px]"
    >
      {/* Form Card Header */}
      <div className="border-b border-[#343B46]/80 pb-4">
        <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
          REQUEST YOUR FREE QUOTE
        </h2>
      </div>
      {/* Hidden Honeypot Anti-Spam Field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Global Error Alert Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs sm:text-sm animate-shake"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* FIELD 1: Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-xs font-montserrat font-bold uppercase tracking-wider text-white mb-2"
        >
          Full Name <span className="text-safety-orange">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
          }}
          placeholder="Enter your full name"
          className={`w-full bg-[#242B35] border rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#64748B] focus:outline-none transition-colors ${
            fieldErrors.fullName
              ? 'border-red-500 focus:border-red-500'
              : 'border-[#343B46] focus:border-safety-orange'
          }`}
        />
        {fieldErrors.fullName && (
          <p className="text-xs text-red-400 mt-1.5 font-medium">{fieldErrors.fullName}</p>
        )}
      </div>

      {/* FIELD 2: Email Address */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="email"
            className="block text-xs font-montserrat font-bold uppercase tracking-wider text-white"
          >
            Email Address
          </label>
          <span className="text-[11px] text-gray-400">Optional if phone provided</span>
        </div>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email || fieldErrors.contact) {
              setFieldErrors((prev) => ({ ...prev, email: undefined, contact: undefined }));
            }
          }}
          placeholder="you@example.com"
          className={`w-full bg-[#242B35] border rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#64748B] focus:outline-none transition-colors ${
            fieldErrors.email || fieldErrors.contact
              ? 'border-red-500 focus:border-red-500'
              : 'border-[#343B46] focus:border-safety-orange'
          }`}
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-400 mt-1.5 font-medium">{fieldErrors.email}</p>
        )}
      </div>

      {/* FIELD 3: Phone Number */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="phone"
            className="block text-xs font-montserrat font-bold uppercase tracking-wider text-white"
          >
            Phone Number
          </label>
          <span className="text-[11px] text-gray-400">Optional if email provided</span>
        </div>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (fieldErrors.phone || fieldErrors.contact) {
              setFieldErrors((prev) => ({ ...prev, phone: undefined, contact: undefined }));
            }
          }}
          placeholder="04XX XXX XXX"
          className={`w-full bg-[#242B35] border rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#64748B] focus:outline-none transition-colors ${
            fieldErrors.phone || fieldErrors.contact
              ? 'border-red-500 focus:border-red-500'
              : 'border-[#343B46] focus:border-safety-orange'
          }`}
        />
        {fieldErrors.phone && (
          <p className="text-xs text-red-400 mt-1.5 font-medium">{fieldErrors.phone}</p>
        )}
        {fieldErrors.contact && !fieldErrors.email && !fieldErrors.phone && (
          <p className="text-xs text-red-400 mt-1.5 font-medium">{fieldErrors.contact}</p>
        )}
      </div>

      {/* FIELD 4: Upload Photos */}
      <div className="pt-2">
        <label className="block text-xs font-montserrat font-bold uppercase tracking-wider text-white mb-1">
          Photos of Your Rubbish
        </label>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          Upload photos of what you need removed so we can provide a more accurate quote.
        </p>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-safety-orange bg-safety-orange/15'
              : fieldErrors.photos
              ? 'border-red-500/80 bg-[#242B35] hover:border-red-400'
              : 'border-[#343B46] hover:border-safety-orange bg-[#242B35]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full bg-[#14181F] border border-[#343B46] flex items-center justify-center mx-auto mb-3 text-safety-orange">
            <Upload className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="font-montserrat font-bold text-xs sm:text-sm text-white mb-1">
            Click to upload or drag &amp; drop photos
          </div>
          <div className="text-[11px] text-gray-400">
            JPG, PNG, or WebP (Up to 10 photos, max 10MB each)
          </div>
        </div>

        {/* Uploaded Photos Preview List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs font-montserrat font-bold text-gray-300 uppercase tracking-wider">
              Selected Photos ({selectedFiles.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-[#343B46] bg-[#080A0D]"
                >
                  <img
                    src={preview}
                    alt={`Waste preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    title="Remove photo"
                    className="absolute top-1.5 right-1.5 bg-black/80 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[10px] text-gray-300 px-1.5 py-0.5 truncate">
                    {selectedFiles[index]?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {fieldErrors.photos && (
          <p className="text-xs text-red-400 mt-2 font-medium">{fieldErrors.photos}</p>
        )}
      </div>

      {/* FIELD 5: No Photos Checkbox */}
      <div className="p-4 rounded-xl bg-[#242B35] border border-[#343B46] transition-colors">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            name="noPhotos"
            checked={noPhotos}
            onChange={handleNoPhotosChange}
            className="w-5 h-5 mt-0.5 accent-safety-orange rounded cursor-pointer shrink-0"
          />
          <div>
            <span className="font-montserrat font-semibold text-xs sm:text-sm text-white block">
              I don&apos;t have photos available right now.
            </span>
            <span className="text-xs text-[#CBD5E1] leading-relaxed block mt-0.5">
              That&apos;s okay! Submit your request and we&apos;ll contact you to discuss what needs removing.
            </span>
          </div>
        </label>
      </div>

      {/* Privacy Notice */}
      <div className="text-[11px] text-gray-400 leading-relaxed pt-1">
        By submitting, you agree to our{' '}
        <Link href="/privacy-policy" className="text-safety-orange hover:underline">
          Privacy Policy
        </Link>{' '}
        and allow Trash It Bros to contact you regarding your quote.
      </div>

      {/* SUBMISSION BUTTON */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-safety-orange hover:bg-orange-hover disabled:bg-safety-orange/60 text-white font-montserrat font-bold text-sm uppercase px-8 py-4 rounded-xl transition-all shadow-xl shadow-safety-orange/20 cursor-pointer disabled:cursor-not-allowed hover:scale-[1.01]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>SUBMITTING YOUR REQUEST...</span>
            </>
          ) : (
            <>
              <span>REQUEST MY FREE QUOTE</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
