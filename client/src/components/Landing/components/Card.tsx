import React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  variant?: 'glass' | 'plain' | 'solid' | 'outline' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
};

export default function Card({
  title,
  children,
  className = '',
  variant = 'glass',
  size = 'md',
  interactive = false,
  ...rest
}: CardProps) {
  // Varianten
  const baseGlass =
    'rounded-xl border border-white/20 bg-white/50 backdrop-blur-md shadow-[0_8px_32px_rgba(56,189,248,0.10)] dark:border-white/10 dark:bg-white/5';
  const basePlain = 'rounded-xl border border-gray-200 bg-transparent shadow-sm dark:border-gray-800 dark:bg-transparent';
  const baseSolid = 'rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900';
  const baseOutline = 'rounded-xl border border-gray-200 bg-transparent shadow-none dark:border-gray-800 dark:bg-transparent';
  const baseMuted = 'rounded-xl border border-transparent bg-gray-50 shadow-sm dark:bg-gray-800/60';

  const variantBase =
    variant === 'glass'
      ? baseGlass
      : variant === 'plain'
      ? basePlain
      : variant === 'solid'
      ? baseSolid
      : variant === 'outline'
      ? baseOutline
      : baseMuted;

  // Größen-Padding (Kompatibilität: md entspricht vorherigem p-6)
  const padding = size === 'sm' ? 'p-4' : size === 'lg' ? 'p-8' : 'p-6';

  // Interaktivität: einheitliche Hover-/Focus-Styles
  const interactiveStyles = interactive
    ? 'transition-all duration-300 ease-out hover:shadow-md hover:border-brand-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2'
    : '';

  const base = `${variantBase} ${padding} ${interactiveStyles}`;

  return (
    <div className={`${base} ${className}`} {...rest}>
      {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
      {children ? <div className={title ? 'mt-2' : ''}>{children}</div> : null}
    </div>
  );
}

