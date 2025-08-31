import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Theme-Observer: erkennt Wechsel zwischen Light/Dark anhand der 'dark'-Klasse auf <html>
const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false,
  );
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-bold mb-6">{children}</h2>
);

const fadeIn = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };
const containerVar = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, when: 'beforeChildren' },
  },
};
const itemVar = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PitchDeck() {
  const isDark = useIsDarkMode();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sectionOrder = useMemo(
    () => [
      'Cover',
      'Problem',
      'Lösung',
      'Produkt',
      'Markt',
      'Wettbewerb',
      'GTM',
      'Traction',
      'Business',
      'Roadmap',
      'Kosten',
      'Risiken',
      'Team',
      'Kontakt',
      'Impact',
    ],
    [],
  );
  const [activeId, setActiveId] = useState<string>('Cover');

  const costData = useMemo(
    () => [
      { name: 'Personal', value: 700 },
      { name: 'Hardware', value: 300 },
      { name: 'Cloud & Pilot', value: 100 },
    ],
    []
  );

  // Recharts Theme-Farben je Modus
  const chartColors = useMemo(() => {
    const axisTick = isDark ? '#D1D5DB' : '#374151'; // gray-300 / gray-700
    const axisLine = isDark ? '#374151' : '#E5E7EB'; // gray-700 / gray-200
    const grid = isDark ? '#374151' : '#E5E7EB';
    const tooltipBg = isDark ? '#111827' : '#FFFFFF'; // gray-900 / white
    const tooltipText = isDark ? '#F9FAFB' : '#111827'; // gray-50 / gray-900
    const bar = isDark ? '#60A5FA' : '#3B82F6'; // blue-400 / blue-600
    return { axisTick, axisLine, grid, tooltipBg, tooltipText, bar };
  }, [isDark]);

  // SEO: via Helmet (deklarativ)
  const helmetTitle = 'Pitchdeck – SIGMACODE AI';
  const helmetOgTitle = 'SigmaCode AI Pitchdeck';
  const helmetDescription =
    'Humanoide Roboter as a Service: KI-OS, Skill-Store, RaaS – Marktstart EU. Investoren- und Förder-ready Pitchdeck.';
  const helmetUrl = typeof window !== 'undefined' ? window.location.href : 'https://sigmacode.ai/pitchdeck';
  const helmetImage = 'https://sigmacode.ai/og-image.png';

  useEffect(() => {
    // Scroll-Spy via IntersectionObserver
    const els = sectionOrder
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        // Wähle die Section mit größter Sichtbarkeit
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { threshold: [0.2, 0.6, 0.9] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionOrder]);

  const progressPct = useMemo(() => {
    const idx = Math.max(0, sectionOrder.indexOf(activeId));
    return Math.round(((idx + 1) / sectionOrder.length) * 100);
  }, [activeId, sectionOrder]);

  const handleExport = async () => {
    // Verbesserter PDF-Export: versuche html2pdf.js (optional), sonst Fallback print
    try {
      const el = rootRef.current ?? document.body;
      // dynamischer Import ohne statische Modulauflösung
      const mod = (await (Function('return import("html2pdf.js")')() as Promise<any>)) as any;
      const html2pdf = mod?.default ?? mod;
      if (html2pdf && el) {
        const opt = {
          margin: [10, 10, 14, 10],
          filename: 'SigmaCodeAI-Pitchdeck.pdf',
          image: { type: 'jpeg', quality: 0.96 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        } as any;
        await html2pdf().set(opt).from(el).save();
        return;
      }
    } catch {}
    window.print();
  };

  return (
    <div ref={rootRef} className="w-full h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 overflow-y-auto snap-y snap-mandatory print:bg-white">
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDescription} />
        <meta property="og:title" content={helmetOgTitle} />
        <meta property="og:description" content={helmetDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={helmetUrl} />
        <meta property="og:image" content={helmetImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={helmetOgTitle} />
        <meta name="twitter:description" content={helmetDescription} />
        <meta name="twitter:image" content={helmetImage} />
      </Helmet>
      <style>{`
        @media print {
          nav { display: none !important; }
          .print-section { page-break-before: always; break-before: page; }
          .print-section:first-of-type { page-break-before: avoid; break-before: auto; }
          .snap-start { height: auto !important; min-height: auto !important; }
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      {/* Top-Navigation */}
      <nav className="sticky top-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 flex items-center justify-between px-4 md:px-8 py-3 border-b border-gray-200 dark:border-gray-800 relative">
        <div className="flex items-center gap-6">
          {['Problem', 'Lösung', 'Produkt', 'Markt', 'Wettbewerb', 'GTM', 'Traction', 'Business', 'Roadmap', 'Kosten', 'Risiken', 'Team', 'Kontakt', 'Impact'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={[
                'hidden sm:inline text-sm font-medium transition-colors',
                activeId === item
                  ? 'text-blue-600'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600',
              ].join(' ')}
              aria-current={activeId === item ? 'true' : undefined}
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="#Cover" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600">Cover</a>
          <button onClick={handleExport} className="rounded-md bg-blue-600 text-white text-sm px-3 py-2 hover:bg-blue-700">
            Export als PDF
          </button>
        </div>
        {/* Progress Bar */}
        <div className="absolute left-0 bottom-0 h-0.5 bg-blue-100 dark:bg-gray-700 w-full">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </nav>

      {/* Cover */}
      <section id="Cover" className="print-section snap-start h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.h1 initial={fadeIn.initial} animate={fadeIn.animate} transition={{ duration: 0.6 }} className="text-4xl font-bold text-blue-600 mb-4">
          SigmaCode AI
        </motion.h1>
        <p className="text-2xl">Humanoide Roboter as a Service – KI für Alltag & Pflege</p>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">„Roboter, die den Alltag erleichtern“</p>
      </section>

      {/* Problem */}
      <section id="Problem" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Problem & Marktbedarf</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>Demografischer Wandel: 30 % der EU-Bevölkerung 65+ bis 2050</motion.li>
            <motion.li variants={itemVar}>Pflege- & Dienstleistungsmangel → steigender Fachkräftemangel</motion.li>
            <motion.li variants={itemVar}>Bisherige Roboterlösungen: teuer, nur für Großkunden, nicht alltagstauglich</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Lösung */}
      <section id="Lösung" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Unsere Lösung</SectionTitle>
          <ul className="space-y-3 text-lg">
            <motion.li variants={itemVar} className="flex items-center gap-2"><CheckCircle className="text-blue-500"/> KI-Betriebssystem für humanoide Roboter</motion.li>
            <motion.li variants={itemVar} className="flex items-center gap-2"><CheckCircle className="text-blue-500"/> Skill-Store (App-Store für Roboterfähigkeiten)</motion.li>
            <motion.li variants={itemVar} className="flex items-center gap-2"><CheckCircle className="text-blue-500"/> Robot-as-a-Service Modell</motion.li>
            <motion.li variants={itemVar} className="flex items-center gap-2"><CheckCircle className="text-blue-500"/> Use Cases: Pflege, Haushalt, Hotellerie, Logistik</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Produkt */}
      <section id="Produkt" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Produkt & USP</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Produkt</h3>
              <ul className="list-disc pl-6 space-y-1">
                <motion.li variants={itemVar}>KI-OS für humanoide Roboter mit Skill-Store</motion.li>
                <motion.li variants={itemVar}>Multimodale Wahrnehmung (Vision, Sprache, Sensorik)</motion.li>
                <motion.li variants={itemVar}>Edge + Cloud Hybrid, kontinuierliches Lernen</motion.li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">USP</h3>
              <ul className="list-disc pl-6 space-y-1">
                <motion.li variants={itemVar}>Alltagstauglichkeit & Sicherheit by Design</motion.li>
                <motion.li variants={itemVar}>Leistbares RaaS mit modularen Skills</motion.li>
                <motion.li variants={itemVar}>Schnelle Integration auf gängige Hardware</motion.li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Markt */}
      <section id="Markt" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Markt & Größe</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>SAM: Haushalte, Pflegeeinrichtungen, Hotels in EU</motion.li>
            <motion.li variants={itemVar}>Wachstum: +20% CAGR soziale/Service-Robotik</motion.li>
            <motion.li variants={itemVar}>Einstiegsmärkte: AT/DE Pflege & Hospitality</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Wettbewerb */}
      <section id="Wettbewerb" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Wettbewerb</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>Heute: Digit, Unitree, Optimus, Pepper – teuer/limitiert</motion.li>
            <motion.li variants={itemVar}>Unsere Differenzierung: Alltag, Preis, EU-Fokus, Skills</motion.li>
            <motion.li variants={itemVar}>Partnerschaften statt Eigen-Hardware</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Technik */}
      <section id="Technik" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Technisches Konzept</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>KI-Kern: Sprachmodell + Entscheidungs-Engine</motion.li>
            <motion.li variants={itemVar}>Sensorik: Kamera, LiDAR, Audio → multimodal</motion.li>
            <motion.li variants={itemVar}>Skill-Store: Cloud-basiert, jederzeit erweiterbar</motion.li>
            <motion.li variants={itemVar}>Hardware: Integration auf bestehende humanoide Plattformen (Tesla, Unitree, Neura)</motion.li>
            <motion.li variants={itemVar}>TRL 4 → 7 (Simulation → Prototyp → Pilotkunde)</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Business */}
      <section id="Business" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Geschäftsmodell (RaaS)</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>Abo-Modell: 1.500–2.500 €/Monat pro Roboter</motion.li>
            <motion.li variants={itemVar}>Inklusive: Wartung, Updates, Support</motion.li>
            <motion.li variants={itemVar}>Pay-per-Skill: Zusatzmodule buchbar</motion.li>
            <motion.li variants={itemVar}>Kundensegmente: Haushalte, Pflegeeinrichtungen, Hotels, KMU</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* GTM */}
      <section id="GTM" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Go-To-Market</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>Pilotkunden in Pflege & Hotels, Referenzen aufbauen</motion.li>
            <motion.li variants={itemVar}>Direktvertrieb + Partner (Systemintegratoren)</motion.li>
            <motion.li variants={itemVar}>Pricing/Packaging-Experimente, Skill-Bundles</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Traction */}
      <section id="Traction" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Traction & Validierung</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>LoIs/Interessenbekundungen (Pflege, Hospitality)</motion.li>
            <motion.li variants={itemVar}>Technik-Demos/Prototypen, Feldtests geplant</motion.li>
            <motion.li variants={itemVar}>Advisory/Partnerschaften in Aufbau</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Roadmap */}
      <section id="Roadmap" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Roadmap & Meilensteine</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>2025–2026: Softwareprototyp + Integration</motion.li>
            <motion.li variants={itemVar}>2026–2027: Pilotprojekte (Pflegeheim, Hotel, Haushalt)</motion.li>
            <motion.li variants={itemVar}>2027+: Marktstart Robot-as-a-Service (Österreich/EU)</motion.li>
            <motion.li variants={itemVar}>2028+: Skalierung international</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Kosten */}
      <section id="Kosten" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Kostenstruktur (2 Jahre)</SectionTitle>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <XAxis dataKey="name" stroke={chartColors.axisLine} tick={{ fill: chartColors.axisTick }} />
                <YAxis stroke={chartColors.axisLine} tick={{ fill: chartColors.axisTick }} />
                <Tooltip
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                  contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.axisLine, color: chartColors.tooltipText }}
                  labelStyle={{ color: chartColors.tooltipText }}
                  itemStyle={{ color: chartColors.tooltipText }}
                />
                <Bar dataKey="value" fill={chartColors.bar} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Gesamtvolumen: ~1,1 Mio. €</p>
        </motion.div>
      </section>

      {/* Risiken */}
      <section id="Risiken" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Risiken & Mitigation</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>Hardware-Abhängigkeit → Multi-Vendor-Strategie</motion.li>
            <motion.li variants={itemVar}>Sicherheit/Haftung → Safety-Layer, Zulassungen</motion.li>
            <motion.li variants={itemVar}>Akzeptanz → UX-Design, Piloten, kontinuierliches Feedback</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Team */}
      <section id="Team" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Team & Rollen</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>KI/Robotik, Produkt, Partnerschaften, Regulierung</motion.li>
            <motion.li variants={itemVar}>Advisors: Pflege, HRI, Sicherheit</motion.li>
            <motion.li variants={itemVar}>Hiring-Plan: Core-Engineering, Field Ops</motion.li>
          </ul>
        </motion.div>
      </section>

      {/* Kontakt */}
      <section id="Kontakt" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Kontakt</SectionTitle>
          <p className="text-lg text-gray-700 dark:text-gray-300">Kontaktieren Sie uns für Demos, Piloten und Partnerschaften.</p>
          <ul className="mt-4">
            <li className="text-blue-600">hello@sigmacode.ai</li>
          </ul>
        </motion.div>
      </section>

      {/* Impact */}
      <section id="Impact" className="print-section snap-start h-screen flex flex-col justify-center px-6 md:px-12">
        <motion.div variants={containerVar} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <SectionTitle>Impact</SectionTitle>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <motion.li variants={itemVar}>Wirtschaftlich: Wertschöpfung & neue High-Tech-Jobs in Österreich</motion.li>
            <motion.li variants={itemVar}>Gesellschaftlich: Entlastung Pflege, Selbstständigkeit für Senioren</motion.li>
            <motion.li variants={itemVar}>Ökologisch: RaaS = Kreislauf, effizientere Ressourcennutzung</motion.li>
            <motion.li variants={itemVar}>Wissenschaftlich: Europäischer Beitrag zu KI & Robotik</motion.li>
          </ul>
        </motion.div>
      </section>
    </div>
  );
}
