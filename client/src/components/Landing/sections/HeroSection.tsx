import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
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
  const sceneInView = useInView(sceneAnchorRef, { amount: 0.6, margin: '0px 0px -10% 0px' });
  const prefersReducedMotion = useReducedMotion();
  const reduceAll = !!instant || !!prefersReducedMotion; // Skip Animations bei Reduced Motion oder Instant

  // Interaction-Gate: nur nach echter Interaktion rendern
  const [userInteracted, setUserInteracted] = useState(false);
  useEffect(() => {
    const onWheel = () => setUserInteracted(true);
    const onTouchStart = () => setUserInteracted(true);
    const onKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowDown', 'PageDown', 'Space', ' '];
      if (keys.includes(e.key)) setUserInteracted(true);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);
  const armedScene = reduceAll ? true : (userInteracted && sceneInView);

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
    <LandingSection id="hero" className="hero-aurora overflow-visible scroll-mt-0 pt-8 pb-14 md:pt-0 md:pb-12 min-h-screen md:min-h-0" ariaLabelledby="hero-heading" noBorder>
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
        <div className="px-0 md:col-span-7">
              <div className="mt-5 sm:mt-6 md:mt-0">
              <motion.h2
                id="hero-heading"
                className="mt-6 sm:mt-8 md:mt-0 text-3xl sm:text-4xl md:text-5xl !text-3xl sm:!text-4xl md:!text-5xl font-bold !font-bold tracking-tight !tracking-tight text-gray-900 dark:text-white text-center md:text-left leading-[0.95] overflow-visible mx-auto max-w-full"
              >
                {/* Brand Title animation: 3s sequence */}
                {(() => {
                  const brandFull = copy.h1Brand;
                  const match = brandFull.match(/^(\S+)\s+(\S+)$/);
                  const brandWord = match ? match[1] : brandFull;
                  const brandAI = match ? match[2] : '';

                  if (reduceAll) {
                    // Static rendering (no animation)
                    return (
                      <strong className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-sky-300 to-cyan-100 whitespace-nowrap">
                        {brandWord}{'\u00A0'}{brandAI}
                      </strong>
                    );
                  }

                  return (
                    <span className="inline-flex items-baseline whitespace-nowrap align-baseline">
                      {/* SIGMACODE layered: neutral underlay + gradient overlay crossfade after AI arrives */}
                      <span className="relative inline-block">
                        {/* Neutral layer (sichtbar bis die Welle "durch" ist) */}
                        <motion.span
                          className="text-neutral-900 dark:text-white"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          transition={{ delay: 2.2, duration: 0.6, ease: 'easeInOut' }}
                        >
                          {brandWord}
                        </motion.span>
                        {/* Gradient layer mit weicher Wellenkante (Masken-Reveal) */}
                        <motion.span
                          className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-sky-300 to-cyan-100"
                          style={{
                            // Reveal-Position in %, Feather definiert die Weichheit der Wellenkante (in %-Punkten)
                            ['--reveal' as any]: 0,
                            ['--feather' as any]: 3,
                            WebkitMaskImage:
                              'linear-gradient(to right, black 0%, black calc((var(--reveal) - var(--feather)) * 1%), rgba(0,0,0,0.85) calc(var(--reveal) * 1%), transparent calc((var(--reveal) + var(--feather)) * 1%), transparent 100%)',
                            maskImage:
                              'linear-gradient(to right, black 0%, black calc((var(--reveal) - var(--feather)) * 1%), rgba(0,0,0,0.85) calc(var(--reveal) * 1%), transparent calc((var(--reveal) + var(--feather)) * 1%), transparent 100%)',
                            willChange: 'opacity, transform'
                          }}
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1, ['--reveal' as any]: 100 }}
                          transition={{ delay: 1.1, duration: 1.15, ease: 'easeInOut' }}
                          aria-hidden="true"
                        >
                          {brandWord}
                        </motion.span>
                        {/* Sheen (schmale Glanzfront), die der Welle etwas vorausläuft */}
                        <motion.span
                          className="pointer-events-none absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-white/80 via-cyan-100 to-transparent"
                          style={{
                            ['--sheen' as any]: 0,
                            ['--band' as any]: 1.2,
                            WebkitMaskImage:
                              'linear-gradient(to right, transparent calc((var(--sheen) - var(--band)) * 1%), black calc(var(--sheen) * 1%), transparent calc((var(--sheen) + var(--band)) * 1%))',
                            maskImage:
                              'linear-gradient(to right, transparent calc((var(--sheen) - var(--band)) * 1%), black calc(var(--sheen) * 1%), transparent calc((var(--sheen) + var(--band)) * 1%))',
                            filter: 'blur(0.5px)',
                            willChange: 'opacity, transform'
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ ['--sheen' as any]: 100, opacity: [0, 0.65, 0] }}
                          transition={{ delay: 1.0, duration: 1.1, ease: 'easeInOut', times: [0, 0.4, 1] }}
                          aria-hidden="true"
                        >
                          {brandWord}
                        </motion.span>
                      </span>
                      {/* NBSP keeps single line spacing */}
                      <span aria-hidden="true">&nbsp;</span>
                      {/* AI slides in from left with gradient already applied */}
                      <motion.span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-sky-300 to-cyan-100 inline-block"
                        initial={{ x: -16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}
                      >
                        {brandAI}
                      </motion.span>
                    </span>
                  );
                })()}
              </motion.h2>
              <motion.p
                className="title-rest block mt-3 sm:mt-4 typo-subtitle-lg text-neutralx-800 dark:text-neutralx-100 text-left"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                {copy.h1Tagline}
              </motion.p>
              <motion.p
                className="mt-4 sm:mt-6 typo-body-lg text-neutralx-600 dark:text-neutralx-300 max-w-2xl text-left"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                {copy.subcopy}
              </motion.p>
              <motion.div
                className="mt-4 sm:mt-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                <BadgeGroup items={heroBadges} className="mt-1 gap-1 px-0" />
              </motion.div>
              <motion.div
                className="mt-0 flex flex-col sm:flex-row gap-3 sm:gap-4"
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
                className="mt-3 sm:mt-4 flex flex-wrap items-center justify-start gap-1"
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
              <motion.div
                className="mt-10 sm:mt-14"
                initial={reduceAll ? undefined : 'hidden'}
                whileInView={reduceAll ? undefined : 'show'}
                viewport={viewportOnce}
                variants={fadeInUp}
              >
                {/* Trustbar - Infinite Slider mit allen Logos (ruhig, kontinuierlich)
                 Spacing stark erhöht: padding-top vermeidet Margin-Collapse */}
                <div className="pt-0 mt-0 typo-caption text-neutralx-500 dark:text-neutralx-400 md:max-w-7xl md:mx-auto">
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
                </div>
              </motion.div>
            </div>
        </div>
        <div ref={sceneAnchorRef} className="relative mt-6 sm:mt-8 md:mt-0 md:self-start md:h-full overflow-hidden px-2 md:px-2 mx-auto w-full md:col-span-5" style={{ maxWidth: 'clamp(420px, 42vw, 620px)' }}>
            {/* Render und Laden der 3D-Teaser-Animation erst nach Interaktion + Sichtbarkeit */}
            {armedScene ? (
              <Suspense fallback={<div className="relative w-full aspect-[1/1] sm:aspect-[4/3] md:aspect-auto md:h-full lg:h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/10 to-gray-800/20" />}> 
                <HeroAgentScene instant={reduceAll} />
              </Suspense>
            ) : (
              // Leichter Platzhalter, bis Scroll/Interaktion erfolgt
              <div
                className="relative w-full aspect-[1/1] sm:aspect-[4/3] md:aspect-auto md:h-full lg:h-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/10 to-gray-800/20"
                aria-label="Teaser wird bei Scroll/Interaktion geladen"
              />
            )}
        </div>
      </div>
    </LandingSection>
  );
}
