import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../../marketing/SectionHeader';
import LandingSection from '../components/LandingSection';
import { buttonStyles, buttonSizeXs } from '../../ui/Button';

export default function WhatAreAgentsSection() {
  const { t } = useTranslation();
  const tt = t as unknown as (key: string, defaultValue?: string, options?: Record<string, unknown>) => string;
  return (
    <LandingSection id="what-are-agents" noBorder className="-mt-px">
        <SectionHeader
          icon={HelpCircle}
          badgeText={tt('marketing.landing.sections.badges.context')}
          id="what-are-agents-heading"
          title={tt('marketing.landing.whatAreAgents.title', 'Was sind AI Agents?')}
          subtitle={tt(
            'marketing.landing.whatAreAgents.description',
            'AI Agents sind spezialisierte Assistenten, die mit Tools (z. B. RAG, OCR, Actions, MCP, Code Interpreter), Dateien und klaren Policies eigenständig Aufgaben ausführen – weit über klassisches Prompting hinaus. Orchestriere mehrere Agents zu Ketten (Mixture‑of‑Agents) und beschleunige Workflows messbar.'
          )}
          subtitleClassName="mt-2 max-w-3xl text-sm text-gray-700 dark:text-gray-300"
          titleClassName="text-2xl md:text-3xl"
        />
        <div className="mt-6" data-analytics-id="what-are-agents-cta">
          <Link
            to="/ai-agents"
            className={`${buttonStyles.secondary} ${buttonSizeXs.secondary}`}
            data-analytics-id="link-ai-agents"
            data-title={tt('marketing.landing.whatAreAgents.cta', 'Mehr über AI Agents')}
          >
            {tt('marketing.landing.whatAreAgents.cta', 'Mehr über AI Agents')}
          </Link>
        </div>
    </LandingSection>
  );
}
