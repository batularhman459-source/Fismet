import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { FismetGlassReveal, glassRevealDuration } from "@/components/ui/liquid-glass-logo-reveal";
import { PrismaHero } from "@/components/ui/prisma-hero";
import { WarpCarousel } from "@/components/ui/warp-carousel";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function App() {
  const [loading, setLoading] = useState(true);

  // Ladebildschirm: so lange das Glas-Reveal läuft, danach Vorhang nach oben zum Hero
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduce ? 1200 : (glassRevealDuration("dark") + 0.4) * 1000;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => {
      window.clearTimeout(t);
      root.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!loading) document.documentElement.style.overflow = "";
  }, [loading]);

  return (
    <main className="bg-ink">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 bg-ink"
            initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 1, ease: EASE }}
          >
            <FismetGlassReveal className="h-full w-full" />
            <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-primary/40">
              Fismet Webdesign
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        id="studio"
        initial={{ scale: 1.08, filter: "blur(12px)" }}
        animate={loading ? {} : { scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <PrismaHero ready={!loading} />
      </motion.div>

      <section id="leistungen" className="px-2 pb-2 pt-24 md:px-3 md:pt-32">
        <div className="mb-10 grid gap-6 px-2 md:mb-14 md:grid-cols-12 md:px-7">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary/50 md:col-span-3">Fismet in Zahlen</p>
          <h2 className="text-4xl font-medium leading-[0.95] tracking-[-0.04em] text-primary sm:text-6xl md:col-span-9">
            Schnell, mobil, sauber gebaut
            <span className="text-primary/40"> – Websites, die liefern.</span>
          </h2>
        </div>
        <div id="projekte" className="h-[80svh] min-h-[460px] overflow-hidden rounded-2xl md:h-[100svh] md:rounded-[2rem]">
          <WarpCarousel background="#0b0b0a" ariaLabel="Fismet in Zahlen" style={{ width: "100%", height: "100%" }} />
        </div>
      </section>

      <div id="team" className="mt-24 md:mt-32">
        <HalftoneWordmarkFooter
          id="kontakt"
          wordmark="fismet"
          label="Fismet Webdesign"
          meta="© 2026 · Pierre & Abderrahman"
          palette={{ background: "#0b0b0a", ink: "#e1e0cc", warm: "#e9762b" }}
          backToTopLabel="Nach oben ↑"
          columns={[
            {
              title: "Studio",
              links: [
                { label: "Leistungen", href: "#leistungen" },
                { label: "Projekte", href: "#projekte" },
                { label: "Team", href: "#team" },
              ],
            },
            {
              title: "Kontakt",
              links: [
                { label: "hallo@fismet.de", href: "mailto:hallo@fismet.de" },
                { label: "Instagram", href: "#" },
              ],
            },
            {
              title: "Rechtliches",
              links: [
                { label: "Impressum", href: "#" },
                { label: "Datenschutz", href: "#" },
              ],
            },
          ]}
        />
      </div>
    </main>
  );
}
