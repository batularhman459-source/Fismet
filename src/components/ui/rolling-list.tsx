import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ListItem {
  id: number;
  title: string;
  color: "blue";
  /** Position am Desktop (Abstand von links in %) */
  left: string;
  /** Abstand nach oben zum vorherigen Wort (Tailwind-Klassen, bewusst unterschiedlich) */
  gap?: string;
}

const colorClassMap: Record<ListItem["color"], string> = {
  // Fismet-Blau aus dem Logo
  blue: "text-accent",
};

// Zickzack: links, rechts, links, rechts, bewusst unregelmäßig
export const DEFAULT_ROLLING_ITEMS: ListItem[] = [
  { id: 1, title: "Kennenlernen", color: "blue", left: "2%" },
  { id: 2, title: "Design", color: "blue", left: "58%", gap: "mt-14 md:mt-16" },
  { id: 3, title: "Entwicklung", color: "blue", left: "9%", gap: "mt-20 md:mt-28" },
  { id: 4, title: "Launch", color: "blue", left: "66%", gap: "mt-12 md:mt-20" },
];

function RollingTextItem({ item, index, innerRef }: { item: ListItem; index: number; innerRef: (el: HTMLDivElement | null) => void }) {
  const right = index % 2 === 1;
  return (
    <div
      ref={innerRef}
      className={cn(
        "group relative w-fit cursor-default md:[margin-left:var(--left)]",
        // Handy: abwechselnd links / rechts
        right ? "self-end md:self-auto" : "self-start",
        item.gap,
      )}
      style={{ ["--left" as string]: item.left }}
    >
      {/* feste Innenabstände rechts, damit die kursive Hover-Schrift nicht abgeschnitten wird */}
      <div className="relative h-12 overflow-hidden pr-4 sm:h-[60px] md:h-20 md:pr-7">
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
          <div className="flex h-12 items-center sm:h-[60px] md:h-20">
            <h3 className="whitespace-nowrap text-4xl font-black uppercase tracking-tighter text-primary sm:text-5xl md:text-7xl">{item.title}</h3>
          </div>
          <div className="flex h-12 items-center sm:h-[60px] md:h-20" aria-hidden>
            <h3 className={cn("whitespace-nowrap text-4xl font-black uppercase italic tracking-tighter sm:text-5xl md:text-7xl", colorClassMap[item.color])}>
              {item.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Arrow {
  d: string;
  head: string;
}

/** Gestrichelte, geschwungene Pfeile von Wort zu Wort, aus den echten Positionen berechnet */
function useArrows(container: React.RefObject<HTMLDivElement | null>, items: React.RefObject<(HTMLDivElement | null)[]>) {
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;

    const measure = () => {
      const base = root.getBoundingClientRect();
      const els = items.current.filter(Boolean) as HTMLDivElement[];
      const rects = els.map((el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - base.left, t: r.top - base.top, b: r.bottom - base.top, w: r.width };
      });
      const next: Arrow[] = [];
      for (let i = 0; i < rects.length - 1; i++) {
        const a = rects[i];
        const b = rects[i + 1];
        const goesRight = b.l + b.w / 2 > a.l + a.w / 2;
        // Start unter dem Wort, Ende über dem nächsten, jeweils etwas zur Mitte versetzt
        const sx = goesRight ? a.l + a.w * 0.62 : a.l + a.w * 0.3;
        const sy = a.b + 8;
        const ex = goesRight ? b.l + b.w * 0.28 : b.l + b.w * 0.7;
        const ey = b.t - 10;
        const dy = ey - sy;
        // weicher S-Bogen, endet senkrecht nach unten
        const d = `M ${sx} ${sy} C ${sx} ${sy + dy * 0.75}, ${ex} ${ey - dy * 0.55}, ${ex} ${ey}`;
        const head = `M ${ex - 5} ${ey - 7} L ${ex} ${ey} L ${ex + 5} ${ey - 7}`;
        next.push({ d, head });
      }
      setArrows(next);
      setSize({ w: base.width, h: base.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    // Web-Fonts ändern die Wortbreiten
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [container, items]);

  return { arrows, size };
}

function RollingTextList({ items = DEFAULT_ROLLING_ITEMS, className }: { items?: ListItem[]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { arrows, size } = useArrows(containerRef, itemRefs);

  return (
    <div ref={containerRef} className={cn("relative flex w-full flex-col py-4", className)}>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 text-primary/35"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
        fill="none"
      >
        {arrows.map((a, i) => (
          <g key={i}>
            <path d={a.d} stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 6" strokeLinecap="round" />
            <path d={a.head} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </svg>
      {items.map((item, i) => (
        <RollingTextItem
          key={item.id}
          item={item}
          index={i}
          innerRef={(el) => {
            itemRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}

export { RollingTextList };
