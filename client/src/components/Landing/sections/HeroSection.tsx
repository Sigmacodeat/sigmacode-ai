import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Suspense, lazy } from 'react';
// Progressive Enhancement: keine künstlichen Delays, Inhalte rendern sofort
import BadgeGroup from '../../marketing/BadgeGroup';
import SectionBadge from '../../marketing/SectionBadge';
import { Sparkles, Database, Lock, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getHeroCopy } from '../../../i18n/hero';
import { TRUST_PROVIDER_ITEMS } from '../../../config/trustbar';
// Dynamischer Import für 3D-Szene
const HeroAgentScene = lazy(() => import('../HeroAgentScene').then(module => ({ default: module.HeroAgentScene })));
// Motion Presets
import { containerVar, itemVar, fadeInUp, viewportOnce } from '~/components/pitchdeck/Shared/variants';
import { buttonStyles, buttonSizeXs } from '../../ui/Button';
import LandingSection from '../components/LandingSection';
import { trackEvent } from '../../../utils/analytics';
// OrbitClockwork entfernt

type HeroSectionProps = {
  onReady?: () => void; // deprecated, keine gating-Logik mehr
  instant?: boolean; // skip intro animations (reduced-motion or skip flag)
};

export default function HeroSection({ onReady, instant = false }: HeroSectionProps) {
  // Locale dynamisch aus i18next ableiten
  const { t, i18n } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  const currentLocale = (i18n.language || 'de').toLowerCase().startsWith('en') ? 'en' : 'de';
  const copy = getHeroCopy(currentLocale as 'de' | 'en');
  const heroBadges = [
    { icon: Sparkles, text: tt('marketing.landing.hero.badges.no_code'), variant: 'outline' as const, size: 'xs' as const, tone: 'teal' as const, className: 'h-6 max-[360px]:px-1 px-2 text-[10px] sm:text-[11px] tracking-tight leading-none gap-1 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3' },
    { icon: Database, text: tt('marketing.landing.hero.badges.rag_ready'), variant: 'outline' as const, size: 'xs' as const, tone: 'neutral' as const, className: 'h-6 max-[360px]:px-1 px-2 text-[10px] sm:text-[11px] tracking-tight leading-none gap-1 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3' },
    { icon: Lock, text: tt('marketing.landing.hero.badges.policies'), variant: 'outline' as const, size: 'xs' as const, tone: 'neutral' as const, className: 'h-6 max-[360px]:px-1 px-2 text-[10px] sm:text-[11px] tracking-tight leading-none gap-1 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3' },
  ];
  // Ensure aria-label receives a string (avoid unknown from i18n typings)
  const trustbarAria = tt('marketing.landing.hero.trustbar_aria', { defaultValue: 'Partner-Logos in Endlosschleife' });
  // Keine gating-/Timer-/Variants-Logik mehr – statisches Rendern
  const sceneAnchorRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceAll = !!instant || !!prefersReducedMotion; // Skip Animations bei Reduced Motion oder Instant

  useEffect(() => {
    const heroSection = document.getElementById('hero');
    if (window.performance && heroSection) {
      const lcpEntry = performance.getEntriesByName('hero-lcp')[0];
      if (!lcpEntry) {
        performance.mark('hero-lcp-start');
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // Korrektur: Verwende entry.element statt entry.id
            if ((entry as LargestContentfulPaint).element?.id === 'hero-heading') {
              performance.mark('hero-lcp-end');
              performance.measure('hero-lcp', 'hero-lcp-start', 'hero-lcp-end');
              observer.disconnect();
            }
          }
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      }
    }
  }, []);

  return (
    <LandingSection id="hero" className="hero-aurora overflow-visible scroll-mt-0 pt-6 md:pt-8 pb-14 md:pb-20" ariaLabelledby="hero-heading" noBorder>
      {/* Signature badge: centered across breakpoints */}
      <div className="flex justify-center md:max-w-7xl md:mx-auto">
        <motion.div
          initial={reduceAll ? undefined : 'hidden'}
          whileInView={reduceAll ? undefined : 'show'}
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <SectionBadge
            icon={Cpu}
            variant="outline"
            tone="teal"
            size="md"
            className="h-7 max-[360px]:h-6 py-0 whitespace-nowrap"
            ariaLabel={copy.badgeSignature}
          >
            {copy.badgeSignature}
          </SectionBadge>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 items-start md:items-stretch gap-5 sm:gap-6 md:gap-10 md:grid-cols-12">
        <div className="px-1.5 sm:px-2 md:pl-2 md:col-span-7">
              <div className="mt-5 sm:mt-6 md:mt-7">
              <motion.h1
                className="mt-8 sm:mt-10 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-left"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                <strong
                  className={[
                    'bg-clip-text',
                    'text-transparent',
                    'bg-gradient-to-l',
                    'from-teal-500',
                    'via-sky-300',
                    'to-cyan-100',
                    'whitespace-nowrap',
                  ].join(' ')}
                >
                  {copy.h1Brand}
                </strong>
              </motion.h1>
              <motion.p
                className="title-rest block mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-medium text-neutralx-800 dark:text-neutralx-100 text-left"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                {copy.h1Tagline}
              </motion.p>
              <motion.p
                className="mt-4 sm:mt-5 max-w-xl text-[14px] sm:text-[15px] md:text-base leading-relaxed text-neutralx-600 dark:text-neutralx-300 text-left mx-0"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                {copy.subcopy}
              </motion.p>
              <motion.div
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                <BadgeGroup items={heroBadges} className="mt-1 gap-1 px-0" />
              </motion.div>
              <motion.div
                className="mt-4 flex flex-wrap items-center justify-start gap-2"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={containerVar}
              >
                <motion.div variants={itemVar} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                  to="/c/new"
                  aria-label={copy.ctaPrimary}
                  aria-describedby="hero-cta-note"
                  data-analytics-id="hero-cta-primary"
                  onClick={() => trackEvent('landing.hero.cta.click', { variant: 'primary' })}
                  className={`${buttonStyles.primary} ${buttonSizeXs.primary}`}
                  >
                    {copy.ctaPrimary}
                  </Link>
                </motion.div>
                <motion.div variants={itemVar} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <a
                  href="#features"
                  aria-label={copy.ctaSecondary}
                  aria-controls="features"
                  data-analytics-id="hero-cta-secondary"
                  onClick={() => trackEvent('landing.hero.cta.click', { variant: 'secondary' })}
                  className={`${buttonStyles.secondary} ${buttonSizeXs.secondary} focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
                  >
                    {copy.ctaSecondary}
                  </a>
                </motion.div>
              </motion.div>
              {/* Secondary small CTAs in one line below */}
              <motion.div
                className="mt-1 flex flex-wrap items-center justify-start gap-1"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={containerVar}
              >
                <motion.div variants={itemVar}>
                  <Link
                    to="/agents"
                    aria-label={copy.ctaAgents}
                    data-analytics-id="hero-cta-agents"
                    onClick={() => trackEvent('landing.hero.cta.click', { variant: 'agents' })}
                    className={`${buttonStyles.ghost} ${buttonSizeXs.ghost}`}
                  >
                    {copy.ctaAgents}
                  </Link>
                </motion.div>
                <motion.div variants={itemVar}>
                  <Link
                    to="/pricing"
                    aria-label={copy.ctaPricing}
                    data-analytics-id="hero-cta-pricing"
                    onClick={() => trackEvent('landing.hero.cta.click', { variant: 'pricing' })}
                    className={`${buttonStyles.ghost} ${buttonSizeXs.ghost}`}
                  >
                    {copy.ctaPricing}
                  </Link>
                </motion.div>
              </motion.div>
              <span id="hero-cta-note" className="sr-only">{copy.ctaNoteSrOnly}</span>
              {/* Trustbar - Infinite Slider mit allen Logos (ruhig, kontinuierlich)
                 Spacing stark erhöht: padding-top vermeidet Margin-Collapse */}
              <motion.div
                className="pt-12 sm:pt-16 md:pt-20 mt-0 text-[10px] sm:text-xs text-neutralx-500 dark:text-neutralx-400 md:max-w-7xl md:mx-auto"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                <div className="hidden sm:block mb-5 md:mb-8">{copy.trustbarLabel}</div>
                <div className="trustbar-wrapper w-full overflow-hidden">
                  <div
                    className={`trustbar-track ${reduceAll ? '' : 'is-animating'}`}
                    aria-live="off"
                    aria-label={trustbarAria}
                    style={{ willChange: 'transform' }}
                  >
                    {/* Sequenz A */}
                    <div className="trustbar-seq">
                      {TRUST_PROVIDER_ITEMS.map((item) => (
                        item.src ? (
                          <img
                            key={item.name}
                            src={item.src}
                            alt={item.alt || item.name}
                            aria-label={tt('marketing.landing.hero.partner_label', { defaultValue: 'Partner {{name}}', name: item.name })}
                            className={`!h-[24px] sm:!h-[26px] md:!h-[30px] w-auto logo-neutral ${item.invertOnDark ? 'logo-invert-dark' : ''}`}
                            loading="eager"
                            decoding="async"
                            height={22}
                          />
                        ) : (
                          <span
                            key={item.name}
                            className="ui-glass-pill px-1.5 py-0.5 sm:px-2 sm:py-1 text-[11px] sm:text-[12px] font-medium dark:text-white/90"
                            aria-label={tt('marketing.landing.hero.partner_label', { defaultValue: 'Partner {{name}}', name: item.name })}
                          >
                            {item.name}
                          </span>
                        )
                      ))}
                    </div>
                    {/* Sequenz B (Duplikat für nahtlose Schleife) */}
                    <div className="trustbar-seq" aria-hidden="true">
                      {TRUST_PROVIDER_ITEMS.map((item) => (
                        item.src ? (
                          <img
                            key={`${item.name}-dup`}
                            src={item.src}
                            alt=""
                            aria-hidden="true"
                            className={`!h-[24px] sm:!h-[26px] md:!h-[30px] w-auto logo-neutral ${item.invertOnDark ? 'logo-invert-dark' : ''}`}
                            loading="eager"
                            decoding="async"
                            height={22}
                          />
                        ) : (
                          <span
                            key={`${item.name}-dup`}
                            className="ui-glass-pill px-1.5 py-0.5 sm:px-2 sm:py-1 text-[11px] sm:text-[12px] font-medium dark:text-white/90"
                            aria-hidden="true"
                          >
                            {item.name}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
        </div>
        <div ref={sceneAnchorRef} className="relative mt-6 sm:mt-8 md:mt-0 md:self-start md:h-full overflow-hidden px-1.5 sm:px-4 md:pl-8 md:pr-0 mx-auto w-full md:col-span-5" style={{ maxWidth: 'clamp(420px, 42vw, 620px)' }}>
            <Suspense fallback={<div className="aspect-square bg-gradient-to-br from-gray-900/10 to-gray-800/20 rounded-xl" />}>
              <HeroAgentScene instant={reduceAll} />
            </Suspense>
        </div>
      </div>
    </LandingSection>
  );
}
