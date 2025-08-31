import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UNIFIED_ICON_SET } from '../shared/VisualUtils';
import UnifiedOrbit from '../shared/UnifiedOrbit';
import AgentAvatar from '../shared/AgentAvatar';

export type HeroAgentSceneProps = {
  // messages prop kept for backward-compatibility but not used anymore
  messages?: string[];
  // instant: pause all orbits/animations (reduced motion or skip-intro)
  instant?: boolean;
};

export default function HeroAgentScene({ messages = [], instant = false }: HeroAgentSceneProps) {
  // messages intentionally unused — scene focuses on premium icon orbits + bot core

  // Use unified icon set slices to keep consistency across sections
  const iconsA = UNIFIED_ICON_SET.slice(0, 6);
  const iconsB = UNIFIED_ICON_SET.slice(6, 11);
  const iconsC = UNIFIED_ICON_SET.slice(11, 15);
  // Statisch: keine Parallax-/Speed-/Paused-Logik mehr
  const [speedFactor] = useState<number>(1);
  // Pause alle Bewegungen bei instant (Reduced Motion / Skip Intro)
  const paused = !!instant;
  // Orchestrierung: Orbits starten genau NACH der Login-Augen-Animation
  const [playOrbits, setPlayOrbits] = useState<boolean>(!!instant);

  // Tone-dependent accents removed; scene uses unified icon tokens and neutral glows.

  // Measure container to keep orbits within viewport (column bounds)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setSize({ w: cr.width, h: cr.height });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Keine Sichtbarkeits-/Pause-Logik erforderlich

  // Compute radii based on the smaller side of the container
  const { rOuter, rMid, rInner } = useMemo(() => {
    const minSide = Math.max(0, Math.min(size.w || 0, size.h || 0));
    // Fallback if not measured yet
    const fallback = 320; // px
    const base = minSide > 0 ? minSide : fallback;
    // Leave a small margin to avoid touching edges
    const margin = 12;
    const maxRadius = Math.max(0, base / 2 - margin);
    // Layer ratios tuned to maintain aesthetics and avoid overlap
    const rOuter = Math.floor(maxRadius * 0.92);
    const rMid = Math.floor(maxRadius * 0.72);
    const rInner = Math.floor(maxRadius * 0.48);
    return { rOuter, rMid, rInner };
  }, [size.w, size.h]);

  // Dynamische Skalierung der Orbit-Elementgrößen je nach verfügbarem Platz (Mobile kompakter)
  const scale = useMemo(() => {
    const baseW = Math.max(1, size.w || 320);
    // Clampen: sehr schmal -> 0.75, normal -> 1.0
    return Math.min(1, Math.max(0.7, baseW / 420));
  }, [size.w]);

  // Sicherheits-Padding für den äußersten Orbit, damit Icons/Glows nie am Rand abgeschnitten werden
  // berücksichtigt: Icon-Container, Halo und subtile Bob/Suction-Bewegung
  const outerSafePad = useMemo(() => {
    // Exakte Geometrie: größter Glow-Durchmesser im äußeren Orbit (glowVariant "medium")
    // maxHalo = iconPx + haloAdd(strong/medium/soft) + extraRadialGlow(18)
    const iconPx = 20 * scale; // für äußeren Orbit gesetzt
    const haloAdd = 18; // medium
    const maxRadial = 18; // zusätzliche Radial-Glow-Schicht
    const largestDiameter = iconPx + haloAdd + maxRadial; // px
    const halfLargest = largestDiameter * 0.5; // vom Icon-Zentrum nach außen
    const margin = 6; // kleiner Puffer gegen Bobbing/Unschärfe
    return Math.round(halfLargest + margin);
  }, [scale]);

  // Größe der Glas-Scheibe (Glasmorphism) in der Mitte – bewusst kleiner als der Durchmesser des inneren Orbits
  const glassSize = useMemo(() => {
    // ca. 60% des inneren Orbit-Durchmessers, gedeckelt für XS-Devices
    const diameter = Math.max(120, Math.round(rInner * 1.2));
    return diameter;
  }, [rInner]);

  // Kein Parallax mehr
  const parallax = { x: 0, y: 0 };

  // Keine Maus-/Parallax-Events mehr

  return (
    <div ref={containerRef} className="relative w-full aspect-[1/1] sm:aspect-[4/3] md:aspect-[5/4] overflow-hidden">
      <div className="relative grid h-full place-items-center">
        {/* Orbits with depth occlusion: far outer -> outer -> glass disc -> inner */}
        {/* Waves entfernt – statisch */}
        <UnifiedOrbit
          preset="hero"
          icons={iconsC}
          radius={Math.max(0, rOuter - outerSafePad)}
          duration={96}
          direction={1}
          phaseOffsetDeg={31}
          glowVariant="medium"
          itemSize={Math.round(44 * scale)}
          iconPx={Math.round(20 * scale)}
          iconSpinAlternate
          iconSpinDuration={34}
          parallaxOffset={parallax}
          parallaxScale={14}
          driftDeg={playOrbits ? 7 : 0}
          driftDuration={playOrbits ? 20 : 0}
          speedFactor={speedFactor * 1.1}
          rotate={playOrbits}
          paused={paused}
        />
        <UnifiedOrbit
          preset="hero"
          icons={iconsB}
          radius={rMid}
          duration={84}
          direction={-1}
          phaseOffsetDeg={14}
          glowVariant="soft"
          dashedAccent={false}
          itemSize={Math.round(46 * scale)}
          iconPx={Math.round(22 * scale)}
          iconSpinAlternate
          iconSpinDuration={38}
          parallaxOffset={parallax}
          parallaxScale={10}
          driftDeg={playOrbits ? 6 : 0}
          driftDuration={playOrbits ? 24 : 0}
          speedFactor={speedFactor * 1.0}
          rotate={playOrbits}
          paused={paused}
        />

        {/* Zentrale Glass-Disc entfernt; nur Login-Agent bleibt in der Mitte, Orbits unverändert */}

        <UnifiedOrbit
          preset="hero"
          icons={iconsA}
          radius={rInner}
          duration={64}
          direction={-1}
          phaseOffsetDeg={0}
          glowVariant="soft"
          itemSize={Math.round(38 * scale)}
          iconPx={Math.round(18 * scale)}
          dashedAccent={false}
          counterDashedAbove={false}
          iconSpinAlternate
          iconSpinDuration={28}
          parallaxOffset={parallax}
          parallaxScale={10}
          driftDeg={playOrbits ? 4 : 0}
          driftDuration={playOrbits ? 16 : 0}
          speedFactor={speedFactor * 0.95}
          rotate={playOrbits}
          paused={paused}
        />

        {/* Einheitlicher zentraler Agent (Login-Variante) – Orbits starten via onReady */}
        <div className="z-30">
          <AgentAvatar size={80} variant="login" instant={instant} onReady={() => setPlayOrbits(true)} />
        </div>
      </div>
    </div>
  );
}
