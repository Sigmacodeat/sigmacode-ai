// Statisches Orbit-Layer – ohne Framer Motion
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

type Props = {
  icons: LucideIcon[];
  radius: number;
  duration?: number; // seconds for full rotation
  direction?: 1 | -1;
  className?: string;
  phaseOffsetDeg?: number; // additional angle offset to stagger between orbits
  glowVariant?: 'strong' | 'medium' | 'soft'; // controls glow/blur intensity
  itemSize?: number; // px size for icon container (width/height)
  iconPx?: number; // px size for the icon itself
  dashedAccent?: boolean; // render dashed ring accent
  counterDashedAbove?: boolean; // render counter-rotating dashed ring above
  iconSpinAlternate?: boolean; // alternate spin direction per icon
  iconSpinDuration?: number; // seconds for a full self-rotation
  iconSpinMode?: 'none' | 'random' | 'alternate' | 'every3';
  iconSpinRatio?: number; // 0..1 for random reverse chance
  // new: subtle parallax translation and slow rotation drift of the whole orbit
  parallaxOffset?: { x: number; y: number };
  parallaxScale?: number; // multiply incoming offset
  driftDeg?: number; // peak drift rotation in degrees (±)
  driftDuration?: number; // seconds for one back-and-forth drift cycle
  // control global speed multiplier (e.g., hover to accelerate slightly)
  speedFactor?: number; // 1 = normal, >1 faster, <1 slower
  // optional: allow icons to use a per-item radius within a band instead of a single fixed radius
  minRadius?: number;
  maxRadius?: number;
  // optional: draw subtle connection lines from center to each icon
  drawConnections?: boolean;
  // when true, use curved Bezier paths instead of straight lines
  drawConnectionsCurve?: boolean;
  // controls inward suction amplitude (px). Set 0 for exact circle alignment.
  suctionPx?: number;
  // control initial spring delays for icon placement (for phase sync)
  enterDelayBase?: number;
  enterDelayStep?: number;
  // when false, disables the internal continuous rotation (use external wrapper instead)
  rotate?: boolean;
  // when true, disables bobbing/suction so icons stay exactly on the circle
  lockOnCircle?: boolean;
  // pause all continuous animations (e.g., when tab is hidden)
  paused?: boolean;
  // when false, hides static white orbit rings/accent (keeps only icon glows)
  showOrbitRings?: boolean;
};

export default function OrbitLayer({ icons, radius, duration = 56, direction = 1, className, phaseOffsetDeg = 0, glowVariant = 'medium', itemSize = 48, iconPx = 24, dashedAccent = false, counterDashedAbove = false, iconSpinAlternate = true, iconSpinDuration = 36, iconSpinMode = 'random', iconSpinRatio = 0.45, parallaxOffset, parallaxScale = 0, driftDeg = 0, driftDuration = 24, speedFactor = 1, minRadius, maxRadius, drawConnections = false, drawConnectionsCurve = false, suctionPx = 10, enterDelayBase = 0.2, enterDelayStep = 0.08, rotate = true, lockOnCircle = false, paused = false, showOrbitRings = true }: Props) {
  // CSS Animationen werden über Utility-Klassen und Variablen gesteuert

  // stable pseudo-random in [0,1) based on index + phaseOffsetDeg (keeps distribution consistent across renders)
  const rand01 = (n: number) => {
    const x = Math.sin(n * 12.9898 + phaseOffsetDeg * 0.104729) * 43758.5453;
    return x - Math.floor(x);
  };

  // Icon-Farben an Hero-Verlauf (teal/cyan) anlehnen
  const iconColorClass = glowVariant === 'strong'
    ? 'text-teal-400 dark:text-teal-300'
    : glowVariant === 'medium'
    ? 'text-teal-300 dark:text-teal-200'
    : 'text-teal-200 dark:text-teal-100';

  // variant-aware subtle background halo parameters (disabled for hero section to minimize glow)
  const haloAdd = 0; // disabled
  const haloBlur = 0; // disabled
  const haloOpacity = 0; // disabled
  const haloWhiteOpacity = 0; // disabled

  const orbitPlay = paused ? 'paused' as const : 'running' as const;
  const orbitDirection = direction === -1 ? 'reverse' : 'normal';

  // helper to pick per-icon spin direction based on mode
  const iconSpinDirFor = (i: number): 'normal' | 'reverse' => {
    if (!iconSpinAlternate && iconSpinMode === 'random' && iconSpinRatio <= 0) return 'normal';
    switch (iconSpinMode) {
      case 'alternate':
        return (i % 2 === 0) ? 'normal' : 'reverse';
      case 'every3':
        return (i % 3 === 0) ? 'reverse' : 'normal';
      case 'random':
      default:
        return rand01(i + 777) < iconSpinRatio ? 'reverse' : 'normal';
    }
  };

  const speedAdjustedDuration = duration / Math.max(speedFactor || 1, 0.001);

  const driftStyle: CSSProperties & Record<string, string> = {
    '--orbit-play': orbitPlay,
    '--drift-duration': `${driftDuration}s`,
    '--drift-deg': `${driftDeg}deg`,
    willChange: 'transform',
  } as unknown as CSSProperties & Record<string, string>;

  const rotateStyle: CSSProperties & Record<string, string> = {
    '--orbit-duration': `${speedAdjustedDuration}s`,
    '--orbit-direction': orbitDirection,
    willChange: 'transform',
  } as unknown as CSSProperties & Record<string, string>;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        width: radius * 2,
        height: radius * 2,
        left: `calc(50% - ${radius}px)`,
        top: `calc(50% - ${radius}px)`,
      }}
      aria-hidden
    >
      {/* drift wrapper (optional) */}
      <div
        className={driftDeg ? 'absolute inset-0 orbit-drift' : 'absolute inset-0'}
        style={driftStyle}
      >
        {/* static phase offset wrapper to stagger between orbits */}
        <div className="absolute inset-0" style={{ transform: `rotate(${phaseOffsetDeg}deg)` }}>
          {/* rotate wrapper (continuous) */}
          <div
            className={`absolute inset-0 ${rotate ? 'orbit-rotate' : ''} ${className ?? ''}`}
            style={rotateStyle}
          >
        {/* connection lines layer (below icons) */}
        {drawConnections && icons.length > 0 && (
          <svg className="absolute inset-0" viewBox="-50 -50 100 100" aria-hidden>
            {icons.map((_, i) => {
              const angle = (i / icons.length) * 360 + phaseOffsetDeg;
              const rBand = (typeof minRadius === 'number' && typeof maxRadius === 'number' && maxRadius > minRadius)
                ? (minRadius + rand01(i + 101) * (maxRadius - minRadius))
                : radius;
              // normalize to viewBox [-50,50]
              const rad = (rBand / radius) * 50;
              const a = (angle * Math.PI) / 180;
              const x = rad * Math.cos(a);
              const y = rad * Math.sin(a);
              const dash = 5 + (i % 4) * 1.5;
              const widthMin = 0.8;
              const widthMax = 1.6;
              const strokeCol = 'rgba(56, 189, 248, 0.5)';
              const glowCol = 'rgba(56, 189, 248, 0.22)';
              if (!drawConnectionsCurve) {
                return (
                  <g key={`sv-${i}`}>
                    <line x1={0} y1={0} x2={x} y2={y} stroke={glowCol} strokeWidth={widthMax + 0.6} strokeLinecap="round" strokeDasharray={`${dash} ${dash * 2}`} />
                    <line x1={0} y1={0} x2={x} y2={y} stroke={strokeCol} strokeLinecap="round" strokeDasharray={`${dash} ${dash * 2}`} strokeWidth={widthMin} />
                    <circle cx={x} cy={y} r={1.6} fill="rgba(56,189,248,0.85)" />
                  </g>
                );
              }
              // Curved connection: quadratic Bezier with slight perpendicular bend
              const bend = 0.06 + rand01(i) * 0.04; // much lighter curvature
              const nx = x / Math.hypot(x, y || 1);
              const ny = y / Math.hypot(x, y || 1);
              // perpendicular vector for control point
              const px = -ny;
              const py = nx;
              const cx = (x * 0.5) + px * rad * bend;
              const cy = (y * 0.5) + py * rad * bend;
              const d = `M 0 0 Q ${cx} ${cy} ${x} ${y}`;
              return (
                <g key={`cv-${i}`}>
                  <path d={d} fill="none" stroke={glowCol} strokeWidth={widthMax + 0.7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${dash} ${dash * 2}`} />
                  <path d={d} fill="none" stroke={strokeCol} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${dash} ${dash * 2}`} />
                  <circle cx={x} cy={y} r={1.6} fill="rgba(56,189,248,0.85)" />
                </g>
              );
            })}
          </svg>
        )}
        {/* orbit rings & accents can be hidden to avoid white circles in background */}
        {showOrbitRings && (
          <>
            <div className="absolute inset-0 rounded-full ring-1 ring-white/30 shadow-[0_0_36px_-6px_rgba(56,189,248,0.10)] dark:ring-white/10" />
            {glowVariant !== 'strong' && (
              <>
                {/* subtle orbit accent: dashed (SVG) or solid */}
                {dashedAccent ? (
                  <div className="absolute inset-7">
                    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
                      <circle
                        cx="50"
                        cy="50"
                        r="44.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        strokeDasharray="1.5 7"
                        strokeDashoffset="1"
                        className="text-white/30 dark:text-white/10"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="absolute inset-6 rounded-full ring-1 ring-white/15 dark:ring-white/10" />
                )}
                {/* optional counter-rotating dashed ring above */}
                {dashedAccent && counterDashedAbove && (
                  <div
                    className="absolute inset-2 orbit-rotate"
                    style={{
                      ...rotateStyle,
                      '--orbit-direction': orbitDirection === 'normal' ? 'reverse' : 'normal',
                    } as CSSProperties & Record<string, string>}
                  >
                    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
                      <circle
                        cx="50"
                        cy="50"
                        r="49"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        strokeDasharray="3 9"
                        strokeDashoffset="1.5"
                        className="text-white/30 dark:text-white/10"
                      />
                    </svg>
                  </div>
                )}
                {/* very light gradient with minimal blur (teal/cyan) */}
                <div className={`absolute -inset-1 rounded-full bg-gradient-to-br from-teal-400/0 via-sky-300/0 to-cyan-300/5 ${'blur-[2px]'}`} />
              </>
            )}
          </>
        )}
        {icons.map((I, i) => {
          const angle = (i / icons.length) * 360 + phaseOffsetDeg;
          // choose local radius within band if provided, otherwise use single radius
          const rBand = (typeof minRadius === 'number' && typeof maxRadius === 'number' && maxRadius > minRadius)
            ? (minRadius + rand01(i + 101) * (maxRadius - minRadius))
            : radius;
          const x = Math.cos((angle * Math.PI) / 180) * rBand;
          const y = Math.sin((angle * Math.PI) / 180) * rBand;
          const xR = Math.round(x);
          const yR = Math.round(y);
          const xPos = lockOnCircle ? x : xR;
          const yPos = lockOnCircle ? y : yR;
          const delay = (i * 0.25) % 1.5;
          const spinDir = iconSpinAlternate ? (i % 2 === 0 ? 'normal' : 'reverse') : iconSpinDirFor(i);
          const spinEnabled = iconSpinMode !== 'none' && (iconSpinDuration ?? 0) > 0;
          const durationJitter = iconSpinMode === 'random' ? (0.9 + 0.2 * rand01(i + 333)) : 1;
          const spinDuration = Math.max(4, (iconSpinDuration || 0) * durationJitter);
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: 'translateZ(0)', left: '50%', top: '50%', translate: `${xPos}px ${yPos}px` }}
            >
              <div className="relative">
                <div className="relative grid place-items-center" style={{ width: itemSize, height: itemSize }}>
                  {(() => {
                      // Bias the halo hue in Richtung Cyan/Teal (Hero-Verlauf)
                      const hue = 188 + rand01(i) * 10; // enger Bereich um Cyan/Teal
                      const core = `hsla(${hue}, 85%, 64%, ${haloOpacity})`;
                      const outer = `hsla(${hue + 6}, 92%, 86%, ${haloWhiteOpacity})`;
                      return (
                        <>
                          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: iconPx + haloAdd, height: iconPx + haloAdd, borderRadius: 9999, background: core, filter: `blur(${haloBlur}px)` }} />
                          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: iconPx + haloAdd + 8, height: iconPx + haloAdd + 8, borderRadius: 9999, background: outer, filter: `blur(${haloBlur + 4}px)` }} />
                          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2" style={{ width: iconPx + haloAdd + 18, height: iconPx + haloAdd + 18, borderRadius: 9999, background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)', filter: `blur(${haloBlur + 7}px)` }} />
                        </>
                      );
                    })()}
                    {spinEnabled ? (
                      <div
                        className="icon-spin"
                        style={{
                          '--icon-spin-duration': `${spinDuration}s`,
                          '--icon-spin-direction': spinDir,
                          '--orbit-play': orbitPlay,
                          willChange: 'transform',
                        } as CSSProperties & Record<string, string>}
                      >
                        <I aria-hidden className={`${iconColorClass} drop-shadow-[0_0_6px_rgba(56,189,248,0.20)]`} style={{ width: iconPx, height: iconPx }} strokeWidth={1.55} />
                      </div>
                    ) : (
                      <I aria-hidden className={`${iconColorClass} drop-shadow-[0_0_6px_rgba(56,189,248,0.20)]`} style={{ width: iconPx, height: iconPx }} strokeWidth={1.55} />
                    )}
                  </div>
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>
    </div>
  );
}
