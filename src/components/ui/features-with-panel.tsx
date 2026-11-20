"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FeatureItem {
  title: string;
  alt?: string;
  /** Bild- oder Video-URL, Text oder eigenes React-Element */
  content: string | React.ReactNode;
}

function FeatureMedia({
  content,
  alt,
}: {
  content: string | React.ReactNode;
  alt?: string;
}) {
  if (typeof content !== "string") {
    return <div className="w-full h-full">{content}</div>;
  }

  const isVideo = /\.(mp4|webm|ogg)$/i.test(content);
  const isImage =
    /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(content) ||
    /unsplash|images\./i.test(content);

  if (isVideo) {
    return (
      <video
        src={content}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    );
  }

  if (isImage) {
    return (
      <img src={content} alt={alt} className="w-full h-full object-cover" />
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-8">
      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

// Platzhalter – später durch eigene Screenshots oder kurze Videos ersetzen
export const DEFAULT_FEATURES: FeatureItem[] = [
  {
    title: "Individuelles Design statt Baukasten.",
    alt: "Jede Seite wird für euch entworfen – passend zu Marke, Zielgruppe und Ziel.",
    content: u("1561070791-2526d30994b5"),
  },
  {
    title: "Sauber programmiert, blitzschnell geladen.",
    alt: "Moderner Code, optimierte Bilder und kurze Ladezeiten.",
    content: u("1555066931-4365d14bab8c"),
  },
  {
    title: "Perfekt auf Handy, Tablet und Desktop.",
    alt: "Jede Seite passt sich jedem Bildschirm an.",
    content: u("1547658719-da2b51169166"),
  },
  {
    title: "Bei Google gefunden werden.",
    alt: "Technisches SEO, saubere Struktur und schnelle Seiten von Anfang an.",
    content: u("1460925895917-afdab827c52f"),
  },
  {
    title: "Betreuung auch nach dem Launch.",
    alt: "Updates, Änderungen und Wartung – wir bleiben euer Ansprechpartner.",
    content: u("1522542550221-31fd19575a2d"),
  },
];

export interface FeaturesWithPanelProps {
  items?: FeatureItem[];
  heading?: string;
  id?: string;
  className?: string;
}

export default function FeaturesWithPanel({
  items = DEFAULT_FEATURES,
  heading = "Leistungen.",
  id,
  className,
}: FeaturesWithPanelProps) {
  const [active, setActive] = React.useState(0);

  return (
    <section id={id} className={cn("relative w-full py-24", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl mb-10">
              {heading}
            </h2>

            <ul className="flex flex-col gap-1">
              {items.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.07,
                    ease: "easeOut",
                  }}
                  onClick={() => setActive(index)}
                  className={cn(
                    "flex flex-col px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 lg:flex-row lg:items-center lg:gap-4",
                    active === index
                      ? "ring-1 ring-foreground"
                      : "ring-1 ring-transparent",
                  )}
                >
                  <div className="flex flex-row items-center gap-4 w-full lg:contents">
                    <span
                      className={cn(
                        "size-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors duration-200",
                        active === index
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors duration-200",
                        active === index
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {active === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                        className="w-full overflow-hidden lg:hidden"
                      >
                        <Card className="w-full mt-3 overflow-hidden p-0 gap-0 aspect-4/3 relative">
                          <div className="absolute inset-0">
                            <FeatureMedia content={item.content} alt={item.alt} />
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block sticky top-10">
            <Card className="relative w-full aspect-4/3 overflow-hidden p-0 gap-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <FeatureMedia content={items[active].content} alt={items[active].alt} />
                </motion.div>
              </AnimatePresence>
            </Card>
            {items[active].alt && (
              <p className="mt-4 text-sm text-muted-foreground">{items[active].alt}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
