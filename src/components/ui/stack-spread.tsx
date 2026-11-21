// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

// Eigene Projekte (Screenshots liegen in public/projects)
const shot = (name: string) => `${import.meta.env.BASE_URL}projects/${name}.webp`;

// Reihenfolge = Stapelreihenfolge, hinten -> vorne
export const DEFAULT_CARDS: StackSpreadCard[] = [
  {
    item: { src: shot("zautomobile"), alt: "Website von Z Automobile", label: "Z Automobile", href: "https://zautomobile.autos" },
    stackOffset: { x: -4, y: -3 },
    stackRotate: -7,
    target: { x: -36, y: -9, rotate: 0, scale: 1, w: 24, h: 30, aspect: 1.6 },
    targetSm: { x: 0, y: -26 },
    z: 2,
  },
  {
    item: { src: shot("purodetail"), alt: "Website von Puro Detail", label: "Puro Detail", href: "https://purodetail.vercel.app" },
    stackOffset: { x: 4, y: 3 },
    stackRotate: 6,
    target: { x: 36, y: 11, rotate: 0, scale: 1, w: 24, h: 30, aspect: 1.6 },
    targetSm: { x: 0, y: 29 },
    z: 3,
  },
];

// ---------------------------------------------------------------------------
// Mechanik
// ---------------------------------------------------------------------------

const SCATTER_START = 0.12;
const SCATTER_END = 0.9;

const PARALLAX_X = 2.6;
const PARALLAX_Y = 2.2;
const PARALLAX_SPRING = { stiffness: 90, damping: 22, mass: 0.6 };
const parallaxDepth = (i: number, total: number) => (total <= 1 ? 1 : 0.55 + (i / (total - 1)) * 0.75);

const RESPONSIVE = {
  desktop: {
    scale: null as number | null,
    small: false,
    colX: null as number | null,
    card: null as { w: number; h: number } | null,
  },
  // Handy: zwei breite Karten über und unter dem Text
  small: { scale: 1, small: true, colX: 22, card: { w: 80, h: 22 } },
};

function useResponsive() {
  const [r, setR] = useState(RESPONSIVE.desktop);
  useEffect(() => {
    // Touch statt Breite: nur echte Touch-Geräte bekommen das Spalten-Layout
    const mq = window.matchMedia("(pointer: coarse)");
    const read = () => setR(mq.matches ? RESPONSIVE.small : RESPONSIVE.desktop);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return r;
}

function usePointerParallax(active: boolean, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, PARALLAX_SPRING);
  const y = useSpring(rawY, PARALLAX_SPRING);

  useEffect(() => {
    if (!enabled) return;
    if (!active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1);
      rawY.set((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [active, enabled, rawX, rawY]);

  return { x, y };
}

export interface StackSpreadItem {
  src: string;
  alt?: string;
  /** kleiner Name unten auf der Karte (z. B. Kundenname) */
  label?: string;
  /** Link zur Live-Seite */
  href?: string;
}

export interface StackSpreadTarget {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  w: number;
  h: number;
  /** Seitenverhältnis (Breite/Höhe); wenn gesetzt, wird h ignoriert und die Höhe aus der Breite berechnet */
  aspect?: number;
}

export interface StackSpreadCard {
  item: StackSpreadItem;
  target: StackSpreadTarget;
  targetSm?: { x: number; y: number };
  stackRotate?: number;
  stackOffset?: { x: number; y: number };
  z?: number;
}

function Card({
  card,
  progress,
  reduce,
  clusterRotation,
  scaleMul,
  isSmall,
  colX,
  fixedCard,
  stackScale,
  cardRadius,
  pointer,
  depth,
}: {
  card: StackSpreadCard;
  progress: MotionValue<number>;
  reduce: boolean | null;
  clusterRotation: boolean;
  scaleMul: number | null;
  isSmall: boolean;
  colX: number | null;
  fixedCard: { w: number; h: number } | null;
  stackScale: number;
  cardRadius: number;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  depth: number;
}) {
  const { item, target } = card;

  const flat = reduce === true;
  const sm0 = isSmall && card.targetSm ? card.targetSm : null;
  // Handy: ruhiger Start nahe der Endposition, ohne Drehung
  const stackRotate = flat || sm0 ? 0 : clusterRotation ? card.stackRotate ?? 0 : 0;
  const stackOffset = sm0 ? { x: 0, y: sm0.y * 0.93 } : card.stackOffset ?? { x: 0, y: 0 };
  const restScale = scaleMul ?? target.scale ?? 1;

  const sm = isSmall && card.targetSm ? card.targetSm : null;
  const endX = sm ? (colX != null ? Math.sign(sm.x) * colX : sm.x) : target.x;
  const endY = sm ? sm.y : target.y;
  const endRotate = flat || isSmall ? 0 : target.rotate;

  const translate = useTransform([progress, pointer.x, pointer.y], ([p, px, py]: number[]) => {
    const tx = stackOffset.x + (endX - stackOffset.x) * p;
    const ty = stackOffset.y + (endY - stackOffset.y) * p;
    const drift = depth * p;
    const dx = tx - px * PARALLAX_X * drift;
    const dy = ty - py * PARALLAX_Y * drift;
    return `calc(-50% + ${dx}vw) calc(-50% + ${dy}vh)`;
  });
  const rotate = useTransform(progress, [0, 1], [stackRotate, endRotate]);
  const scale = useTransform(progress, [0, 1], [isSmall ? 0.94 : stackScale, restScale]);
  const opacity = useTransform(progress, [0, 0.45], isSmall ? [0, 1] : [1, 1]);
  const aspect = target.aspect;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{
        width: `${fixedCard ? fixedCard.w : target.w}vw`,
        height: aspect ? "auto" : `${fixedCard ? fixedCard.h : target.h}vh`,
        aspectRatio: aspect ? String(aspect) : undefined,
        zIndex: card.z ?? 1,
        translate,
        rotate,
        scale,
        opacity,
      }}
    >
      <CardFace item={item} cardRadius={cardRadius} />
    </motion.div>
  );
}

function CardFace({ item, cardRadius }: { item: StackSpreadItem; cardRadius: number }) {
  const inner = (
    <>
      <img
        src={item.src}
        alt={item.alt ?? ""}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {item.label && (
        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-primary backdrop-blur">
          {item.label}
        </span>
      )}
    </>
  );
  const cls = "group relative block h-full w-full overflow-hidden bg-neutral-300 max-md:rounded-[4vw]";
  return item.href ? (
    <a href={item.href} target="_blank" rel="noreferrer" className={cls} style={{ borderRadius: cardRadius }}>
      {inner}
    </a>
  ) : (
    <div className={cls} style={{ borderRadius: cardRadius }}>
      {inner}
    </div>
  );
}

export interface StackSpreadProps {
  cards?: StackSpreadCard[];
  /** Scroll-Strecke in vh */
  scrollLength?: number;
  bgColor?: string;
  clusterRotation?: boolean;
  stackScale?: number;
  cardRadius?: number;
  textColor?: string;
  textFadeStart?: number;
  showScrollHint?: boolean;
  headline?: [string, string, string];
  subline?: string;
  id?: string;
}

export default function StackSpread({
  cards = DEFAULT_CARDS,
  scrollLength = 260,
  bgColor = "#e1e0cc",
  clusterRotation = true,
  stackScale = 0.82,
  cardRadius = 10,
  textColor = "#0b0b0a",
  textFadeStart = 0.3,
  showScrollHint = true,
  headline = ["Seiten,", "die", "live sind."],
  subline = "Eine Auswahl unserer aktuellen Projekte. Online, schnell und gebaut für echte Kunden.",
  id = "projekte",
}: StackSpreadProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scale: scaleMul, small: isSmall, colX, card: fixedCard } = useResponsive();

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  // halten, verteilen, ruhen
  const progress = useTransform(scrollYProgress, [0, SCATTER_START, SCATTER_END, 1], [0, 0, 1, 1]);

  const [spread, setSpread] = useState(false);
  useMotionValueEvent(progress, "change", (p) => {
    setSpread((was) => (was ? p > 0.985 : p >= 0.999));
  });
  const parallaxEnabled = reduce !== true && !isSmall;
  const pointer = usePointerParallax(spread, parallaxEnabled);

  const noScale = reduce === true;
  // Handy: Titel sofort sichtbar, die Karten gleiten um ihn herum
  const copyOpacity = useTransform(progress, [textFadeStart, textFadeStart + 0.35], isSmall ? [1, 1] : [0, 1]);
  const copyScale = useTransform(progress, [textFadeStart, 0.9], [0.85, 1]);
  const hintOpacity = useTransform(progress, [0, SCATTER_START], [1, 0]);

  return (
    <section
      ref={wrapRef}
      id={id}
      className="relative w-full"
      style={{ height: `${scrollLength}vh`, backgroundColor: bgColor }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Text in der Mitte */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 text-center max-md:px-8"
          style={{ opacity: copyOpacity, scale: noScale || isSmall ? 1 : copyScale }}
        >
          <h2
            className="w-full text-[4.5vw] font-normal leading-none! tracking-tight max-md:text-[10vw]"
            style={{ color: textColor }}
          >
            {headline[0]} <span className="opacity-60">{headline[1]}</span> {headline[2]}
          </h2>
          <p
            className="mt-[1.2vw] w-full max-w-[42ch] text-[1.15vw] leading-relaxed tracking-tight max-md:mt-3 max-md:text-[3.6vw]"
            style={{ color: textColor, opacity: 0.6 }}
          >
            {subline}
          </p>
        </motion.div>

        {/* Karten */}
        <div className="absolute inset-0 z-10">
          {cards.map((card, i) => (
            <Card
              key={i}
              card={card}
              progress={progress}
              reduce={reduce}
              clusterRotation={clusterRotation}
              scaleMul={scaleMul}
              isSmall={isSmall}
              colX={colX}
              fixedCard={fixedCard}
              stackScale={stackScale}
              cardRadius={cardRadius}
              pointer={pointer}
              depth={parallaxEnabled ? parallaxDepth(i, cards.length) : 0}
            />
          ))}
        </div>

        {/* Scroll-Hinweis */}
        {showScrollHint && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[3vh] z-20 flex flex-col items-center gap-[0.6vh] text-[0.8vw] font-medium uppercase tracking-[0.2em] max-md:bottom-6 max-md:gap-1 max-md:text-[2.8vw]"
            style={{ color: textColor, opacity: hintOpacity }}
          >
            <span>Scroll</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce max-md:h-[4vw] max-md:w-[4vw]"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
}
