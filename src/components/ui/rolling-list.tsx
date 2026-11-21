import { Fragment } from "react";
import { cn } from "@/lib/utils";

export interface ListItem {
  id: number;
  title: string;
  color: "blue";
}

const colorClassMap: Record<ListItem["color"], string> = {
  // Fismet-Blau aus dem Logo
  blue: "text-accent",
};

/** Einrückung pro Schritt am Desktop (Treppe) */
const STEP_INDENT = 12; // in %

function RollingTextItem({ item, index }: { item: ListItem; index: number }) {
  return (
    <div className="group relative w-fit cursor-default md:[margin-left:var(--indent)]" style={{ ["--indent" as string]: `${index * STEP_INDENT}%` }}>
      <div className="relative h-12 overflow-hidden pr-4 md:pr-7 sm:h-[60px] md:h-20">
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
          {/* Normal */}
          <div className="flex h-12 items-center sm:h-[60px] md:h-20">
            <h3 className="whitespace-nowrap text-4xl font-black uppercase tracking-tighter text-primary sm:text-5xl md:text-7xl">
              {item.title}
            </h3>
          </div>
          {/* Hover: kursiv + Blau */}
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

/** Gestrichelter Pfeil zur nächsten Phase */
function DashedArrow({ index }: { index: number }) {
  return (
    <div aria-hidden className="relative text-primary/35">
      {/* Handy: gerade nach unten */}
      <svg className="ml-4 block h-14 w-6 md:hidden" viewBox="0 0 24 56" fill="none">
        <path d="M12 4 V46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" strokeLinecap="round" />
        <path d="M6 41 L12 49 L18 41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* Desktop: geschwungen nach rechts unten zur nächsten Stufe */}
      <div className="hidden h-20 md:block" style={{ marginLeft: `calc(${index * STEP_INDENT}% + 2.5rem)`, width: `${STEP_INDENT}%` }}>
        <svg className="h-full w-full overflow-visible" viewBox="0 0 100 80" preserveAspectRatio="none" fill="none">
          <path
            d="M0 6 C 0 50, 40 64, 92 70"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="5 6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Pfeilspitze (eigenes SVG, damit sie nicht verzerrt wird) */}
        <svg className="absolute bottom-[6px] h-3 w-3" style={{ left: `calc(${index * STEP_INDENT}% + 2.5rem + ${STEP_INDENT}% - 0.85rem)` }} viewBox="0 0 12 12" fill="none">
          <path d="M2 2 L10 6 L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export const DEFAULT_ROLLING_ITEMS: ListItem[] = [
  { id: 1, title: "Kennenlernen", color: "blue" },
  { id: 2, title: "Design", color: "blue" },
  { id: 3, title: "Entwicklung", color: "blue" },
  { id: 4, title: "Launch", color: "blue" },
];

function RollingTextList({ items = DEFAULT_ROLLING_ITEMS, className }: { items?: ListItem[]; className?: string }) {
  return (
    <div className={cn("flex w-full flex-col py-4", className)}>
      {items.map((item, i) => (
        <Fragment key={item.id}>
          <RollingTextItem item={item} index={i} />
          {i < items.length - 1 ? <DashedArrow index={i} /> : null}
        </Fragment>
      ))}
    </div>
  );
}

export { RollingTextList };
