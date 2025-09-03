import React, { useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Server } from 'lucide-react';

import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import LandingSection from '../components/LandingSection';
import { trackEvent } from '../../../utils/analytics';
import { buttonStyles, buttonSizeXs } from '../../ui/Button';

export default function ProvidersSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string) => string;
  const tAny = t as unknown as (key: string, options?: Record<string, unknown>) => unknown;

  const defaultProviders = [
    'OpenAI',
    'Anthropic',
    'Mistral',
    'Groq',
    'DeepSeek',
    'Google Vertex/Gemini',
    'Azure OpenAI',
    'AWS Bedrock',
    'OpenRouter',
  ];

  const logoBySlug: Record<string, { src: string; alt: string; invertOnDark?: boolean }> = {
    openai: { src: '/assets/openai.svg', alt: 'OpenAI', invertOnDark: true },
    anthropic: { src: '/assets/anthropic.svg', alt: 'Anthropic' },
    deepseek: { src: '/assets/deepseek.svg', alt: 'DeepSeek', invertOnDark: true },
    'google-vertex-gemini': { src: '/assets/google.svg', alt: 'Google Vertex/Gemini' },
    'azure-openai': { src: '/assets/azure-openai.svg', alt: 'Azure OpenAI' },
    'aws-bedrock': { src: '/assets/aws-bedrock.svg', alt: 'AWS Bedrock' },
  };

  const normalize = (s?: string) =>
    String(s ?? '')
      .toLowerCase()
      .replace(/\s*[\+\/]\s*/g, '-')
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/(^-|-$)/g, '');

  const rawProviders = tAny('marketing.landing.providers.items', { returnObjects: true, defaultValue: defaultProviders });
  type ProviderI18n = string | { name: string; slug?: string };

  const providerNames = Array.isArray(rawProviders)
    ? (rawProviders as ProviderI18n[])
        .map((p) =>
          typeof p === 'string'
            ? { name: p, slug: normalize(p) }
            : { name: p?.name ?? '', slug: p?.slug ?? normalize(p?.name) }
        )
        .filter((p) => p.name && p.slug)
    : defaultProviders.map((n) => ({ name: n, slug: normalize(n) }));

  // Ensure we always have items to render even if i18n returned an empty/malformed structure
  const effectiveProviderNames =
    providerNames.length > 0
      ? providerNames
      : defaultProviders.map((n) => ({ name: n, slug: normalize(n) }));

  // Deduplication
  const seen = new Set<string>();
  const uniqueNames = effectiveProviderNames.filter(({ name }) => {
    const key = (name ?? '').trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  type ProviderItem = { name: string; slug: string; subtitle: string; content: string };
  const providers: ProviderItem[] = uniqueNames.map((p) => {
    const slug = p.slug === 'google-vertex-gemini' ? p.slug : normalize(p.name);
    return {
      name: tt(`marketing.landing.providers.details.${slug}.title`, p.name),
      slug,
      subtitle: tt(`marketing.landing.providers.details.${slug}.subtitle`, ''),
      content: tt(`marketing.landing.providers.details.${slug}.content`, ''),
    };
  });

  // SEO JSON-LD
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: providers.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: { '@type': 'Organization', name: p.name, description: p.subtitle || p.content || undefined },
      })),
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [providers]);

  return (
    <LandingSection id="providers" ariaLabelledby="providers-heading" className="-mt-px">
      <SectionHeader
        icon={Server}
        badgeText={t('marketing.landing.sections.badges.providers')}
        id="providers-heading"
        title={tt('marketing.landing.providers.title', 'Modelle & Provider')}
        subtitle={tt(
          'marketing.landing.providers.description',
          'Multi-Provider by Design. BYOK oder Managed – nutze führende LLMs.'
        )}
      />

      <motion.ul
        className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5"
        role="list"
        variants={listContainerVar}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {providers.map((p, i) => {
          const logo = logoBySlug[p.slug];
          return (
            <AccordionItem key={p.slug} index={i} provider={p} logo={logo} />
          );
        })}
      </motion.ul>
    </LandingSection>
  );
}

type ProviderItem = { name: string; slug: string; subtitle: string; content: string };
type LogoInfo = { src: string; alt: string; invertOnDark?: boolean } | undefined;

const listContainerVar: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, when: 'beforeChildren' },
  },
};

const listItemVar: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

function AccordionItem({ index, provider, logo }: { index: number; provider: ProviderItem; logo: LogoInfo }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState('0px');
  const { t } = useTranslation();

  const onToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      trackEvent('landing.providers.card.toggle', { index, title: provider.name, provider: provider.slug, open: next });
      return next;
    });
  };

  React.useEffect(() => {
    const update = () => {
      if (open && contentRef.current) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setMaxHeight('0px');
      }
    };
    update();
    const el = contentRef.current;
    const ro = el ? new ResizeObserver(update) : null;
    if (el && ro) ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      if (ro && el) ro.unobserve(el);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [open]);

  return (
    <motion.li variants={listItemVar} whileHover={{ scale: 1.01 }}>
      <Card variant="subtle" noInner>
        <button
          type="button"
          className="w-full flex items-center gap-2 px-2 py-1.5 cursor-pointer select-none rounded-md text-left"
          aria-label={`Provider ${provider.name}`}
          aria-controls={`provider-panel-${provider.slug}`}
          aria-expanded={open}
          title={`${provider.name}${provider.subtitle ? ' — ' + provider.subtitle : ''}`}
          onClick={onToggle}
        >
          {logo ? (
            <img
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              width={22}
              height={22}
              className={`h-[22px] w-[22px] object-contain ${logo.invertOnDark ? 'dark:invert' : ''}`}
            />
          ) : (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {provider.name.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <span id={`provider-header-${provider.slug}`} className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">{provider.name}</span>
            {provider.subtitle && (
              <span className="text-xs text-gray-600 dark:text-gray-300 whitespace-normal break-words">{provider.subtitle}</span>
            )}
          </div>
          <motion.span
            className="ml-auto text-xs text-gray-500"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden
          >
            ▾
          </motion.span>
        </button>
        <div className="px-2 pb-1">
          <Link
            to={`/providers/${provider.slug}`}
            className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}
            onClick={(e) => {
              e.stopPropagation();
              trackEvent('landing.providers.card.details_click', { slug: provider.slug, name: provider.name });
            }}
          >
            {String(t('marketing.providers.actions.details' as any, 'Details ansehen'))}
          </Link>
        </div>
        {provider.content && (
          <div
            ref={panelRef}
            className="px-0 pt-0 pb-0 overflow-hidden transition-[max-height] duration-300 ease-out"
            style={{ maxHeight }}
            role="region"
            id={`provider-panel-${provider.slug}`}
            aria-labelledby={`provider-header-${provider.slug}`}
          >
            <motion.div
              ref={contentRef}
              initial={false}
              animate={{ opacity: open ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm leading-snug text-gray-700 dark:text-gray-200 px-2.5 py-2">{provider.content}</p>
            </motion.div>
          </div>
        )}
      </Card>
    </motion.li>
  );
}