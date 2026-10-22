export interface PageData {
  slug: string;
  title: string;
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
  draftContent: Record<string, string>;
  publishedContent: Record<string, string>;
  updatedAt: string;
  publishedAt: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  cardImage: string;
  benefits: string[];
  wasteExamples: string[];
  order: number;
  published: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Construction' | 'Renovation' | 'Commercial' | 'Residential';
  location: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  wasteType: string;
  featured: boolean;
  published: boolean;
  order: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  featured: boolean;
  published: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Pricing' | 'Site Access' | 'Materials';
  order: number;
  published: boolean;
}

export type QuoteStatus = 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost' | 'Completed';

export interface QuoteEnquiry {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  photos: string[];
  noPhotos: boolean;
  customerType?: string;
  service?: string;
  siteAddress?: string;
  wasteType?: string;
  estimatedVolume?: string;
  siteAccess?: string;
  preferredDate?: string;
  preferredTimeframe?: string;
  additionalDetails?: string;
  status: QuoteStatus;
  internalNotes: string;
  notificationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  companyName: string;
  primaryHeadline: string;
  phone: string;
  email: string;
  address: string;
  serviceArea: string;
  hours: string;
  notificationEmail: string;
  instagram: string;
  facebook: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  alt: string;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'editor' | 'viewer';
  name: string;
}

export interface DatabaseSchema {
  pages: Record<string, PageData>;
  services: ServiceItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  enquiries: QuoteEnquiry[];
  settings: SiteSettings;
  media: MediaFile[];
  users: User[];
  revisions: Array<{
    id: string;
    pageSlug: string;
    content: Record<string, string>;
    timestamp: string;
    author: string;
  }>;
}
