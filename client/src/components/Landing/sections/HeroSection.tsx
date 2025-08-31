import { Link } from 'react-router-dom';
import { useRef } from 'react';
// Progressive Enhancement: keine künstlichen Delays, Inhalte rendern sofort
import BadgeGroup from '../../marketing/BadgeGroup';
import SectionBadge from '../../marketing/SectionBadge';
import { Sparkles, Database, Lock, Cpu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getHeroCopy } from '../../../i18n/hero';
import { TRUST_PROVIDER_ITEMS } from '../../../config/trustbar';
import { HeroAgentScene } from '../HeroAgentScene';
// Cleanup: ungenutzte Animation-Imports entfernt (inViewRise, fadeInUp)
import { buttonStyles, buttonSizeXs } from '../../ui/Button';
import LandingSection from '../components/LandingSection';
import Reveal from '../../motion/Reveal';
import { trackEvent } from '../../../utils/analytics';

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
    { icon: Sparkles, text: tt('marketing.landing.hero.badges.no_code'), variant: 'glass' as const, size: 'xs' as const, tone: 'teal' as const, className: 'h-6 max-[360px]:px-1 px-2 text-[10px] sm:text-[11px] tracking-tight leading-none gap-1 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3' },
    { icon: Database, text: tt('marketing.landing.hero.badges.rag_ready'), variant: 'glass' as const, size: 'xs' as const, tone: 'teal' as const, className: 'h-6 max-[360px]:px-1 px-2 text-[10px] sm:text-[11px] tracking-tight leading-none gap-1 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3' },
    { icon: Lock, text: tt('marketing.landing.hero.badges.policies'), variant: 'outline' as const, size: 'xs' as const, tone: 'amber' as const, className: 'h-6 max-[360px]:px-1 px-2 text-[10px] sm:text-[11px] tracking-tight leading-none gap-1 whitespace-nowrap [&>svg]:h-2.5 [&>svg]:w-2.5 sm:[&>svg]:h-3 sm:[&>svg]:w-3' },
  ];
  // Ensure aria-label receives a string (avoid unknown from i18n typings)
  const trustbarAria = tt('marketing.landing.hero.trustbar_aria', { defaultValue: 'Partner-Logos in Endlosschleife' });
  // Keine gating-/Timer-/Variants-Logik mehr – statisches Rendern
  const sceneAnchorRef = useRef<HTMLDivElement | null>(null);
  const reduceAll = !!instant; // Einfaches Flag: externe Logik liefert Instant (z.B. Reduced Motion / Skip)
  // Reveal-Wrapper: rendert direkt ohne Animation bei reduceAll
  const R = ({ as: As = 'div', children, className, variant, delay, ...rest }: any) => {
    if (reduceAll) {
      return <As className={className} {...rest}>{children}</As>;
    }
    return (
      <Reveal as={As} variant={variant} delay={delay} className={className} {...rest}>
        {children}
      </Reveal>
    );
  };
  return (
    <LandingSection id="hero" className="hero-aurora overflow-visible -mb-px scroll-mt-0" ariaLabelledby="hero-heading" noBorder>
      {/* Signature badge: centered across breakpoints */}
      <div className="flex justify-center md:max-w-7xl md:mx-auto">
        <R as="div" variant="rise" delay={40}>
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
        </R>
      </div>
      <div className="grid grid-cols-1 items-center gap-5 sm:gap-6 md:gap-10 md:grid-cols-12 md:max-w-7xl md:mx-auto">
        <div className="px-1.5 sm:px-2 md:pl-2 md:col-span-7">
              <div>
              <R as="h1" variant="rise" delay={60}
                id="hero-heading"
                className="max-[360px]:text-5xl text-5xl sm:text-7xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.06] sm:leading-[1.04] md:leading-[1.02] text-neutralx-900 dark:text-white text-left break-words md:break-normal"
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
              </R>
              <R as="p" variant="fade" delay={110}
                className="title-rest block mt-1.5 text-xl sm:text-2xl md:text-3xl font-semibold text-neutralx-800 dark:text-neutralx-100 text-left"
              >
                {copy.h1Tagline}
              </R>
              <R as="p" variant="fade" delay={140}
                className="mt-2.5 max-w-xl text-[14px] sm:text-[15px] md:text-base leading-relaxed text-neutralx-600 dark:text-neutralx-300 text-left mx-0"
              >
                {copy.subcopy}
              </R>
              <R as="div" variant="rise" delay={180}>
                <BadgeGroup items={heroBadges} className="mt-3 sm:mt-4 md:mt-5 gap-1 sm:gap-1 px-1 pr-2 sm:pr-3" />
              </R>
              <R as="div" variant="rise" delay={220} className="mt-4 sm:mt-5 flex flex-wrap items-center justify-start gap-2.5 sm:gap-3">
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
              </R>
              {/* Secondary small CTAs in one line below */}
              <R as="div" variant="fade" delay={260} className="mt-2 flex flex-wrap items-center justify-start gap-2.5">
                <Link
                  to="/agents"
                  aria-label={copy.ctaAgents}
                  data-analytics-id="hero-cta-agents"
                  onClick={() => trackEvent('landing.hero.cta.click', { variant: 'agents' })}
                  className={`${buttonStyles.ghost} ${buttonSizeXs.ghost}`}
                >
                  {copy.ctaAgents}
                </Link>
                <Link
                  to="/pricing"
                  aria-label={copy.ctaPricing}
                  data-analytics-id="hero-cta-pricing"
                  onClick={() => trackEvent('landing.hero.cta.click', { variant: 'pricing' })}
                  className={`${buttonStyles.ghost} ${buttonSizeXs.ghost}`}
                >
                  {copy.ctaPricing}
                </Link>
              </R>
              <span id="hero-cta-note" className="sr-only">{copy.ctaNoteSrOnly}</span>
              {/* Trustbar - Infinite Slider mit allen Logos (ruhig, kontinuierlich) */}
              <R as="div" variant="fade" delay={280} className="mt-4 sm:mt-5 md:mt-6 text-[10px] sm:text-xs text-neutralx-500 dark:text-neutralx-400 md:max-w-7xl md:mx-auto">
                <div className="hidden sm:block mb-4 md:mb-6">{copy.trustbarLabel}</div>
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
                            className={`!h-[19px] sm:!h-[16px] md:!h-[19px] w-auto logo-neutral ${item.invertOnDark ? 'logo-invert-dark' : ''}`}
                            loading="lazy"
                            decoding="async"
                            height={19}
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
                            className={`!h-[19px] sm:!h-[16px] md:!h-[19px] w-auto logo-neutral ${item.invertOnDark ? 'logo-invert-dark' : ''}`}
                            loading="lazy"
                            decoding="async"
                            height={19}
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
              </R>
            </div>
        </div>
        <div ref={sceneAnchorRef} className="mt-6 sm:mt-8 md:mt-0 overflow-hidden px-1.5 sm:px-4 md:pl-8 md:pr-0 mx-auto w-full max-w-[520px] sm:max-w-[600px] md:max-w-none md:col-span-5">
            <R as="div" variant="rise" delay={160} style={{ willChange: 'opacity, transform' }}>
              <HeroAgentScene messages={copy.messages} instant={reduceAll} />
            </R>
        </div>
      </div>
    </LandingSection>
  );
}

