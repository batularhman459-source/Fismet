"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll-lock";

export interface ParallaxComponentProps {
  title?: string;
  /** Eigener Inhalt statt des Titel-Texts (z. B. animierter Schriftzug) */
  titleNode?: React.ReactNode;
  /** Bild-Ebenen von hinten nach vorne: back und middle hinter dem Titel, front davor (optional) */
  layers?: { back: string; middle: string; front?: string };
  /** Inhalt des zweiten Bildschirms unter dem Parallax-Header */
  children?: React.ReactNode;
  /** Weiches Scrollen (Lenis) für die ganze Seite einschalten */
  smoothScroll?: boolean;
  /** Animation des Titels erst starten, wenn true (z. B. nach dem Ladebildschirm) */
  ready?: boolean;
  id?: string;
}

export const DEFAULT_LAYERS = {
  back: "https://cdn.21st.dev/assets/mirror/a4/a43f4eae3459c461345ee676f12d6e1ddca65e8a5279a5af00d475b17ff83aea.webp",
  middle: "https://cdn.21st.dev/assets/mirror/50/50ca6a0d36d2780bfcb469d6db7eaec0be7e0d2961ba69a63d2a1473b040338d.webp",
  front: "https://cdn.21st.dev/assets/mirror/e1/e1c8137b5f971c3b3ec1a0f9e79b9c17018767005f844a10082b890472afecfb.webp",
};

const PARALLAX_CSS = `
.parallax { --px-bg: #0b0b0a; --px-ink: #e1e0cc; --px-pad: clamp(1rem, 3vw, 2.5rem); position: relative; background: var(--px-bg); }
.parallax__header {
  z-index: 2; position: relative; display: flex; align-items: center; justify-content: center;
  min-height: 100svh; padding: 4rem var(--px-pad);
}
.parallax__visuals { position: absolute; top: 0; left: 0; width: 100%; height: 120%; }
.parallax__black-line-overflow {
  z-index: 20; position: absolute; left: 0; bottom: -1px; width: 100%; height: 2px; background: var(--px-bg);
}
.parallax__layers { position: absolute; inset: 0; overflow: hidden; }
.parallax__layer-img {
  pointer-events: none; position: absolute; top: -17.5%; left: 0;
  width: 100%; max-width: none; height: 117.5%; object-fit: cover;
  will-change: transform;
}
.parallax__layer-title {
  position: absolute; top: 0; left: 0; width: 100%; height: 100svh;
  display: flex; align-items: center; justify-content: center;
}
.parallax__title {
  position: relative; margin: 0 .075em .1em 0; text-align: center;
  color: var(--px-ink); font-size: clamp(4.5rem, 19vw, 20rem); font-weight: 700;
  letter-spacing: -0.065em; line-height: 1;
  transition: opacity 1.1s cubic-bezier(.16,1,.3,1), transform 1.1s cubic-bezier(.16,1,.3,1);
}
.parallax__title[data-ready="false"] { opacity: 0; transform: translateY(12%); }
.parallax__title--custom { width: min(86vw, 78rem); margin: 0; }
/* Handy: Browser-Leisten überdecken den unteren Rand, daher optisch etwas höher setzen */
@media (max-width: 767px) { .parallax__title--custom { transform: translateY(-9svh); } }
.parallax__title sup { position: absolute; top: .18em; right: -.32em; font-size: .3em; letter-spacing: 0; }
.parallax__fade {
  z-index: 30; position: absolute; left: 0; bottom: 0; width: 100%; height: 20%;
  background-image: linear-gradient(transparent, var(--px-bg));
}
.parallax__content {
  position: relative; display: flex; align-items: center; justify-content: center;
  min-height: 100svh; padding: 6rem var(--px-pad); color: var(--px-ink);
}
`;

export function ParallaxComponent({
  title = "Fismet",
  titleNode,
  layers = DEFAULT_LAYERS,
  children,
  smoothScroll = true,
  ready = true,
  id,
}: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Parallax-Ebenen
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggerElement = parallaxRef.current?.querySelector("[data-parallax-layers]");
    if (!triggerElement) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: 0,
      },
    });

    const layerMoves = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 10 },
    ];

    layerMoves.forEach((layerObj, idx) => {
      tl.to(
        triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
        { yPercent: layerObj.yPercent, ease: "none" },
        idx === 0 ? undefined : "<",
      );
    });

    // Nur die eigene Timeline aufräumen, nicht alle ScrollTrigger der Seite
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Weiches Scrollen für die ganze Seite
  useEffect(() => {
    if (!smoothScroll) return;
    // läuft wie die anderen Animationen auch bei „Animationen reduzieren“
    const lenis = new Lenis({ anchors: true, respectReducedMotion: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    registerLenis(lenis);

    return () => {
      gsap.ticker.remove(tick);
      registerLenis(null);
      lenis.destroy();
    };
  }, [smoothScroll]);

  return (
    <div className="parallax" ref={parallaxRef} id={id}>
      <style>{PARALLAX_CSS}</style>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow"></div>
          <div data-parallax-layers className="parallax__layers">
            <img src={layers.back} loading="eager" width="800" data-parallax-layer="1" alt="" className="parallax__layer-img" />
            <img src={layers.middle} loading="eager" width="800" data-parallax-layer="2" alt="" className="parallax__layer-img" />
            <div data-parallax-layer="3" className="parallax__layer-title">
              {titleNode ? (
                <h1 className="parallax__title parallax__title--custom" aria-label={title}>
                  {titleNode}
                </h1>
              ) : (
                <h1 className="parallax__title" data-ready={ready ? "true" : "false"}>
                  {title}
                  <sup>*</sup>
                </h1>
              )}
            </div>
            {layers.front ? (
              <img src={layers.front} loading="eager" width="800" data-parallax-layer="4" alt="" className="parallax__layer-img" />
            ) : null}
          </div>
          <div className="parallax__fade"></div>
        </div>
      </section>
      <section className="parallax__content">{children}</section>
    </div>
  );
}

export default ParallaxComponent;
