"use client";

import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`;

// Platzhalter – später durch eigene Screenshots / Designs ersetzen
export const DEFAULT_TUNNEL_IMAGES = [
  { src: u("1561070791-2526d30994b5"), title: "Konzept" },
  { src: u("1559028012-481c04fa702d"), title: "Wireframes" },
  { src: u("1581291518857-4e27b48ff24e"), title: "UI Design" },
  { src: u("1498050108023-c5249f4df085"), title: "Entwicklung" },
  { src: u("1460925895917-afdab827c52f"), title: "SEO" },
  { src: u("1547658719-da2b51169166"), title: "Responsive" },
  { src: u("1555066931-4365d14bab8c"), title: "Performance" },
  { src: u("1522542550221-31fd19575a2d"), title: "Branding" },
  { src: u("1497366216548-37526070297c"), title: "Launch" },
];

interface TunnelImage {
  src: string;
  title: string;
}

interface TunnelCardData {
  item: TunnelImage;
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const buildCards = (images: TunnelImage[]): TunnelCardData[] =>
  images.map((item, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    return {
      item,
      angleCos: Math.cos(goldenAngle),
      angleSin: Math.sin(goldenAngle),
      radiusFactorX: 0.28 + (i % 3) * 0.08,
      radiusFactorY: 0.26 + (i % 2) * 0.09,
      rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
      index: i,
    };
  });

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(180, stage.width * 0.38))
    : Math.max(180, Math.min(270, stage.width * 0.18));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform([z, pointer.x, pointer.y], ([currZ, px, py]: number[]) => {
    const offsetX = baseX - px * panStrength;
    const offsetY = baseY - py * panStrength;
    return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
  });

  return (
    <motion.div
      style={{ width: cardWidth, transform, opacity, zIndex: card.index + 1 }}
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] cursor-pointer select-none will-change-transform"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl shadow-black/90 ring-1 ring-white/15 transition-all duration-500 hover:ring-primary/70">
        <img
          src={card.item.src}
          alt={card.item.title}
          draggable={false}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 sm:p-5">
          <span className="font-mono text-xs uppercase tracking-widest text-white/95 drop-shadow-md sm:text-sm">
            {card.item.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export interface PerspectiveTunnelHeroProps {
  images?: TunnelImage[];
  eyebrow?: string;
  /** Zeilen der Überschrift */
  titleLines?: string[];
  subtitle?: string;
  /** Scroll-Strecke der Animation in vh */
  scrollLength?: number;
  id?: string;
}

/**
 * Hinweis: Das Original fängt das Mausrad ab (preventDefault) und blockiert damit
 * das Weiterscrollen der Seite. Hier wird der Fortschritt stattdessen aus dem
 * normalen Seiten-Scroll berechnet (sticky Bühne), damit die Sektion in den
 * Seitenfluss passt und auch auf Touch-Geräten funktioniert.
 */
export default function PerspectiveTunnelHero({
  images = DEFAULT_TUNNEL_IMAGES,
  eyebrow = "Von der Idee zur Website",
  titleLines = ["IDEEN IN", "BEWEGUNG."],
  subtitle = "Konzept, Design, Code und Launch – alles aus einer Hand. Scroll weiter und flieg durch unseren Prozess.",
  scrollLength = 300,
  id = "leistungen",
}: PerspectiveTunnelHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const cards = buildCards(images);

  const [stage, setStage] = useState<StageDimensions>({ width: 1440, height: 900, isMobile: false });

  useEffect(() => {
    const update = () =>
      setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.0001 });

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 1.35]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.85, 1], [0.25, 1, 1, 0]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={sectionRef} id={id} className="relative w-full bg-ink" style={{ height: `${scrollLength}vh` }}>
      <div
        className="sticky top-0 flex h-[100svh] w-full select-none items-center justify-center overflow-hidden text-white"
        style={{ perspective: stage.isMobile ? "900px" : "1200px", transformStyle: "preserve-3d" }}
      >
        {/* Raster & Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#2a2a24_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,224,204,0.08)_0%,transparent_70%)]" />

        {/* Tiefenringe */}
        <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-primary/10" />
        <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-white/10" />

        {/* Text in der Mitte */}
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity }}
          className="pointer-events-none z-0 flex max-w-xl flex-col items-center px-6 text-center"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-primary/70">{eyebrow}</p>
          <h2 className="bg-gradient-to-b from-primary via-primary to-primary/40 bg-clip-text text-5xl font-semibold leading-[0.9] tracking-tighter text-transparent sm:text-7xl md:text-8xl">
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-4 max-w-[36ch] text-sm font-light text-neutral-400 sm:text-base">{subtitle}</p>
        </motion.div>

        {/* Scroll-Hinweis */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-neutral-400"
        >
          <span>Weiter scrollen</span>
          <div className="h-6 w-px bg-gradient-to-b from-primary to-transparent" />
        </motion.div>

        {/* 3D-Ebene */}
        <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {cards.map((card, i) => (
            <TunnelCard
              key={i}
              card={card}
              progress={smoothProgress}
              pointer={pointer}
              total={cards.length}
              stage={stage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
