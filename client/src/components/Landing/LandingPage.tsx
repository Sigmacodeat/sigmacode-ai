// External
import { Suspense, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Layout & SEO
import { SeoJsonLd } from './SeoJsonLd';
import SEO from '@/components/marketing/SEO';
import LoadingFallback from './components/LoadingFallback';
import SkipToContent from '../a11y/SkipToContent';
import { trackEvent } from '@/utils/analytics';

// Sections & helpers (in Sicht-Reihenfolge)
// Above-the-fold: statisch
import HeroSection from './sections/HeroSection';
import AgentsSection from './sections/AgentsSection';
import ContextSection from './sections/ContextSection';

// Below-the-fold: lazy
const AgentsOverviewTeaserSection = lazy(() => import('./sections/AgentsOverviewTeaserSection'));
const BusinessAITeaserSection = lazy(() => import('./sections/BusinessAITeaserSection'));
const AgentsMASTeaserSection = lazy(() => import('./sections/AgentsMASTeaserSection'));
const FlowSection = lazy(() => import('./sections/FlowSection'));
const ProvidersSection = lazy(() => import('./sections/ProvidersSection'));
const SecuritySection = lazy(() => import('./sections/SecuritySection'));
const HighlightsSection = lazy(() => import('./sections/HighlightsSection'));
const IntegrationsSection = lazy(() => import('./sections/IntegrationsSection'));
const UseCasesSection = lazy(() => import('./sections/UseCasesSection'));
const PricingSection = lazy(() => import('./sections/PricingSection'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'));
const FinalCtaSection = lazy(() => import('./sections/FinalCtaSection'));
const FaqSection = lazy(() => import('./sections/FaqSection'));
const SiteFooter = lazy(() => import('./sections/SiteFooter'));

// Minimalistische, moderne Landingpage mit Tailwind + Framer Motion
// CTA im Header -> /c/new
// Sektionen (Auszug): Hero, AgentHero, What/Overview, BusinessAI, AgentsMAS, HowItWorks, Providers, Security, Features, Integrations, UseCases, Pricing(+Details), Testimonials, CTA, FAQ, Footer

export default function LandingPage() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, options?: any) => string;
  // SEO/Schema.org JSON-LD wird über <SeoJsonLd /> eingebunden.
  const [instant, setInstant] = useState(false);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qp = params.get('skipIntro');
      const ls = typeof window !== 'undefined' ? window.localStorage.getItem('landingIntroSkip') : null;
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (qp === '1' || ls === '1' || prefersReduced) {
        setInstant(true);
      }
    } catch {
      // noop
    }
  }, []);
  useEffect(() => {
    // Analytics: Page view for landing page
    trackEvent('landing.page_view');
  }, []);
  return (
    <>
      {/* Meta/OG/Twitter & Canonical */}
      <SEO
        title={`${tt('marketing.landing.meta.title', { defaultValue: 'SIGMACODE AI – Build, Orchestrate & Deploy AI Agents' })}`}
        description={tt('marketing.landing.meta.description', {
          defaultValue: 'Die modulare AI-Agentenplattform für Unternehmen: verbinden, orchestrieren, sicher betreiben. Multi‑Provider, Governance, Observability und Integrationen – bereit für Produktion.',
        })}
        canonical="/"
        robots="index,follow"
        openGraph={{
          title: tt('marketing.landing.meta.ogTitle', { defaultValue: 'SIGMACODE AI' }),
          description: tt('marketing.landing.meta.ogDescription', { defaultValue: 'Enterprise‑fähige AI‑Agentenplattform' }),
          type: 'website',
          siteName: 'SIGMACODE AI',
        }}
        twitter={{
          card: 'summary_large_image',
          title: tt('marketing.landing.meta.twTitle', { defaultValue: 'SIGMACODE AI' }),
          description: tt('marketing.landing.meta.twDescription', { defaultValue: 'Build, Orchestrate & Deploy AI Agents' }),
        }}
      />
      {/* JSON-LD: Organization, WebSite, FAQPage, Service */}
      <SeoJsonLd />
      <SkipToContent />
      {/* Site-wide background + inner bordered container */}
      <div className="relative min-h-screen">
        {/* Soft gradient background behind everything */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-transparent dark:from-transparent dark:to-transparent"
        />
        <main id="main" role="main" aria-labelledby="hero-heading" tabIndex={-1}>
          <div className="relative mx-auto max-w-7xl px-3 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
            <div
              className="landing-card my-6 rounded-2xl border border-gray-200/70 bg-white/70 shadow-sm backdrop-blur-sm sm:my-10 lg:my-16 dark:border-white/10 dark:bg-white/[0.02]"
            >
              {/* Breathing room so the border is visible; more space at the bottom */}
              <div className="px-3 pt-2 pb-6 sm:px-6 sm:pt-3 sm:pb-8 lg:px-8 lg:pt-4 lg:pb-10">
                <StaticLandingContent instant={instant} />
              </div>
            </div>
          </div>

          {/* External sections: outside the bordered container */}
          <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-10">
            <Suspense
              fallback={
                <div role="status" aria-live="polite" aria-busy="true">
                  <LoadingFallback />
                </div>
              }
            >
              <FaqSection />
              <SiteFooter />
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}

function StaticLandingContent({ instant }: { instant: boolean }) {
  return (
    <>
      <HeroSection instant={instant} />
      <AgentsSection />
      <ContextSection />
      <Suspense
        fallback={
          <div role="status" aria-live="polite" aria-busy="true">
            <LoadingFallback />
          </div>
        }
      >
        {/* Three teasers: responsive auto-fit. Full-bleed on mobile for edge-to-edge look */}
        <div className="mt-4 -mx-3 sm:mx-0 grid [grid-template-columns:repeat(auto-fit,minmax(18rem,1fr))] gap-4 sm:gap-6 items-stretch">
          <AgentsOverviewTeaserSection />
          <BusinessAITeaserSection />
          <AgentsMASTeaserSection />
        </div>
        <FlowSection />
        <ProvidersSection />
        <SecuritySection />
        <HighlightsSection />
        <IntegrationsSection />
        <UseCasesSection />
        <PricingSection />
        <TestimonialsSection />
        <FinalCtaSection />
      </Suspense>
    </>
  );
}
