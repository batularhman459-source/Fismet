"use client";

import { motion } from "motion/react";
import { Mail, MapPin, Phone, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import OnboardingForm from "@/components/ui/multistep-form";
import { RollingTextList } from "@/components/ui/rolling-list";
import { setScrollLocked } from "@/lib/scroll-lock";

// ---------------------------------------------------------------------------
// Platzhalter-Daten – hier zentral anpassen
// ---------------------------------------------------------------------------

export const CONTACT = {
  email: "hallo@fismet.de",
  phone: "+49 000 000000",
  location: "Stadt, Deutschland",
  instagram: "#",
};

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ title, muted }: { title: string; muted?: string }) {
  return (
    <Reveal className="mb-14 md:mb-20">
      <h2 className="max-w-5xl text-4xl font-medium leading-[0.95] tracking-[-0.045em] text-primary sm:text-6xl">
        {title}
        {muted ? <span className="block text-primary/35">{muted}</span> : null}
      </h2>
    </Reveal>
  );
}

// ---------------------------------------------------------------------------
// Ablauf
// ---------------------------------------------------------------------------

export function ProcessSection({ id = "ablauf" }: { id?: string }) {
  return (
    <section id={id} className="px-4 py-24 sm:px-6 md:px-10 md:py-32">
      <SectionHead title="Von der Idee zur Website" muted="In vier Schritten." />
      <Reveal>
        <RollingTextList />
      </Reveal>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Kontakt
// ---------------------------------------------------------------------------

export function ContactSection({ id = "kontakt" }: { id?: string }) {
  return (
    <section id={id} className="px-4 py-24 sm:px-6 md:px-10 md:py-32">
      <SectionHead title="Lass uns über euer Projekt reden." muted="In zwei Minuten zur Anfrage." />
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="flex flex-col gap-4">
            {[
              { icon: Mail, label: "E-Mail", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { icon: Phone, label: "Telefon", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
              { icon: MapPin, label: "Standort", value: CONTACT.location },
            ].map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/40">{label}</span>
                    <span className="text-base text-primary">{value}</span>
                  </span>
                </>
              );
              return href ? (
                <a key={label} href={href} className="flex items-center gap-4 rounded-2xl border border-border p-4 transition-colors hover:border-accent/60">
                  {inner}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-4 rounded-2xl border border-border p-4">
                  {inner}
                </div>
              );
            })}
            <p className="mt-2 text-sm leading-relaxed text-primary/45">
              Lieber direkt schreiben? Kein Problem, eine kurze Mail mit ein paar Infos zum Projekt reicht völlig.
            </p>
          </div>
        </Reveal>

        {/* Handy: Formular zuerst, Kontaktdaten darunter */}
        <Reveal className="order-first lg:order-none lg:col-span-8" delay={0.1}>
          <OnboardingForm email={CONTACT.email} />
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Impressum & Datenschutz (Overlay über #impressum / #datenschutz)
// ---------------------------------------------------------------------------

const LEGAL: Record<string, { title: string; body: ReactNode }> = {
  impressum: {
    title: "Impressum",
    body: (
      <>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Platzhalter: vor dem Livegang ausfüllen</p>
        <h3>Angaben gemäß § 5 DDG</h3>
        <p>
          [Vorname Nachname / Firmenname]
          <br />
          [Straße Hausnummer]
          <br />
          [PLZ Ort]
        </p>
        <h3>Kontakt</h3>
        <p>
          Telefon: [Telefonnummer]
          <br />
          E-Mail: [E-Mail-Adresse]
        </p>
        <h3>Umsatzsteuer-ID</h3>
        <p>[falls vorhanden]</p>
        <h3>Verantwortlich für den Inhalt</h3>
        <p>[Name, Anschrift]</p>
      </>
    ),
  },
  datenschutz: {
    title: "Datenschutz",
    body: (
      <>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Platzhalter: vor dem Livegang ersetzen</p>
        <p>
          Hier kommt eure Datenschutzerklärung hin. Sie muss zu dem passen, was die Seite tatsächlich tut, z. B. Hosting,
          Kontaktformular bzw. E-Mail-Kontakt und extern geladene Inhalte (Schriften, Bilder, Videos).
        </p>
        <p>Am einfachsten mit einem Datenschutz-Generator erstellen oder rechtlich prüfen lassen.</p>
      </>
    ),
  },
};

export function LegalOverlay() {
  const [page, setPage] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const key = window.location.hash.replace("#", "");
      setPage(LEGAL[key] ? key : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    setScrollLocked("legal", page !== null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page]);

  const close = () => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setPage(null);
  };

  if (!page) return null;
  const content = LEGAL[page];

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={close}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={content.title}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="relative max-h-[85svh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card p-6 text-primary sm:rounded-2xl md:p-10 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-primary/65"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Schließen"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary/70 hover:text-primary"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="mb-6 text-4xl font-medium tracking-[-0.04em]">{content.title}</h2>
        <div className="flex flex-col gap-3">{content.body}</div>
      </motion.div>
    </div>
  );
}
