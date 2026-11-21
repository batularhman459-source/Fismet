"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqCategory {
  label: string;
  items: { q: string; a: string }[];
}

// Platzhalter-Antworten – bitte an eure echten Abläufe und Preise anpassen
export const DEFAULT_FAQ: FaqCategory[] = [
  {
    label: "Ablauf",
    items: [
      { q: "Wie läuft ein Projekt mit euch ab?", a: "Nach einem kurzen Kennenlernen erstellen wir ein Konzept und einen Design-Entwurf. Wenn ihr zufrieden seid, entwickeln wir die Seite, testen sie gründlich und bringen sie gemeinsam mit euch online." },
      { q: "Wie lange dauert es bis zur fertigen Website?", a: "Eine typische Unternehmensseite dauert etwa zwei bis vier Wochen. Größere Projekte wie Shops brauchen entsprechend länger. Den genauen Zeitplan legen wir am Anfang gemeinsam fest." },
      { q: "Was müssen wir vorbereiten?", a: "Ideal sind Logo, Texte und Bilder. Falls etwas fehlt, ist das kein Problem. Wir helfen bei Struktur und Texten und können passende Bilder vorschlagen." },
      { q: "Können wir während des Projekts noch Änderungen einbringen?", a: "Ja. Nach dem Design-Entwurf und vor dem Launch gibt es feste Feedback-Runden, in denen eure Wünsche einfließen." },
    ],
  },
  {
    label: "Kosten",
    items: [
      { q: "Was kostet eine Website?", a: "Das hängt vom Umfang ab: Anzahl der Seiten, Funktionen und Inhalte. Nach einem kurzen Gespräch bekommt ihr ein transparentes Festpreis-Angebot." },
      { q: "Gibt es laufende Kosten?", a: "Für Domain und Hosting fallen kleine monatliche Kosten an. Wartung und Updates bieten wir optional als Paket an." },
      { q: "Wie wird bezahlt?", a: "In der Regel in zwei Teilen: ein Teil zum Projektstart, der Rest zum Launch. Details stehen im Angebot." },
    ],
  },
  {
    label: "Technik",
    items: [
      { q: "Funktioniert die Seite auch auf dem Handy?", a: "Ja, jede Seite wird für Handy, Tablet und Desktop gebaut und auf allen Größen getestet." },
      { q: "Können wir Inhalte selbst ändern?", a: "Auf Wunsch richten wir euch eine einfache Möglichkeit ein, Texte und Bilder selbst zu pflegen, oder wir übernehmen das für euch." },
      { q: "Werden wir bei Google gefunden?", a: "Wir achten von Anfang an auf schnelle Ladezeiten, saubere Struktur und technisches SEO. Das ist die Grundlage für gute Platzierungen." },
      { q: "Kümmert ihr euch um Domain und Hosting?", a: "Ja, wenn ihr möchtet, richten wir Domain, Hosting und E-Mail-Adressen für euch ein." },
    ],
  },
  {
    label: "Betreuung",
    items: [
      { q: "Was passiert nach dem Launch?", a: "Wir bleiben euer Ansprechpartner. Kleine Anpassungen, Updates und Erweiterungen sind jederzeit möglich." },
      { q: "Bietet ihr Wartung an?", a: "Ja, optional mit regelmäßigen Updates, Backups und einem Blick auf Sicherheit und Ladezeit." },
      { q: "Könnt ihr eine bestehende Website übernehmen?", a: "In vielen Fällen ja. Wir schauen uns eure aktuelle Seite an und sagen euch ehrlich, ob ein Relaunch oder eine Überarbeitung sinnvoller ist." },
    ],
  },
];

export interface FaqTabsProps {
  eyebrow?: string;
  title?: string;
  categories?: FaqCategory[];
  id?: string;
  className?: string;
}

export function FaqTabs({
  eyebrow = "Gut zu wissen",
  title = "Häufige Fragen",
  categories = DEFAULT_FAQ,
  id,
  className,
}: FaqTabsProps) {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  const switchTab = (i: number) => {
    setTab(i);
    setOpen(null);
  };

  return (
    <section id={id} className={cn("relative px-4 py-24 sm:px-6 md:py-32", className)}>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-4 text-sm font-medium text-primary/55">{eyebrow}</p>
        <h2 className="text-4xl font-bold tracking-[-0.03em] text-primary sm:text-5xl md:text-6xl">{title}</h2>

        {/* Tabs */}
        <div role="tablist" aria-label="Kategorien" className="mt-8 flex flex-wrap justify-center gap-2 md:mt-10">
          {categories.map((c, i) => (
            <button
              key={c.label}
              role="tab"
              type="button"
              aria-selected={tab === i}
              onClick={() => switchTab(i)}
              className={cn(
                "rounded-lg border px-4 py-1.5 text-sm font-medium transition-all duration-300",
                tab === i
                  ? "border-transparent bg-gradient-to-b from-[#f2f1e6] to-[#b9b8a8] text-ink shadow-[0_1px_0_rgba(255,255,255,0.4)_inset]"
                  : "border-border text-primary/55 hover:border-primary/25 hover:text-primary",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fragen */}
      <div className="relative mx-auto mt-10 max-w-3xl md:mt-12">
        <AnimatePresence mode="wait">
          <motion.ul
            key={tab}
            role="tabpanel"
            className="flex flex-col gap-3"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
              exit: { opacity: 0, transition: { duration: 0.15 } },
            }}
          >
            {categories[tab].items.map((item, i) => {
              const isOpen = open === i;
              return (
                <motion.li
                  key={item.q}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className={cn(
                    "overflow-hidden rounded-xl border transition-colors duration-300",
                    isOpen ? "border-primary/15 bg-[#1a1a18]" : "border-border bg-[#141413] hover:bg-[#181816]",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className={cn("text-[15px] font-medium transition-colors", isOpen ? "text-primary" : "text-primary/65")}>
                      {item.q}
                    </span>
                    <Plus
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-300",
                        isOpen ? "rotate-45 text-primary" : "text-primary/45",
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-primary/55">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FaqTabs;
