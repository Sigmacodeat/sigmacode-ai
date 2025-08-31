 import { useEffect, useState } from 'react';
 import { Bot, Plug, ShieldCheck, Gauge } from 'lucide-react';
 import SectionHeader from '../../marketing/SectionHeader';
 import LandingSection from '../components/LandingSection';
 import { useTranslation } from 'react-i18next';
 import { Reveal } from '../../motion/Reveal';
 import Stagger from '../../motion/Stagger';
 import { AgentLaunchScene } from '../HeroAgentScene';

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
        <div>
          <Reveal as="div" variant="rise" y={12}>
            <SectionHeader
              icon={Bot}
              badgeText={tt('marketing.landing.sections.badges.agents', 'AI Agents')}
              badgeVariant="glass"
              badgeTone="indigo"
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
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            data-analytics-id="agent-hero-bullets"
            role="list"
            gap={80}
            startDelay={120}
          >
            {bullets.map((b, i) => {
              const Icon = [Plug, ShieldCheck, Gauge][i] ?? Plug;
              return (
                <li key={`${b}-${i}`} data-idx={i} data-title={b} className="list-none">
                  <Reveal as="div" variant="rise" y={8}>
                    <div
                      className="grid grid-cols-[auto,1fr] items-start gap-3 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 text-sm sm:text-[0.95rem] shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md hover:border-brand-primary/40 hover:bg-white focus-visible:outline-none focus-within:outline-none focus-visible:ring-2 focus-within:ring-2 focus-visible:ring-brand-primary/30 focus-within:ring-brand-primary/30 dark:border-gray-800 dark:bg-gray-900/70 dark:hover:border-brand-primary/40"
                      role="group"
                      aria-label={b}
                      tabIndex={0}
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-primary/30 bg-white text-brand-primary shadow-sm dark:border-brand-primary/25 dark:bg-gray-950">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-gray-800 dark:text-gray-100 leading-snug sm:leading-relaxed tracking-[0.005em] break-words">
                        {b}
                      </span>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </Stagger>
        </div>
        <div
          className="relative overflow-visible mx-auto w-full p-0"
          data-analytics-id="agent-hero-visual"
        >
          <Reveal as="div" variant="fade" delay={140}>
            {/* Neue Launch-Szene: Agenten werden aus dem Zentrum auf Orbit geschossen mit Tool-Orbits */}
            <AgentLaunchScene instant={reduceAll} />
          </Reveal>
        </div>
      </div>
    </LandingSection>
  );
}
