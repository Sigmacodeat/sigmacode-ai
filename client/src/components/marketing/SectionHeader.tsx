import type { ComponentType, ReactNode, ElementType } from 'react';
import SectionBadge from './SectionBadge';
import type { BadgeVariant } from '../ui/Badge';

interface SectionHeaderProps {
  // Badge
  icon?: ComponentType<{ className?: string }>;
  badgeText: string;
  badgeVariant?: BadgeVariant;
  badgeTone?: 'neutral' | 'indigo' | 'success' | 'warning' | 'danger' | 'teal' | 'amber' | 'violet' | 'pink';
  badgeSize?: 'sm' | 'md' | 'lg';
  badgeClassName?: string;
  badgeAriaLabel?: string;
  /** Optional: Badge-Animation beim Scrollen aktivieren/deaktivieren (Default: true) */
  badgeAnimateOnView?: boolean;
  /** Optional: Anteil des Badges, der sichtbar sein muss (0..1), bevor animiert wird (Default: 0.55) */
  badgeInViewAmount?: number;
  /** Startverzögerung für die Badge-Animation (Sekunden) */
  badgeStartDelaySec?: number;
  /** Dauer der Farbtransition (grau -> farbe) (Sekunden) */
  badgeColorDurationSec?: number;
  /** Zeitabstand zwischen farbfertigem Badge und Content-Reveal (Sekunden) */
  contentLagSec?: number;
  /** Callback, sobald Badge-Completion (+Lag) erreicht ist und Content erscheinen darf */
  onReady?: () => void;

  // Headline
  title: string;
  /** Optional id für Ankerlinks & aria-labelledby */
  id?: string;
  /** Semantische Überschriftenebene (SEO/A11y), Standard: h2 */
  as?: ElementType;
  titleClassName?: string;

  // Optional Subtext
  subtitle?: ReactNode;
  subtitleClassName?: string;

  // Timing
  baseDelay?: number; // start time for headline relative to badge (default 0.12s)
}

/**
 * SectionHeader: Vereinheitlicht Badge + Titel (+ optional Subtext) für Landing Sections.
 * - Badge: nutzt SectionBadge mit on‑view animation (grau -> farbe)
 * - Headline: erscheint kurz nach dem Badge mit inViewProps
 * - Subtitle: optional, minimal später
 */
export default function SectionHeader({
  icon,
  badgeText,
  badgeVariant = 'glass',
  badgeTone = 'teal',
  badgeSize = 'md',
  badgeClassName = 'h-8 py-0',
  badgeAriaLabel,
  badgeAnimateOnView = true,
  badgeInViewAmount,
  badgeStartDelaySec = 0,
  badgeColorDurationSec = 2.0,
  contentLagSec = 0.5,
  onReady,
  title,
  id,
  as,
  titleClassName = 'text-2xl font-semibold text-gray-900 dark:text-white',
  subtitle,
  subtitleClassName = 'mt-2 text-gray-600 dark:text-gray-300',
  baseDelay = 0.12,
}: SectionHeaderProps) {
  const Heading: ElementType = as ?? 'h2';
  const headingId = id ?? undefined;

  return (
    <div aria-labelledby={headingId}>
      <SectionBadge
        icon={icon}
        variant={badgeVariant}
        tone={badgeTone}
        size={badgeSize}
        className={badgeClassName}
        ariaLabel={badgeAriaLabel ?? badgeText}
        animateOnView={badgeAnimateOnView}
        inViewAmount={badgeInViewAmount}
        startDelaySec={badgeStartDelaySec}
        colorDurationSec={badgeColorDurationSec}
        onColorComplete={() => {
          if (!onReady) return;
          const lag = Math.max(0, contentLagSec ?? 0) * 1000;
          if (lag === 0) {
            onReady();
          } else {
            window.setTimeout(onReady, lag);
          }
        }}
      >
        {badgeText}
      </SectionBadge>
      <Heading id={headingId} className={titleClassName}>
        {title}
      </Heading>
      {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
    </div>
  );
}
