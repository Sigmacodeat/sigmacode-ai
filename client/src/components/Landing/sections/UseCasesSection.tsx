import { useRef } from 'react';
import Card from '../components/Card';
import SectionHeader from '../../marketing/SectionHeader';
import { LineChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LandingSection from '../components/LandingSection';

export default function UseCasesSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  const listRef = useRef<HTMLUListElement | null>(null);
  // Defaults (Fallback)
  const defaultItems = [
    { title: tt('marketing.landing.useCases.items.support.title', 'Support-Automatisierung'), desc: tt('marketing.landing.useCases.items.support.desc', 'Reduziere Tickets durch intelligente Self-Service-Agenten.') },
    { title: tt('marketing.landing.useCases.items.devAssist.title', 'Entwickler-Assistenz'), desc: tt('marketing.landing.useCases.items.devAssist.desc', 'Code-Analyse, PR-Hinweise, Doku-Generierung.') },
    { title: tt('marketing.landing.useCases.items.dataQuery.title', 'Datenabfragen'), desc: tt('marketing.landing.useCases.items.dataQuery.desc', 'Natürliche Sprache zu SQL/GraphQL – sicher und nachvollziehbar.') },
  ];
  // i18n ReturnObjects unterstützen
  const rawCases = t('marketing.landing.useCases.items', { returnObjects: true, defaultValue: defaultItems }) as unknown;
  const cases = Array.isArray(rawCases)
    ? rawCases.map((c, i) => {
        if (c && typeof c === 'object') {
          const o = c as Record<string, unknown>;
          const title = typeof o.title === 'string' ? o.title : defaultItems[i]?.title || `Case ${i + 1}`;
          const desc = typeof o.desc === 'string' ? o.desc : defaultItems[i]?.desc || '';
          return { title, desc };
        }
        if (typeof c === 'string') return { title: c, desc: '' };
        return defaultItems[i] || { title: `Case ${i + 1}`, desc: '' };
      })
    : defaultItems;
  return (
    <LandingSection id="use-cases" className="-mt-px">
        <SectionHeader
          icon={LineChart}
          badgeText={tt('marketing.landing.useCases.badge', 'Use-Cases')}
          id="use-cases-heading"
          title={tt('marketing.landing.useCases.title', 'Use-Cases')}
        />
        <ul ref={listRef} className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3" role="list" data-analytics-id="usecases-grid">
          {cases.map((c, i) => (
            <li key={c.title}>
              <div>
                <Card title={c.title} data-analytics-id="usecase-card" data-idx={i} data-title={c.title}>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{c.desc}</p>
                </Card>
              </div>
            </li>
          ))}
        </ul>
    </LandingSection>
  );
}
