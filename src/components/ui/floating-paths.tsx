"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Die animierten Linien allein (füllen ihren Container) */
export function FloatingPaths({
  position,
  className,
  opacity = 1,
}: {
  position: number;
  /** Farbe über `text-*` steuern (Linien nutzen currentColor) */
  className?: string;
  /** Gesamt-Deckkraft der Ebene */
  opacity?: number;
}) {
  // Dauer einmal pro Pfad festlegen, nicht bei jedem Render neu würfeln
  const paths = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
          380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
          152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
          684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
        duration: 20 + Math.random() * 10,
      })),
    [position],
  );

  return (
    <svg
      className={cn("h-full w-full", className)}
      viewBox="0 0 696 316"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      style={{ opacity }}
    >
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={0.1 + path.id * 0.03}
          initial={{ pathLength: 0.3, opacity: 0.6 }}
          animate={{
            pathLength: 1,
            opacity: [0.3, 0.6, 0.3],
            pathOffset: [0, 1, 0],
          }}
          transition={{
            duration: path.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

export function FloatingPathsBackground({
  position,
  children,
  className,
  pathsClassName = "text-slate-950 dark:text-white",
}: {
  position: number;
  className?: string;
  pathsClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full relative", className)}>
      <div className="absolute inset-0 pointer-events-none">
        <FloatingPaths position={position} className={pathsClassName} />
      </div>
      {children}
    </div>
  );
}

/**
 * Hintergrund für lange Bereiche: die Linien bleiben beim Scrollen stehen
 * (sticky, immer bildschirmfüllend) – zwei gegenläufige Ebenen.
 */
export function StickyFloatingPathsBackground({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative isolate w-full", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* eigene Grafikebene: der Hintergrund wird beim Scrollen nicht neu gezeichnet */}
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden [contain:strict] [transform:translateZ(0)]">
          <FloatingPaths position={1} className="absolute inset-0 text-primary" opacity={0.75} />
          <FloatingPaths position={-1} className="absolute inset-0 text-accent" opacity={0.9} />
          {/* Ränder leicht abdunkeln */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(11,11,10,0.7)_100%)]" />
        </div>
      </div>
      {children}
    </div>
  );
}
