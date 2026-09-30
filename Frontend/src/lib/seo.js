import { siteConfig } from '@/config/site';

export const absoluteUrl = (path = '/') => new URL(path, siteConfig.url).toString();

/**
 * Builds a page's metadata (title, description, canonical URL, Open Graph, Twitter)
 * in one call so every page gets consistent SEO tags.
 */
export function buildMetadata({ title, description, path = '/', image, type = 'website', noIndex = false, absoluteTitle = false }) {
  // Pages without their own photo fall back to the generated brand image (app/opengraph-image.js)
  const shareImage = image || '/opengraph-image';
  const ogImages = [{ url: shareImage, width: 1200, height: 630, alt: title }];

  return {
    // absoluteTitle skips the "| Kiteice Travel and Treks" suffix from the root layout
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImage],
    },
    ...(noIndex && { robots: { index: false, follow: true } }),
  };
}

/* ---------- JSON-LD structured data (https://schema.org) ---------- */

// `site` comes from getSiteSettings() (admin-editable company and contact details)
export function organizationJsonLd(site) {
  const { contact, social } = site;
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': absoluteUrl('/#organization'),
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: siteConfig.url,
    logo: absoluteUrl('/logo.svg'),
    image: absoluteUrl('/opengraph-image'),
    telephone: contact.phone,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    areaServed: ['Nepal', 'Tibet', 'Bhutan'],
    sameAs: Object.values(social).filter(Boolean),
  };
}

export function websiteJsonLd(site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: siteConfig.url,
    publisher: { '@id': absoluteUrl('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/trips')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function tripJsonLd(trip) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.summary,
    image: trip.image,
    url: absoluteUrl(`/trips/${trip.slug}`),
    touristType: trip.activityName,
    provider: { '@id': absoluteUrl('/#organization') },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: trip.itinerary.length,
      itemListElement: trip.itinerary.map((day) => ({
        '@type': 'ListItem',
        position: day.day,
        name: `Day ${day.day}: ${day.title}`,
      })),
    },
    offers: {
      '@type': 'Offer',
      price: trip.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/trips/${trip.slug}`),
    },
  };
}

export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function articleJsonLd(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@id': absoluteUrl('/#organization') },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}
