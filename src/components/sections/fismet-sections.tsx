"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Mail, MapPin, Phone, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
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
        {muted ? <span className="text-primary/35"> {muted}</span> : null}
      </h2>
    </Reveal>
  );
}

// ---------------------------------------------------------------------------
// Ablauf
// ---------------------------------------------------------------------------

const STEPS = [
  { title: "Kennenlernen", text: "Kurzes Gespräch: Was braucht ihr, wen wollt ihr erreichen, was ist das Ziel?", time: "Tag 1" },
  { title: "Konzept & Design", text: "Struktur, Inhalte und ein Design-Entwurf, den ihr vorab seht und mitgestaltet.", time: "Woche 1–2" },
  { title: "Entwicklung", text: "Wir bauen die Seite sauber, schnell und für alle Bildschirme.", time: "Woche 2–4" },
  { title: "Launch & Betreuung", text: "Livegang, Feinschliff und auf Wunsch laufende Pflege danach.", time: "ab Woche 4" },
];

export function ProcessSection({ id = "ablauf" }: { id?: string }) {
  return (
    <section id={id} className="px-4 py-24 sm:px-6 md:px-10 md:py-32">
      <SectionHead title="Von der Idee zur Website" muted="– in vier Schritten." />
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.07} className="h-full">
            <li className="group flex h-full flex-col gap-10 bg-ink p-6 transition-colors duration-500 hover:bg-[#10131c] md:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/35">{s.time}</span>
              </div>
              <div>
                <h3 className="mb-3 text-2xl font-medium tracking-[-0.03em] text-primary">{s.title}</h3>
                <p className="text-sm leading-relaxed text-primary/55">{s.text}</p>
              </div>
              <div className="mt-auto h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 group-hover:scale-x-100" />
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Kontakt
// ---------------------------------------------------------------------------

const BUDGETS = ["< 1.000 €", "1.000 – 3.000 €", "3.000 – 6.000 €", "> 6.000 €", "Noch offen"];
const TOPICS = ["Neue Website", "Relaunch", "Landingpage", "Online-Shop", "Wartung", "Etwas anderes"];

const inputCls =
  "w-full rounded-xl border border-border bg-[#111110] px-4 py-3 text-sm text-primary placeholder:text-primary/30 outline-none transition-colors focus:border-accent";

export function ContactSection({ id = "kontakt" }: { id?: string }) {
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [sent, setSent] = useState(false);

  // Ohne Server: öffnet das Mailprogramm mit vorausgefüllter Nachricht
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = [
      `Name: ${d.get("name") ?? ""}`,
      `E-Mail: ${d.get("email") ?? ""}`,
      `Firma: ${d.get("company") ?? ""}`,
      `Thema: ${topic}`,
      `Budget: ${d.get("budget") ?? ""}`,
      "",
      `${d.get("message") ?? ""}`,
    ].join("\n");
    const subject = `Projektanfrage: ${topic}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id={id} className="px-4 py-24 sm:px-6 md:px-10 md:py-32">
      <SectionHead title="Lass uns über euer Projekt reden." muted="Antwort meist innerhalb von 24 h." />
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
              Lieber direkt schreiben? Kein Problem – eine kurze Mail mit ein paar Infos zum Projekt reicht völlig.
            </p>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={0.1}>
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <fieldset className="mb-6">
              <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary/40">Worum geht's?</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      topic === t ? "border-accent bg-accent text-white" : "border-border text-primary/70 hover:border-accent/60",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/40">Name *</span>
                <input name="name" required autoComplete="name" placeholder="Max Mustermann" className={inputCls} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/40">E-Mail *</span>
                <input name="email" type="email" required autoComplete="email" placeholder="max@firma.de" className={inputCls} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/40">Firma</span>
                <input name="company" autoComplete="organization" placeholder="Optional" className={inputCls} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/40">Budget</span>
                <select name="budget" defaultValue="" className={inputCls}>
                  <option value="" disabled>
                    Bitte wählen
                  </option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/40">Nachricht *</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Erzählt kurz, was ihr vorhabt …"
                  className={cn(inputCls, "resize-y")}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-xs text-primary/40">
                Mit dem Absenden stimmt ihr der Verarbeitung eurer Angaben gemäß{" "}
                <a href="#datenschutz" className="underline underline-offset-2 hover:text-primary">
                  Datenschutzerklärung
                </a>{" "}
                zu.
              </p>
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent py-1 pl-5 pr-1 text-sm font-medium text-white transition-all hover:gap-3"
              >
                Anfrage senden
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/25 transition-transform group-hover:scale-110">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </div>
            {sent ? (
              <p className="mt-4 text-sm text-accent">
                Euer Mailprogramm sollte sich geöffnet haben. Falls nicht, schreibt uns direkt an {CONTACT.email}.
              </p>
            ) : null}
          </form>
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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Platzhalter – vor dem Livegang ausfüllen</p>
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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Platzhalter – vor dem Livegang ersetzen</p>
        <p>
          Hier kommt eure Datenschutzerklärung hin. Sie muss zu dem passen, was die Seite tatsächlich tut – z. B. Hosting,
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
