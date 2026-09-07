import {
  absoluteUrl,
  buildWebsiteJsonLd,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_SEO_TITLE,
  SITE_LOCALE,
  SITE_NAME,
  type SeoPageConfig,
} from '@constants/seo';

const JSON_LD_ID = 'quizz-seo-jsonld';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(data: Record<string, unknown> | null) {
  const existing = document.getElementById(JSON_LD_ID);
  if (!data) {
    existing?.remove();
    return;
  }
  const script =
    existing instanceof HTMLScriptElement
      ? existing
      : document.createElement('script');
  script.id = JSON_LD_ID;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  if (!existing) document.head.appendChild(script);
}

export function applyDocumentSeo(page: SeoPageConfig) {
  const canonical = absoluteUrl(page.path);
  const image = absoluteUrl(DEFAULT_OG_IMAGE_PATH);

  document.title = page.title;
  upsertMeta('name', 'description', page.description);
  upsertMeta('name', 'robots', page.robots);
  upsertMeta('name', 'author', SITE_NAME);
  upsertLink('canonical', canonical);

  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:locale', SITE_LOCALE);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:title', page.title);
  upsertMeta('property', 'og:description', page.description);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:image:alt', DEFAULT_SEO_TITLE);
  upsertMeta('property', 'og:image:width', '1200');
  upsertMeta('property', 'og:image:height', '630');

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', page.title);
  upsertMeta('name', 'twitter:description', page.description);
  upsertMeta('name', 'twitter:image', image);

  const gsc = import.meta.env.VITE_GSC_VERIFICATION?.trim();
  if (gsc) upsertMeta('name', 'google-site-verification', gsc);

  upsertJsonLd(page.jsonLd ? buildWebsiteJsonLd() : null);
}
