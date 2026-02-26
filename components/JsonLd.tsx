const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://funfai.thaipbs.or.th';

interface JsonLdProps {
  type: 'website' | 'organization' | 'article' | 'breadcrumb';
  data?: Record<string, unknown>;
}

function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ทันฝุ่น ทันไฟ',
    alternateName: 'FunFai',
    url: SITE_URL,
    description:
      'แพลตฟอร์มรวบรวมข้อมูล ข่าวสาร สารคดี และเครื่องมือติดตามสถานการณ์ PM 2.5 ฝุ่นควัน และไฟป่าในประเทศไทย โดย Thai PBS',
    inLanguage: 'th-TH',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/contents?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Thai PBS Public Intelligence',
    alternateName: 'ทันฝุ่น ทันไฟ',
    url: SITE_URL,
    logo: `${SITE_URL}/logos/logo.svg`,
    sameAs: [
      'https://www.thaipbs.or.th',
      'https://www.facebook.com/ThaiPBS',
      'https://twitter.com/ThaiPBS',
      'https://www.youtube.com/@ThaiPBS',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'thenorththaipbs@gmail.com',
      contactType: 'customer service',
      availableLanguage: ['Thai', 'English'],
    },
  };
}

function buildArticleSchema(data: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: data.title,
    description: data.description,
    image: data.image || `${SITE_URL}/api/og`,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Organization',
      name: 'Thai PBS Public Intelligence',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Thai PBS',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logos/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url || SITE_URL,
    },
  };
}

function buildBreadcrumbSchema(data: Record<string, unknown>) {
  const items = (data.items as Array<{ name: string; url: string }>) || [];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export default function JsonLd({ type, data = {} }: JsonLdProps) {
  let schema;

  switch (type) {
    case 'website':
      schema = buildWebSiteSchema();
      break;
    case 'organization':
      schema = buildOrganizationSchema();
      break;
    case 'article':
      schema = buildArticleSchema(data);
      break;
    case 'breadcrumb':
      schema = buildBreadcrumbSchema(data);
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
