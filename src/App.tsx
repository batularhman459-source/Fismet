import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import FeaturesWithPanel from "@/components/ui/features-with-panel";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { FISMET_LOADER_TUNING, FismetGlassReveal } from "@/components/ui/liquid-glass-logo-reveal";
import { DEFAULT_LAYERS, ParallaxComponent } from "@/components/ui/parallax-scrolling";
import { SvgPathDrawingTextAnimation } from "@/components/ui/path-drawing-portfolio-hero";
import StackSpread from "@/components/ui/stack-spread";
import { Component as KineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";
import { setScrollLocked } from "@/lib/scroll-lock";

const EASE = [0.76, 0, 0.24, 1] as const;
const LOGO_MARK = `${import.meta.env.BASE_URL}fismet-mark.png`;
const LOGO_MARK_HD = `${import.meta.env.BASE_URL}fismet-mark-hd.png`;
const HERO_FRONT = `${import.meta.env.BASE_URL}hero-front.webp`;

// Akzentfarben aus dem Logo
export const ACCENT = "#2d7dfb";

export default function App() {
  const [loading, setLoading] = useState(true);

  // Ladebildschirm: Scrollen sperren; Notbremse nach spätestens 5 s
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = window.setTimeout(() => setLoading(false), 5000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    setScrollLocked("loader", loading);
  }, [loading]);

  // Vorhang öffnet, sobald das Glas das Logo freigegeben hat (~1,9 s nach Animationsstart)
  const revealTimer = useRef<number | undefined>(undefined);
  const onRevealStart = useCallback(() => {
    if (revealTimer.current !== undefined) return;
    revealTimer.current = window.setTimeout(() => setLoading(false), (FISMET_LOADER_TUNING.present + 0.6) * 1000);
  }, []);
  useEffect(() => () => window.clearTimeout(revealTimer.current), []);

  return (
    <main className="bg-ink">
      <KineticNavigation
        hidden={loading}
        logoSrc={LOGO_MARK}
        logo="Fismet Webdesign"
        meta={
          <>
            <a href="mailto:hallo@fismet.de">hallo@fismet.de</a>
            <span>Pierre &amp; Abderrahman</span>
          </>
        }
      />

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 bg-ink"
            initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <FismetGlassReveal
              className="h-full w-full"
              logo={LOGO_MARK_HD}
              originalColors
              tileSize={320}
              logoScale={0.66}
              finalScale={0.95}
              onRevealStart={onRevealStart}
              respectReducedMotion={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 1.08, filter: "blur(12px)" }}
        animate={loading ? {} : { scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        {/* Vordere Ebene lokal, ohne die Person */}
        <ParallaxComponent
          id="studio"
          title="Fismet"
          ready={!loading}
          layers={{ back: DEFAULT_LAYERS.back, middle: DEFAULT_LAYERS.middle, front: HERO_FRONT }}
          titleNode={
            <SvgPathDrawingTextAnimation
              text="Fismet"
              play={!loading}
              loop={false}
              fitToText
              fillAfterDraw
              fromColor="#1c57e1"
              toColor="#2d7dfb"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
              fontWeight={700}
              letterSpacing="-0.065em"
              fontSize={200}
              strokeWidth={2.5}
              durationSec={2.4}
              fillDurationSec={1}
              respectReducedMotion={false}
            />
          }
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <motion.img
              src={LOGO_MARK}
              alt=""
              className="mb-10 h-14 w-auto md:h-16"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.p
              className="text-3xl font-medium leading-[1.1] tracking-[-0.035em] text-primary sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Wir bauen klare, schnelle Websites,
              <span className="text-primary/40"> die nach euch aussehen und Besucher zu Kunden machen.</span>
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href="#kontakt"
                className="group inline-flex items-center gap-2 rounded-full bg-accent py-1 pl-5 pr-1 text-sm font-medium text-white transition-all hover:gap-3 sm:text-base"
              >
                Projekt anfragen
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/25 transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary/45">
                Pierre &amp; Abderrahman · Webdesign-Studio
              </span>
            </motion.div>
          </div>
        </ParallaxComponent>
      </motion.div>

      <StackSpread />

      <FeaturesWithPanel id="leistungen" />

      <div id="team" className="mt-8 md:mt-16">
        <HalftoneWordmarkFooter
          id="kontakt"
          wordmark="fismet"
          label="Fismet Webdesign"
          meta="© 2026 · Pierre & Abderrahman"
          palette={{ background: "#0b0b0a", ink: "#e1e0cc", warm: ACCENT }}
          backToTopLabel="Nach oben ↑"
          radius={115}
          drag={0.75}
          respectReducedMotion={false}
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
