import { saveContentToSupabase } from './supabase';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { DatabaseSchema, PageData, ServiceItem, ProjectItem, TestimonialItem, FAQItem, QuoteEnquiry, SiteSettings, MediaFile, User } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cms.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDefaultData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('admin123', salt);

  const initialUser: User = {
    id: 'user-admin',
    username: 'admin',
    passwordHash: passwordHash,
    role: 'admin',
    name: 'Administrator',
  };

  const initialSettings: SiteSettings = {
    companyName: 'Trash It Bros',
    primaryHeadline: 'YOU BUILD IT. WE TAKE IT.',
    phone: '0481 975 170',
    email: 'info@trashitbros.com.au',
    address: 'Sunshine Coast, QLD, Australia',
    serviceArea: 'Sunshine Coast & Surrounding Regions, QLD',
    hours: 'Mon – Sat: 6:00 AM – 6:00 PM (24/7 Service Available)',
    notificationEmail: 'quotes@trashitbros.com.au',
    instagram: 'https://instagram.com/trashitbros',
    facebook: 'https://facebook.com/trashitbros',
  };

  const initialServices: ServiceItem[] = [
    {
      id: 'srv-1',
      slug: 'construction-site-clean-ups',
      name: 'Construction Site Clean-Ups',
      shortDescription: 'Keep your project moving with dependable construction rubbish removal.',
      fullDescription: 'Construction projects generate waste at every stage. Trash It Bros helps builders, trade contractors, and developers remove unwanted timber, packaging, rubble, and building materials to keep worksites safe, clean, and compliant.',
      heroImage: '/images/hero-truck.jpg',
      cardImage: '/images/service-construction.jpg',
      benefits: [
        'Building site rubbish collection and removal',
        'Suitable for all stages of construction',
        'Options for recurring scheduled collections',
        'Dedicated builder and trade account support'
      ],
      wasteExamples: [
        'Off-cut framing timber and trusses',
        'Plasterboard, gyprock, and insulation',
        'Cardboard packaging, strapping, and plastics',
        'Masonry rubble, bricks, and concrete off-cuts'
      ],
      order: 1,
      published: true,
    },
    {
      id: 'srv-2',
      slug: 'renovation-waste-removal',
      name: 'Renovation & Demolition Waste',
      shortDescription: 'Fast removal of building materials and renovation debris.',
      fullDescription: 'Renovating or demolishing part of a property can quickly overwhelm your workspace. We help remove accepted renovation debris promptly so your sub-trades can continue their work without delay.',
      heroImage: '/images/hero-truck.jpg',
      cardImage: '/images/service-renovation.jpg',
      benefits: [
        'Kitchen, bathroom, and laundry strip-out debris',
        'Fast turnaround to keep renovations on schedule',
        'Flexible collection times for residential and commercial jobs',
        'No council street permits or container placement delays'
      ],
      wasteExamples: [
        'Old cabinets, vanities, and benchtops',
        'Tiles, mortar, and backer board',
        'Timber flooring, subflooring, and joists',
        'Doors, window frames, and trim'
      ],
      order: 2,
      published: true,
    },
    {
      id: 'srv-3',
      slug: 'commercial-rubbish-removal',
      name: 'Commercial & Industrial Rubbish',
      shortDescription: 'Practical rubbish removal solutions for workplaces and commercial properties.',
      fullDescription: 'From retail shopfronts and office strip-outs to warehouse fit-outs and commercial facility management, Trash It Bros delivers punctual, heavy-duty waste collection services.',
      heroImage: '/images/hero-truck.jpg',
      cardImage: '/images/service-commercial.jpg',
      benefits: [
        'Shop fit-outs and office tenancy make-goods',
        'Warehouse rubbish and packaging clearance',
        'After-hours and weekend collections by arrangement',
        'Full loading and tidy sweep included'
      ],
      wasteExamples: [
        'Timber pallets, crates, and bulk packaging',
        'Office furniture, partition screens, and desks',
        'Retail fixtures, shelving, and point-of-sale debris',
        'Commercial trade waste and end-of-lease rubbish'
      ],
      order: 3,
      published: true,
    },
    {
      id: 'srv-4',
      slug: 'residential-junk-removal',
      name: 'General Junk Removal',
      shortDescription: 'From unwanted furniture to household clear-outs, we take care of the mess.',
      fullDescription: 'Clearing a property, prepping a home for sale, or dealing with bulky unwanted items? Trash It Bros provides fast, friendly residential rubbish collection across the Sunshine Coast.',
      heroImage: '/images/hero-truck.jpg',
      cardImage: '/images/service-general.jpg',
      benefits: [
        'Complete heavy lifting and loading done for you',
        'Deceased estates, moving clear-outs, and garage clean-ups',
        'Transparent upfront quotes with zero hidden fees',
        'Responsible sorting and recycling wherever feasible'
      ],
      wasteExamples: [
        'Couches, sofas, tables, and mattresses',
        'Whitegoods, appliances, and electronic waste',
        'Shed tools, garden clutter, and timber scraps',
        'Bulky general household junk'
      ],
      order: 4,
      published: true,
    },
  ];

  const initialProjects: ProjectItem[] = [
    {
      id: 'proj-1',
      title: 'Residential Construction Site Clean-Up',
      category: 'Construction',
      location: 'Buderim, Sunshine Coast',
      beforeImage: '/images/project-before.jpg',
      afterImage: '/images/project-after.jpg',
      description: 'Comprehensive clean-up of timber framing off-cuts, wrapping, and demolition rubble across a multi-dwelling residential site.',
      wasteType: 'Framing timber, pallets, packaging',
      featured: true,
      published: true,
      order: 1,
    },
    {
      id: 'proj-2',
      title: 'Commercial Tenancy Refurbishment',
      category: 'Commercial',
      location: 'Maroochydore, Sunshine Coast',
      beforeImage: '/images/service-renovation.jpg',
      afterImage: '/images/service-commercial.jpg',
      description: 'Full strip-out waste collection for a commercial shopfront refurbishment, completed within an 8-hour window.',
      wasteType: 'Partition walls, ceiling tiles, shop fittings',
      featured: true,
      published: true,
      order: 2,
    },
    {
      id: 'proj-3',
      title: 'Home Renovation Strip-Out',
      category: 'Renovation',
      location: 'Noosa Heads, Sunshine Coast',
      beforeImage: '/images/service-general.jpg',
      afterImage: '/images/project-after.jpg',
      description: 'Kitchen and bathroom renovation debris removal, clearing old cabinetry, vanities, tiles, and drywall.',
      wasteType: 'Tiles, plasterboard, cabinetry',
      featured: true,
      published: true,
      order: 3,
    },
  ];

  const initialTestimonials: TestimonialItem[] = [
    {
      id: 't-1',
      name: 'Mark Henderson',
      role: 'Project Builder',
      location: 'Sunshine Coast',
      content: 'Trash It Bros keep our sites clean and running smoothly. Reliable, punctual and easy to deal with. Highly recommend!',
      rating: 5,
      featured: true,
      published: true,
    },
    {
      id: 't-2',
      name: 'Sarah Jenkins',
      role: 'Property Developer',
      location: 'Caloundra',
      content: 'Fast turnaround on our townhouse development. They loaded everything directly into the truck without interrupting our trades.',
      rating: 5,
      featured: true,
      published: true,
    },
  ];

  const initialFAQs: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'What kinds of rubbish do you remove?',
      answer: 'Your rubbish, we take it!\n\nWe remove a wide range of general rubbish, including construction waste, timber, plasterboard, renovation debris, unwanted furniture, household junk and commercial waste.\n\nWhether you\'re clearing a building site, renovating a property or getting rid of unwanted items, we\'re here to make the process simple.\n\nNot sure if we can take something? Send us a photo and we\'ll let you know.',
      category: 'Materials',
      order: 1,
      published: true,
    },
    {
      id: 'faq-2',
      question: 'How do I request a quote?',
      answer: 'Getting a quote is quick and easy!\n\nSimply complete our online quote form or give us a call. Tell us what needs removing, where it\'s located and, if possible, send through a few photos.\n\nWe aim to provide quotes within minutes when we have all the information we need. Larger or more complex jobs may require additional details.\n\nNo complicated process. Just straightforward pricing and a simple solution.',
      category: 'Pricing',
      order: 2,
      published: true,
    },
    {
      id: 'faq-3',
      question: 'How is pricing calculated?',
      answer: 'Our rubbish removal services start from just $99.\n\nThe final price depends on the amount and type of rubbish, access to the collection area, labour requirements and disposal costs.\n\nWe\'ll assess your job and provide a clear quote before getting started, so you know what to expect.\n\nNo unnecessary complications — just fair, straightforward pricing.',
      category: 'Pricing',
      order: 3,
      published: true,
    },
    {
      id: 'faq-4',
      question: 'Can you collect rubbish from an active construction site?',
      answer: 'Absolutely! Construction site clean-ups are one of our main services.\n\nWe work with builders, tradespeople and project managers to help keep worksites organised and ready for the next stage.\n\nFrom leftover timber and building materials to general construction rubbish, we can arrange collections around your project\'s requirements.\n\nWe\'ll coordinate site access and collection details with you to help minimise disruption.',
      category: 'Site Access',
      order: 4,
      published: true,
    },
    {
      id: 'faq-5',
      question: 'Do you offer regular scheduled collections for builders?',
      answer: 'Yes! We understand that construction projects generate rubbish throughout different stages of the build.\n\nWe can arrange regular or recurring collections to suit your project\'s needs, helping you maintain a cleaner, more organised worksite.\n\nWhether you need ongoing support or a one-off site clean-up, we\'ll work with you to find a practical solution.\n\nContact us to discuss a collection schedule that suits your project.',
      category: 'General',
      order: 5,
      published: true,
    },
    {
      id: 'faq-6',
      question: 'Do I need to be present when rubbish is collected?',
      answer: 'Not necessarily!\n\nIf our team can safely access the rubbish and all collection details have been confirmed beforehand, you may not need to be on-site.\n\nSimply let us know where the rubbish is located and provide any relevant access instructions.\n\nDifficult access? Let us solve it! Tell us about narrow driveways, restricted access, stairs or other challenges, and we\'ll discuss the best way to manage your collection.',
      category: 'Site Access',
      order: 6,
      published: true,
    },
    {
      id: 'faq-7',
      question: 'Which areas do you service?',
      answer: 'Trash It Bros services the Sunshine Coast and surrounding areas in Queensland.\n\nWhether you\'re managing a construction project, clearing a commercial property or removing unwanted household rubbish, get in touch to check availability in your suburb.\n\nOutside our usual service area? Send us your location and we\'ll let you know whether we can help.',
      category: 'General',
      order: 7,
      published: true,
    },
    {
      id: 'faq-8',
      question: 'Are there materials you cannot accept?',
      answer: 'While we remove a wide variety of rubbish, some materials require specialised handling and cannot be included in a standard collection.\n\nThese may include asbestos, hazardous chemicals, certain liquids, gas cylinders and other regulated waste.\n\nIf you\'re unsure about an item, simply send us a description or photo before booking.\n\nWe\'ll confirm what we can safely and legally collect and advise you if specialist disposal is required.',
      category: 'Materials',
      order: 8,
      published: true,
    },
  ];

  const homeContent: Record<string, string> = {
    'hero_eyebrow': 'CONSTRUCTION SITE CLEAN-UPS & RUBBISH REMOVAL',
    'hero_headline_1': 'YOU BUILD IT.',
    'hero_headline_2': 'WE TAKE IT.',
    'hero_paragraph': 'Fast, reliable and hassle-free rubbish removal for construction sites, renovations, businesses and homes. We take care of the mess so you can focus on the job.',
    'hero_cta_primary': 'Get a Free Quote',
    'hero_cta_secondary': 'Our Services',
    'feature_1': '6am – 6pm • 24/7 Service',
    'feature_2': 'All Site Sizes',
    'feature_3': 'Competitive Pricing',
    'feature_4': 'Responsible Disposal',
    'about_eyebrow': 'ABOUT US',
    'about_headline': 'HARD WORK. CLEAN RESULTS.',
    'about_paragraph': 'At Trash It Bros, we take the mess off your hands so you can focus on what matters. With a strong work ethic and reliable service, we help builders, tradespeople, businesses and homeowners keep their sites clean, safe and ready for the next stage.',
    'about_benefit_1': 'On-time and reliable collection',
    'about_benefit_2': 'Competitive, straightforward pricing',
    'about_benefit_3': 'Flexible solutions for any project size',
    'about_benefit_4': 'Responsible waste handling and disposal',
    'services_eyebrow': 'WHAT WE DO',
    'services_heading': 'OUR SERVICES',
    'services_intro': 'Professional rubbish removal solutions for construction projects, businesses and homes.',
    'process_eyebrow': 'OUR PROCESS',
    'process_heading': 'SIMPLE. FAST. DONE.',
    'step_1_title': 'GET A QUOTE',
    'step_1_desc': 'Tell us what needs to be removed and upload photos.',
    'step_2_title': 'WE ARRIVE',
    'step_2_desc': 'On time and ready to get to work on your site.',
    'step_3_title': 'WE TAKE IT',
    'step_3_desc': 'We load and clear all agreed waste completely.',
    'step_4_title': 'YOU GET A CLEAN SITE',
    'step_4_desc': 'Simple, fast and hassle-free results.',
    'why_heading': 'RUBBISH REMOVAL. DONE RIGHT.',
    'why_subheading': 'Any site, any size. We handle the heavy loading so you can stay focused on your work.',
    'work_eyebrow': 'OUR WORK',
    'work_heading': 'REAL PROJECTS. REAL RESULTS.',
    'work_paragraph': 'From large construction sites to home renovations, we have helped countless clients keep their spaces clean and safe.',
    'cta_heading': 'READY TO GET RID OF THE MESS?',
    'cta_subheading': 'No obligation. Fast response. Competitive pricing for Sunshine Coast projects.',
    'cta_button': 'Get a Quote',
    'footer_tagline': 'Fast, dependable rubbish removal for construction sites, renovations, commercial facilities and homes across the Sunshine Coast.',
  };

  const initialPages: Record<string, PageData> = {
    'home': {
      slug: 'home',
      title: 'Home',
      seo: {
        title: 'Trash It Bros | Construction Site Clean-Ups & Rubbish Removal Sunshine Coast',
        description: 'Fast, reliable rubbish removal for construction sites, renovations, commercial properties and homes. You build it, we take it.',
      },
      draftContent: { ...homeContent },
      publishedContent: { ...homeContent },
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
    'services': {
      slug: 'services',
      title: 'Our Services',
      seo: {
        title: 'Rubbish Removal Services | Trash It Bros Sunshine Coast',
        description: 'Comprehensive rubbish removal for construction sites, renovations, commercial properties, and residential clean-ups.',
      },
      draftContent: {
        'hero_eyebrow': 'OUR SERVICES',
        'hero_headline': 'RUBBISH REMOVAL FOR EVERY PROJECT.',
        'hero_paragraph': 'From building projects and renovations to business and household clean-ups, Trash It Bros helps take the hassle out of waste removal.',
        'overview_headline': 'TAILORED RUBBISH REMOVAL SOLUTIONS FOR EVERY NEED.',
      },
      publishedContent: {
        'hero_eyebrow': 'OUR SERVICES',
        'hero_headline': 'RUBBISH REMOVAL FOR EVERY PROJECT.',
        'hero_paragraph': 'From building projects and renovations to business and household clean-ups, Trash It Bros helps take the hassle out of waste removal.',
        'overview_headline': 'TAILORED RUBBISH REMOVAL SOLUTIONS FOR EVERY NEED.',
      },
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
    'about': {
      slug: 'about',
      title: 'About Us',
      seo: {
        title: 'About Us | Trash It Bros Sunshine Coast',
        description: 'Hard work, clean results. Learn how Trash It Bros keeps Sunshine Coast construction sites, businesses, and homes tidy.',
      },
      draftContent: {
        'hero_headline': 'HARD WORK. CLEAN RESULTS.',
        'hero_subheading': 'Straightforward, dependable rubbish removal built for builders, trades, and property owners.',
        'story_title': 'KEEPING SITES RUNNING SMOOTHLY',
        'story_p1': 'Keeping a worksite clean should never slow your progress down. Trash It Bros was founded to deliver fast, reliable rubbish removal with zero excuses and full professionalism.',
        'story_p2': 'Whether clearing framing off-cuts from an active building site or clearing out a commercial office strip-out, our crew brings the manpower, trucks, and commitment to get the job done right the first time.',
      },
      publishedContent: {
        'hero_headline': 'HARD WORK. CLEAN RESULTS.',
        'hero_subheading': 'Straightforward, dependable rubbish removal built for builders, trades, and property owners.',
        'story_title': 'KEEPING SITES RUNNING SMOOTHLY',
        'story_p1': 'Keeping a worksite clean should never slow your progress down. Trash It Bros was founded to deliver fast, reliable rubbish removal with zero excuses and full professionalism.',
        'story_p2': 'Whether clearing framing off-cuts from an active building site or clearing out a commercial office strip-out, our crew brings the manpower, trucks, and commitment to get the job done right the first time.',
      },
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
    'our-work': {
      slug: 'our-work',
      title: 'Our Work',
      seo: {
        title: 'Our Work & Projects | Trash It Bros',
        description: 'See before and after results from our construction site clean-ups and waste removal projects.',
      },
      draftContent: {
        'hero_headline': 'REAL PROJECTS. CLEAN RESULTS.',
        'hero_subheading': 'Explore our before-and-after project portfolio across the Sunshine Coast.',
      },
      publishedContent: {
        'hero_headline': 'REAL PROJECTS. CLEAN RESULTS.',
        'hero_subheading': 'Explore our before-and-after project portfolio across the Sunshine Coast.',
      },
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
    'faq': {
      slug: 'faq',
      title: 'Frequently Asked Questions',
      seo: {
        title: 'FAQs | Trash It Bros Rubbish Removal',
        description: 'Got questions about rubbish removal, quotes, acceptable materials, or booking? Find answers here.',
      },
      draftContent: {
        'hero_headline': 'GOOD TO KNOW.',
        'hero_subheading': 'Everything you need to know about our rubbish removal services, pricing, and accepted materials.',
      },
      publishedContent: {
        'hero_headline': 'GOOD TO KNOW.',
        'hero_subheading': 'Everything you need to know about our rubbish removal services, pricing, and accepted materials.',
      },
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
    'contact': {
      slug: 'contact',
      title: 'Contact Us',
      seo: {
        title: 'Contact Trash It Bros | Sunshine Coast Rubbish Removal',
        description: 'Get in touch with Trash It Bros for quotes, enquiries, and rubbish collection scheduling.',
      },
      draftContent: {
        'hero_headline': 'GET IN TOUCH WITH THE TEAM.',
        'hero_subheading': 'Have questions or ready to book? Reach out today for straightforward assistance.',
      },
      publishedContent: {
        'hero_headline': 'GET IN TOUCH WITH THE TEAM.',
        'hero_subheading': 'Have questions or ready to book? Reach out today for straightforward assistance.',
      },
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
    'get-a-quote': {
      slug: 'get-a-quote',
      title: 'Get a Free Quote',
      seo: {
        title: 'Request a Quote | Trash It Bros',
        description: 'Upload photos and request a fast, free quote for your rubbish removal project.',
      },
      draftContent: {
        'hero_headline': 'REQUEST A FREE QUOTE.',
        'hero_subheading': 'Upload photos of your waste and get a prompt, transparent quote.',
      },
      publishedContent: {
        'hero_headline': 'REQUEST A FREE QUOTE.',
        'hero_subheading': 'Upload photos of your waste and get a prompt, transparent quote.',
      },
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    },
  };

  const initialMedia: MediaFile[] = [
    { id: 'm-1', filename: 'hero-truck.jpg', url: '/images/hero-truck.jpg', alt: 'Trash It Bros Rubbish Truck on Site', size: 120000, uploadedAt: new Date().toISOString() },
    { id: 'm-2', filename: 'truck-site.jpg', url: '/images/truck-site.jpg', alt: 'Construction Site with Waste Truck', size: 95000, uploadedAt: new Date().toISOString() },
    { id: 'm-3', filename: 'worker-clean.jpg', url: '/images/worker-clean.jpg', alt: 'Worker Clearing Construction Timber', size: 85000, uploadedAt: new Date().toISOString() },
    { id: 'm-4', filename: 'service-construction.jpg', url: '/images/service-construction.jpg', alt: 'Construction Site Clean-Up', size: 65000, uploadedAt: new Date().toISOString() },
    { id: 'm-5', filename: 'service-renovation.jpg', url: '/images/service-renovation.jpg', alt: 'Renovation Waste Removal', size: 62000, uploadedAt: new Date().toISOString() },
    { id: 'm-6', filename: 'service-commercial.jpg', url: '/images/service-commercial.jpg', alt: 'Commercial Rubbish Removal', size: 68000, uploadedAt: new Date().toISOString() },
    { id: 'm-7', filename: 'service-general.jpg', url: '/images/service-general.jpg', alt: 'General Junk Removal', size: 70000, uploadedAt: new Date().toISOString() },
    { id: 'm-8', filename: 'project-before.jpg', url: '/images/project-before.jpg', alt: 'Site Before Clean-Up', size: 80000, uploadedAt: new Date().toISOString() },
    { id: 'm-9', filename: 'project-after.jpg', url: '/images/project-after.jpg', alt: 'Site After Clean-Up', size: 82000, uploadedAt: new Date().toISOString() },
  ];

  return {
    pages: initialPages,
    services: initialServices,
    projects: initialProjects,
    testimonials: initialTestimonials,
    faqs: initialFAQs,
    enquiries: [],
    settings: initialSettings,
    media: initialMedia,
    users: [initialUser],
    revisions: [],
  };
}

export function readDatabase(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = getDefaultData();
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
    return defaultData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB, using defaults:', err);
    return getDefaultData();
  }
}

export function writeDatabase(data: DatabaseSchema): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Local fs write skipped or read-only:', err);
  }
  saveContentToSupabase(data).catch((err) => {
    console.error('Failed to sync to Supabase in writeDatabase:', err);
  });
}

export async function writeDatabaseAsync(data: DatabaseSchema): Promise<boolean> {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('Local fs write skipped or read-only:', err);
  }
  return await saveContentToSupabase(data);
}
