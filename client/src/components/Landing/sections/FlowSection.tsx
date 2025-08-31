// Motion: Reveal/Stagger
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import { useTranslation } from 'react-i18next';
import { buttonStyles } from '../../ui/Button';
import LandingSection from '../components/LandingSection';
import { Reveal } from '../../motion/Reveal';
import Stagger from '../../motion/Stagger';
import { trackEvent } from '../../../utils/analytics';
 

export default function HowItWorksSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const Icon = UNIFIED_ICON_SET[4];

  // Default Steps als Fallback
  const defaultSteps = [
    {
      title: tt('marketing.landing.how.steps.connect.title', 'Verbinden'),
      desc: tt(
        'marketing.landing.how.steps.connect.desc',
        'Provider & Datenquellen (OpenAI, Anthropic, Mistral, RAG API, Datenbanken, Webhooks).'
      ),
    },
    {
      title: tt('marketing.landing.how.steps.orchestrate.title', 'Orchestrieren'),
      desc: tt(
        'marketing.landing.how.steps.orchestrate.desc',
        'Agenten konfigurieren: Tools, Policies, Ketten (Max Steps), Berechtigungen.'
      ),
    },
    {
      title: tt('marketing.landing.how.steps.deploy.title', 'Ausrollen'),
      desc: tt('marketing.landing.how.steps.deploy.desc', 'Testen, freigeben, skalieren – mit Monitoring, RBAC und SLA.'),
    },
  ];
  // i18n: Optional Array via returnObjects
  const rawSteps = t('marketing.landing.how.steps', { returnObjects: true, defaultValue: defaultSteps }) as unknown;
  const steps = Array.isArray(rawSteps)
    ? rawSteps
        .map((s, i) => {
          if (typeof s === 'string') {
            // Falls Übersetzer ein String liefert, als Titel nutzen und Fallback-Desc verwenden
            return { title: s, desc: defaultSteps[i]?.desc ?? '' };
          }
          const obj = s as { title?: string; desc?: string };
          return {
            title: obj.title ?? defaultSteps[i]?.title ?? '',
            desc: obj.desc ?? defaultSteps[i]?.desc ?? '',
          };
        })
        .filter((s) => s.title)
    : defaultSteps;
  return (
    <LandingSection id="how-it-works" ariaLabelledby="how-it-works-heading" className="-mt-px">
      <Reveal as="div" variant="rise" y={12}>
        <SectionHeader
          icon={Icon}
          badgeText={tt('marketing.landing.sections.badges.flow')}
          id="how-it-works-heading"
          title={tt('marketing.landing.how.title', 'So funktioniert’s')}
        />
      </Reveal>

      <Stagger
        as="ul"
        className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3"
        role="list"
        data-analytics-id="how-steps-grid"
        gap={80}
        startDelay={120}
      >
        {steps.map((s, i) => {
          const StepIcon = UNIFIED_ICON_SET[(i + 2) % UNIFIED_ICON_SET.length];
          const num = i + 1;
          const primary =
            i === 0
              ? { to: '/how-it-works/connect', label: tt('marketing.landing.how.cta.connect', 'Verbinden'), aria: tt('marketing.landing.how.cta.connect_aria', 'Zu Verbinden (Connect)') }
              : i === 1
              ? { to: '/how-it-works/orchestrate', label: tt('marketing.landing.how.cta.orchestrate', 'Orchestrieren'), aria: tt('marketing.landing.how.cta.orchestrate_aria', 'Zu Orchestrieren') }
              : { to: '/how-it-works/deploy', label: tt('marketing.landing.how.cta.deploy', 'Ausrollen'), aria: tt('marketing.landing.how.cta.deploy_aria', 'Zu Ausrollen (Deploy)') };
          const overview = { to: '/how-it-works', label: tt('marketing.landing.how.cta.overview', 'Übersicht'), aria: tt('marketing.landing.how.cta.overview_aria', 'Zur How‑it‑works Übersicht') };

          return (
            <li key={`${s.title}-${i}`}>
              <Reveal as="div" variant="rise" y={10}>
                <div>
                  <Card
                    variant="plain"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 ring-1 ring-black/5 bg-white/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-teal-400/40 dark:bg-gray-900/60 dark:ring-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/40"
                    data-analytics-id="how-step-card"
                    data-idx={i}
                    data-title={s.title}
                  >
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-teal-500/40 via-cyan-500/30 to-transparent" />
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500/80 to-cyan-500/80 text-white text-[13px] font-semibold ring-1 ring-black/10 shadow-sm"
                      >
                        {num}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">{s.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-gray-700/95 dark:text-gray-200/95">{s.desc}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Link
                            to={primary.to}
                            className={buttonStyles.primary}
                            aria-label={primary.aria}
                            data-analytics-id={`how-step:${num}:primary`}
                            onClick={() => trackEvent('landing.how.step.click', { step: num, to: primary.to })}
                          >
                            {primary.label}
                          </Link>
                          <Link
                            to={overview.to}
                            className={buttonStyles.ghost}
                            aria-label={overview.aria}
                            data-analytics-id={`how-step:${num}:overview`}
                          >
                            {overview.label}
                          </Link>
                        </div>
                      </div>
                      <StepIcon className="ml-auto h-5 w-5 text-teal-700/70 dark:text-teal-300/80" />
                    </div>
                  </Card>
                </div>
              </Reveal>
            </li>
          );
        })}
      </Stagger>
    </LandingSection>
  );
}
