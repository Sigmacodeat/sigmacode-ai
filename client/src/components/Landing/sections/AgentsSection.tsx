 import { useEffect, useState } from 'react';
import { Bot, Plug, ShieldCheck, Gauge } from 'lucide-react';
import SectionHeader from '../../marketing/SectionHeader';
import LandingSection from '../components/LandingSection';
import { useTranslation } from 'react-i18next';
import { Reveal } from '../../motion/Reveal';
import Stagger from '../../motion/Stagger';
import { AgentLaunchScene } from '../HeroAgentScene';
import Card from '../components/Card';

export default function AgentHeroSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const tAny = t as unknown as (key: string, options?: Record<string, unknown>) => unknown;
  // Motion aktiviert (Reveal/Stagger)

  // Bullets via i18n (returnObjects) mit Fallback
  const defaultBullets = [
    tt('marketing.agents.hero.bullets.0', 'Plug‑and‑Play Integrationen'),
    tt('marketing.agents.hero.bullets.1', 'RBAC & Audit‑Logs'),
    tt('marketing.agents.hero.bullets.2', 'Skalierbar mit Queues & Caching'),
  ];
  const rawBullets = tAny('marketing.agents.hero.bullets', { returnObjects: true, defaultValue: defaultBullets });
  const bullets = Array.isArray(rawBullets)
    ? rawBullets.map((b, i) => (typeof b === 'string' ? b : String((b as any)?.title ?? defaultBullets[i] ?? ''))).filter(Boolean)
    : defaultBullets;

  // Reduced motion respektieren (nur Client)
  const [reduceAll, setReduceAll] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setReduceAll(!!mq.matches);
      update();
      mq.addEventListener?.('change', update);
      return () => mq.removeEventListener?.('change', update);
    }
  }, []);

  return (
    <LandingSection id="agents-hero" noBorder className="-mt-px overflow-visible">
      <div
        className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10"
        data-analytics-id="agent-hero-grid"
      >
        <div
          className="relative overflow-visible mx-auto w-full p-0 order-2 md:order-1"
          data-analytics-id="agent-hero-visual"
        >
          <Reveal as="div" variant="fade" delay={140}>
            {/* Neue Launch-Szene: Agenten werden aus dem Zentrum auf Orbit geschossen mit Tool-Orbits */}
            <AgentLaunchScene instant={reduceAll} />
          </Reveal>
        </div>
        <div className="order-1 md:order-2">
          <Reveal as="div" variant="rise" y={12}>
            <SectionHeader
              icon={Bot}
              badgeText={tt('marketing.landing.sections.badges.agents', 'AI Agents')}
              badgeVariant="glass"
              badgeTone="teal"
              badgeSize="md"
              badgeClassName="h-8 py-0"
              title={tt('marketing.agents.hero.title', 'AI‑Agenten, die verbinden und verstehen')}
              titleClassName="text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
              subtitle={
                <span className="block text-gray-600 dark:text-gray-200">
                  {tt(
                    'marketing.agents.hero.subtitle',
                    'Verbinde Systeme, ingestiere Datenströme und reagiere in Echtzeit – sicher und skalierbar.'
                  )}
                </span>
              }
            />
          </Reveal>
          <Stagger
            as="ul"
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch gap-3 sm:gap-4"
            data-analytics-id="agent-hero-bullets"
            role="list"
            gap={80}
            startDelay={120}
          >
            {bullets.map((b, i) => {
              const Icon = [Plug, ShieldCheck, Gauge][i] ?? Plug;
              return (
                <li key={`${b}-${i}`} data-idx={i} data-title={b} className="list-none h-full">
                  <Reveal as="div" variant="rise" y={8}>
                    <Card variant="subtle" role="group" aria-label={b} data-analytics-id="agent-bullet-card">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 ring-1 ring-black/5 dark:ring-zinc-300/15">
                          <Icon className="h-5 w-5" strokeWidth={2.1} aria-hidden="true" />
                        </span>
                        <span title={b} className="min-w-0 max-w-full text-sm leading-tight tracking-[0.005em] break-words whitespace-normal hyphens-auto font-medium antialiased">
                          {b}
                        </span>
                      </div>
                    </Card>
                  </Reveal>
                </li>
              );
            })}
          </Stagger>
        </div>
      </div>
    </LandingSection>
  );
}
