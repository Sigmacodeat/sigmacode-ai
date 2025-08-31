// Statisches Rendering – alle Motion-Wrapper entfernt
import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import { ShieldCheck, KeyRound, FileSearch, Lock, Database } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { useTranslation } from 'react-i18next';
import LandingSection from '../components/LandingSection';
import Reveal from '../../motion/Reveal';
import Stagger from '../../motion/Stagger';

export default function SecuritySection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const features: { title: string; desc: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    {
      title: tt('marketing.landing.security.features.0.title', 'RBAC & granulare Berechtigungen'),
      desc: tt(
        'marketing.landing.security.features.0.desc',
        'Rollenbasiertes Zugriffsmodell mit feingranularen Scopes, Projects/Workspaces und Attribut-basierten Regeln.'
      ),
      Icon: ShieldCheck,
    },
    {
      title: tt('marketing.landing.security.features.1.title', 'Audit‑Logs & Nachvollziehbarkeit'),
      desc: tt(
        'marketing.landing.security.features.1.desc',
        'Lückenlose Ereignis‑Protokollierung mit Export, Retention‑Policies und Integritätsprüfungen (Hash‑Chains).'
      ),
      Icon: FileSearch,
    },
    {
      title: tt('marketing.landing.security.features.2.title', 'Sicheres Secret‑Handling'),
      desc: tt(
        'marketing.landing.security.features.2.desc',
        'End‑to‑End‑Verschlüsselung ruhender Secrets, Just‑in‑Time Entschlüsselung, Rotation & Bring‑Your‑Own‑KMS.'
      ),
      Icon: KeyRound,
    },
    {
      title: tt('marketing.landing.security.features.3.title', 'DSGVO & Datenhoheit'),
      desc: tt(
        'marketing.landing.security.features.3.desc',
        'On‑Prem/Hybrid‑Deployment, regionale Datenhaltung, Löschkonzepte, Auftragsverarbeitung & TOMs.'
      ),
      Icon: Database,
    },
  ];
  return (
    <LandingSection id="security" className="-mt-px">
      {/* subtle green aura */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto h-32 w-32 translate-y-6 rounded-full bg-emerald-400/5 blur-xl sm:h-48 sm:w-48" />
      </div>
      <Reveal as="div" variant="rise" delay={60}>
        <SectionHeader
          icon={ShieldCheck}
          badgeText={t('marketing.landing.sections.badges.security')}
          badgeAriaLabel={tt('marketing.landing.security.badge_aria', 'Sicherheits-Bereich')}
          title={tt('marketing.landing.security.title', 'Security & Compliance')}
        />
      </Reveal>
      <>
        <Stagger as="ul" gap={80} startDelay={80} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" role="list" data-analytics-id="security-features-grid">
          {features.map(({ title, desc, Icon }, i) => (
            <li key={title}>
              <Card className="text-sm" data-analytics-id="security-feature-card" data-idx={i} data-title={title}>
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/5 text-emerald-600 ring-1 ring-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/10"
                    aria-hidden="true"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{desc}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </Stagger>

            {/* Hard security assurances */}
            <Stagger as="ul" gap={70} startDelay={120} className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" role="list" data-analytics-id="security-assurances-grid">
              {[ 
                {
                  Icon: Lock,
                  title: tt('marketing.landing.security.hardening.title', 'State‑of‑the‑Art Verschlüsselung'),
                  desc: tt(
                    'marketing.landing.security.hardening.desc',
                    'TLS 1.3, At‑Rest AES‑256, optionale HSM/KMS‑Integration, Secrets nur im RAM, Zero‑Trust‑Prinzipien.'
                  ),
                },
                {
                  Icon: FileSearch,
                  title: tt('marketing.landing.security.audit.title', 'Compliance & Nachweise'),
                  desc: tt(
                    'marketing.landing.security.audit.desc',
                    'Exportierbare Audit‑Logs, Revisionssichere Speicherung, Prüfbarkeit für interne/externe Audits.'
                  ),
                },
                {
                  Icon: Database,
                  title: tt('marketing.landing.security.data.title', 'Datenhoheit & Souveränität'),
                  desc: tt(
                    'marketing.landing.security.data.desc',
                    'Regionale Speicherung, Lösch‑Workflows, BYO‑Infra (On‑Prem/Hybrid/Private Cloud) für Enterprise.'
                  ),
                },
              ].map(({ Icon, title, desc }, i) => (
                <li key={title}>
                  <Card className="flex items-center gap-3" data-analytics-id="security-assurance-card" data-idx={i} data-title={title}>
                    <span aria-hidden="true">
                      <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{desc}</div>
                    </div>
                  </Card>
                </li>
              ))}
            </Stagger>

            {/* Compliance chips */}
            <Stagger as="div" gap={60} startDelay={160} className="mt-6 flex flex-wrap items-center gap-2" data-analytics-id="security-compliance-chips">
              <Badge variant="outline" tone="teal" ariaLabel={tt('marketing.landing.security.compliance.iso', 'ISO 27001 (in Arbeit)')}>ISO 27001</Badge>
              <Badge variant="outline" tone="teal" ariaLabel={tt('marketing.landing.security.compliance.soc2', 'SOC 2 (Best Practices)')}>SOC 2</Badge>
              <Badge variant="outline" tone="teal" ariaLabel={tt('marketing.landing.security.compliance.gdpr', 'GDPR/DSGVO Ready')}>GDPR/DSGVO</Badge>
              <Badge variant="outline" tone="teal" ariaLabel={tt('marketing.landing.security.compliance.encryption', 'TLS 1.3 / AES‑256')}>TLS 1.3 / AES‑256</Badge>
            </Stagger>
        </>
    </LandingSection>
  );
}

