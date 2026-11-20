import { cn } from "@/lib/utils";

export interface ListItem {
  id: number;
  title: string;
  category: string;
  src: string;
  alt: string;
  color: "blue";
}

interface RollingTextItemProps {
  item: ListItem;
}

const colorClassMap: Record<ListItem["color"], string> = {
  // Fismet-Blau aus dem Logo
  blue: "text-accent",
};

function RollingTextItem({ item }: RollingTextItemProps) {
  return (
    <div className="group relative w-full cursor-pointer border-b border-border py-6">
      {/* Rolling text */}
      <div className="relative h-12 overflow-hidden sm:h-[60px] md:h-20">
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
          {/* State 1: Normal */}
          <div className="flex h-12 items-center sm:h-[60px] md:h-20">
            <h3 className="whitespace-nowrap text-4xl font-black uppercase tracking-tighter text-primary sm:text-5xl md:text-7xl">{item.title}</h3>
          </div>

          {/* State 2: Hover (Italic + Color) */}
          <div className="flex h-12 items-center sm:h-[60px] md:h-20" aria-hidden>
            <h3 className={cn("whitespace-nowrap text-4xl font-black uppercase italic tracking-tighter sm:text-5xl md:text-7xl", colorClassMap[item.color])}>
              {item.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Category Label */}
      <span className="absolute right-0 top-8 hidden text-xs font-bold uppercase tracking-widest text-primary/40 transition-opacity duration-300 group-hover:opacity-0 md:block">
        {item.category}
      </span>

      {/* Image Reveal Effect */}
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-1/2 z-20 hidden h-32 w-48 -translate-y-1/2 overflow-hidden rounded-lg shadow-2xl md:block",
          "transition-all duration-500 ease-out",
          "translate-x-4 rotate-3 scale-95 opacity-0",
          "group-hover:translate-x-0 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100",
        )}
      >
        <div className="relative h-full w-full">
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-accent/15 mix-blend-overlay" />
        </div>
      </div>
    </div>
  );
}

// Platzhalter-Bilder – später durch eigene ersetzen
export const DEFAULT_ROLLING_ITEMS: ListItem[] = [
  {
    id: 1,
    title: "Kennenlernen",
    category: "Tag 1",
    src: "https://cdn.21st.dev/assets/mirror/47/4710b9d82fb5e24949919a6ec1a00738147367e369316b18c90092e2dc8fbd6f.jpg",
    alt: "Erstes Gespräch",
    color: "blue",
  },
  {
    id: 2,
    title: "Design",
    category: "Woche 1–2",
    src: "https://cdn.21st.dev/assets/mirror/a9/a90f49901bb0f47f7427f8c0d40734c44fa87e3ea50fe6578fb218ecf6d9e926.jpg",
    alt: "Design-Entwurf",
    color: "blue",
  },
  {
    id: 3,
    title: "Entwicklung",
    category: "Woche 2–4",
    src: "https://cdn.21st.dev/assets/mirror/f9/f9693912c046c9f085047375fc80177955f2ec175a2da779ad4a718718fedf63.jpg",
    alt: "Programmierung",
    color: "blue",
  },
  {
    id: 4,
    title: "Launch",
    category: "ab Woche 4",
    src: "https://cdn.21st.dev/assets/mirror/68/68043ddcb0b723a84f9c2fa6c581b74c3af46af745c21be5bf8d83c802c2780e.jpg",
    alt: "Livegang",
    color: "blue",
  },
];

function RollingTextList({ items = DEFAULT_ROLLING_ITEMS, className }: { items?: ListItem[]; className?: string }) {
  return (
    <div className={cn("flex w-full flex-col", className)}>
      {items.map((item) => (
        <RollingTextItem key={item.id} item={item} />
      ))}
    </div>
  );
}

export { RollingTextList };
