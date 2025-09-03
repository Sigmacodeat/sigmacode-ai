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

import InteractivePitchdeck from '@/components/pitchdeck/InteractivePitchdeck';

export default function LandingPage() {
  return (
    <>
      <SeoJsonLd />
      <SEO title="SIGMACODE AI" />
      <SkipToContent />

      {/* Content-Frame: feiner Rand nur um den Hauptinhalt, ohne Header/Footer */}
      <div className="m-3 md:m-6 mx-auto w-full max-w-[960px] px-4 md:px-6 rounded-2xl border border-neutral-300/60 dark:border-neutral-700/60 shadow-sm overflow-hidden">
        {/* Above-the-fold */}
        <HeroSection />
        <AgentsSection />
        <ContextSection />

        {/* Below-the-fold (lazy) */}
        <Suspense fallback={<LoadingFallback />}>
          <AgentsOverviewTeaserSection />
          <BusinessAITeaserSection />
          <AgentsMASTeaserSection />
          <FlowSection />
          <ProvidersSection />
          <SecuritySection />
          <HighlightsSection />
          <IntegrationsSection />
          <UseCasesSection />
          <PricingSection />
          <TestimonialsSection />
          <FinalCtaSection />
          <FaqSection />
        </Suspense>
      </div>

      {/* Footer außerhalb des Rahmens, separat lazy */}
      <Suspense fallback={<LoadingFallback />}>
        <SiteFooter />
      </Suspense>
    </>
  );
}
