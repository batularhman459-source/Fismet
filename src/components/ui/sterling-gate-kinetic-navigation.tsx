import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { setScrollLocked } from "@/lib/scroll-lock";
import { CustomEase } from "gsap/CustomEase";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

export interface KineticNavLink {
  label: string;
  href: string;
}

export interface KineticNavigationProps {
  /** Text-Logo (wird genutzt, wenn kein logoSrc gesetzt ist) */
  logo?: string;
  /** Bild-Logo (z. B. PNG mit transparentem Hintergrund) */
  logoSrc?: string;
  logoHref?: string;
  links?: KineticNavLink[];
  /** Kleine Zeile unten im Menü (z. B. E-Mail) */
  meta?: React.ReactNode;
  /** Kleiner Hinweis neben dem Menü-Button (leer = ausgeblendet) */
  hint?: string;
  menuLabel?: string;
  closeLabel?: string;
  /** Header ausblenden (z. B. während des Ladebildschirms) */
  hidden?: boolean;
}

const DEFAULT_LINKS: KineticNavLink[] = [
  { label: "Über uns", href: "#studio" },
  { label: "Projekte", href: "#projekte" },
  { label: "Leistungen", href: "#leistungen" },
  { label: "Team", href: "#team" },
  { label: "Kontakt", href: "#kontakt" },
];

// Alle Regeln sind unter .sg-nav gescopet, damit nichts mit Tailwind kollidiert.
const NAV_CSS = `
.sg-nav {
  --sg-ink: #0b0b0a;
  --sg-cream: #e1e0cc;
  --sg-accent: #1c57e1;
  --sg-container-padding: clamp(1rem, 2.6vw, 2.25rem);
  --sg-cubic: cubic-bezier(0.65, 0.05, 0, 1);
}
.sg-nav p { margin: 0; }

/* Header: liegt fix oben; mix-blend-difference hält ihn auf hellen und dunklen Sektionen lesbar */
.sg-nav .site-header-wrapper {
  position: fixed; inset: 0 0 auto 0; z-index: 60; pointer-events: none;
  color: var(--sg-cream);
  transition: opacity .6s ease, transform .6s var(--sg-cubic);
}
/* Menü-Button rechts: mix-blend-difference hält ihn auf hellen und dunklen Sektionen lesbar */
.sg-nav .menu-layer { z-index: 61; mix-blend-mode: difference; left: auto; }
/* Logo links: eigene Ebene ohne Blend, damit die Logo-Farben echt bleiben */
.sg-nav .logo-layer { right: auto; }
.sg-nav .site-header-wrapper[data-hidden="true"] { opacity: 0; transform: translateY(-100%); }
.sg-nav .header .container { padding: 1.1rem var(--sg-container-padding); }
.sg-nav .nav-row { display: flex; align-items: center; justify-content: space-between; }
.sg-nav .nav-logo-row {
  pointer-events: auto; color: inherit; text-decoration: none; display: flex; align-items: center;
  font-size: 1.35rem; font-weight: 600; letter-spacing: -0.05em; line-height: 1;
}
.sg-nav .nav-logo-chip {
  padding: .45rem .8rem; border-radius: 999px;
  background: rgba(11, 11, 10, .82); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(225, 224, 204, .08);
}
.sg-nav .nav-logo-row img { display: block; height: 1.9rem; width: auto; transition: transform .5s var(--sg-cubic); }
.sg-nav .nav-logo-row:hover img { transform: translateX(.15rem) skewX(-6deg); }
@media (max-width: 640px) { .sg-nav .nav-logo-row img { height: 1.6rem; } }
.sg-nav .nav-logo-row sup { font-size: .55em; margin-left: .05em; }
.sg-nav .nav-row__left { display: flex; align-items: center; gap: 1.25rem; }
.sg-nav .nav-toggle-label {
  font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 10.5px;
  letter-spacing: .2em; text-transform: uppercase; opacity: .55; user-select: none;
}
@media (max-width: 640px) { .sg-nav .nav-toggle-label { display: none; } }
.sg-nav .nav-close-btn {
  display: flex; align-items: center; gap: .6rem; background: none; border: 0; padding: .25rem 0;
  color: inherit; cursor: pointer; font: inherit;
}
.sg-nav .menu-button-text { height: 1.2em; overflow: hidden; font-size: 1rem; font-weight: 500; }
.sg-nav .menu-button-text p { line-height: 1.2em; }
.sg-nav .icon-wrap { width: .95rem; height: .95rem; display: flex; }
.sg-nav .nav-close-btn:focus-visible { outline: 1px solid currentColor; outline-offset: 4px; }

/* Vollbild-Menü */
.sg-nav .nav-overlay-wrapper { display: none; position: fixed; inset: 0; z-index: 55; }
.sg-nav .overlay { position: absolute; inset: 0; background: rgba(11, 11, 10, .55); cursor: pointer; }
.sg-nav .menu-content {
  position: absolute; top: 0; right: 0; bottom: 0; width: min(38rem, 100%);
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 6.5rem var(--sg-container-padding) 2rem;
}
.sg-nav .menu-bg { position: absolute; inset: 0; overflow: hidden; }
.sg-nav .backdrop-layer { position: absolute; inset: 0; background: var(--sg-cream); }
.sg-nav .backdrop-layer.first { background: #2a2a26; }
.sg-nav .backdrop-layer.second { background: var(--sg-accent); }
.sg-nav .ambient-background-shapes { position: absolute; inset: 0; pointer-events: none; }
.sg-nav .bg-shape { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; }
.sg-nav .bg-shape.active { opacity: 1; }
.sg-nav .shape-element { transform-box: fill-box; transform-origin: center; }

.sg-nav .menu-content-wrapper { position: relative; z-index: 1; }
.sg-nav .menu-list { list-style: none; margin: 0; padding: 0; }
.sg-nav .menu-list-item { overflow: hidden; }
.sg-nav .nav-link { position: relative; display: block; color: var(--sg-ink); text-decoration: none; padding: .05em 0; }
.sg-nav .nav-link-text {
  position: relative; z-index: 1; display: flex; align-items: baseline; gap: .5em;
  font-size: clamp(2.6rem, 6.2vw, 4.75rem); font-weight: 500; letter-spacing: -0.055em; line-height: 1.08;
  transition: transform .55s var(--sg-cubic);
}
.sg-nav .nav-link-num {
  font-family: ui-monospace, Menlo, Consolas, monospace; font-size: .75rem; letter-spacing: .1em;
  font-weight: 400; opacity: .45; transform: translateY(-1.4em);
}
.sg-nav .nav-link-hover-bg {
  position: absolute; inset: 0; background: rgba(11, 11, 10, .06); border-radius: .3rem;
  transform: scaleY(0); transform-origin: bottom; transition: transform .55s var(--sg-cubic);
}
.sg-nav .nav-link:hover .nav-link-text, .sg-nav .nav-link:focus-visible .nav-link-text { transform: translateX(.3em); }
.sg-nav .nav-link:hover .nav-link-hover-bg, .sg-nav .nav-link:focus-visible .nav-link-hover-bg { transform: scaleY(1); }
.sg-nav .nav-link:focus-visible { outline: none; }

.sg-nav .menu-meta {
  position: relative; z-index: 1; display: flex; flex-wrap: wrap; justify-content: space-between; gap: .75rem;
  color: var(--sg-ink); font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
}
.sg-nav .menu-meta a { color: inherit; }
`;

export function Component({
  logo = "Fismet",
  logoSrc,
  logoHref = "#studio",
  links = DEFAULT_LINKS,
  meta,
  hint = "",
  menuLabel = "Menu",
  closeLabel = "Close",
  hidden = false,
}: KineticNavigationProps) {
  // We need a ref for the parent container to scope GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initial Setup & Hover Effects
  useEffect(() => {
    if (!containerRef.current) return;

    // Create custom easing
    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
      }
      gsap.defaults({ ease: "main", duration: 0.7 });
    } catch (e) {
      console.warn("CustomEase failed to load, falling back to default.", e);
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      // Shape hover: each menu item shows its own ambient shape in the panel
      const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;
        if (!shape) return;
        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          }
          shape.classList.add("active");
          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" },
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, [links.length]);

  // Menu Open/Close Animation Effect
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current!.querySelector(".nav-overlay-wrapper");
      const menu = containerRef.current!.querySelector(".menu-content");
      const overlay = containerRef.current!.querySelector(".overlay");
      const bgPanels = containerRef.current!.querySelectorAll(".backdrop-layer");
      const menuLinks = containerRef.current!.querySelectorAll(".nav-link");
      const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");

      const menuButton = containerRef.current!.querySelector(".nav-close-btn");
      const menuButtonTexts = menuButton?.querySelectorAll("p");
      const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");

      const tl = gsap.timeline();

      if (isMenuOpen) {
        // OPEN
        if (navWrap) navWrap.setAttribute("data-nav", "open");

        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(menuButtonTexts ?? [], { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
          .fromTo(menuButtonIcon ?? [], { rotate: 0 }, { rotate: 315 }, "<")
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
          .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35");

        if (fadeTargets.length) {
          tl.fromTo(
            fadeTargets,
            { autoAlpha: 0, yPercent: 50 },
            { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" },
            "<+=0.2",
          );
        }
      } else {
        // CLOSE
        if (navWrap) navWrap.setAttribute("data-nav", "closed");

        tl.to(overlay, { autoAlpha: 0 })
          .to(menu, { xPercent: 120 }, "<")
          .to(menuButtonTexts ?? [], { yPercent: 0 }, "<")
          .to(menuButtonIcon ?? [], { rotate: 0 }, "<")
          .set(navWrap, { display: "none" });
      }
    }, containerRef);

    // Only stop the running timeline; reverting would snap the open menu shut
    // before the close animation can play.
    return () => ctx.kill();
  }, [isMenuOpen]);

  // Escape schließt das Menü, und die Seite scrollt nicht, solange es offen ist
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    setScrollLocked("menu", isMenuOpen);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      setScrollLocked("menu", false);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef} className="sg-nav">
      <style>{NAV_CSS}</style>
      <div className="site-header-wrapper menu-layer" data-hidden={hidden ? "true" : "false"}>
        <header className="header">
          <div className="container is--full">
            <nav className="nav-row" aria-label="Hauptnavigation">
              <div className="nav-row__left">
                <button
                  type="button"
                  className="nav-close-btn"
                  onClick={toggleMenu}
                  aria-expanded={isMenuOpen}
                  aria-label={isMenuOpen ? closeLabel : menuLabel}
                  style={{ pointerEvents: "auto" }}
                >
                  <div className="menu-button-text">
                    <p className="p-large">{menuLabel}</p>
                    <p className="p-large">{closeLabel}</p>
                  </div>
                  <div className="icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none" className="menu-button-icon">
                      <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                      <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
                      <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor"></path>
                      <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor"></path>
                      <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor"></path>
                      <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor"></path>
                    </svg>
                  </div>
                </button>
                {hint ? (
                  <div className="nav-toggle-label" onClick={toggleMenu} style={{ cursor: "pointer", pointerEvents: "auto" }}>
                    <span className="toggle-text">{hint}</span>
                  </div>
                ) : null}
              </div>
            </nav>
          </div>
        </header>
      </div>

      <div className="site-header-wrapper logo-layer" data-hidden={hidden ? "true" : "false"}>
        <div className="header">
          <div className="container is--full">
            <a href={logoHref} aria-label="Startseite" className="nav-logo-row" onClick={closeMenu}>
              {logoSrc ? (
                <img src={logoSrc} alt={logo} />
              ) : (
                <>
                  {logo}
                  <sup>*</sup>
                </>
              )}
            </a>
          </div>
        </div>
      </div>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content" aria-label="Menü">
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              {/* Abstrakte Formen, je eine pro Menüpunkt (Fismet-Farben) */}
              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(45,125,251,0.18)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(11,11,10,0.07)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(45,125,251,0.12)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(11,11,10,0.08)" />
                </svg>

                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                  <path className="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(45,125,251,0.2)" strokeWidth="60" fill="none" />
                  <path className="shape-element" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(11,11,10,0.07)" strokeWidth="40" fill="none" />
                </svg>

                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                  {[
                    [50, 50, 8], [150, 50, 8], [250, 50, 8], [350, 50, 8],
                    [100, 150, 12], [200, 150, 12], [300, 150, 12],
                    [50, 250, 10], [150, 250, 10], [250, 250, 10], [350, 250, 10],
                    [100, 350, 6], [200, 350, 6], [300, 350, 6],
                  ].map(([cx, cy, r], i) => (
                    <circle
                      key={i}
                      className="shape-element"
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={i % 2 ? "rgba(11,11,10,0.14)" : "rgba(45,125,251,0.35)"}
                    />
                  ))}
                </svg>

                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                  <path
                    className="shape-element"
                    d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                    fill="rgba(45,125,251,0.16)"
                  />
                  <path
                    className="shape-element"
                    d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                    fill="rgba(11,11,10,0.07)"
                  />
                </svg>

                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none" preserveAspectRatio="xMidYMid slice">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(45,125,251,0.18)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(11,11,10,0.06)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(45,125,251,0.12)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {links.map((link, i) => (
                  <li key={link.href + link.label} className="menu-list-item" data-shape={(i % 5) + 1}>
                    <a href={link.href} className="nav-link" onClick={closeMenu}>
                      <p className="nav-link-text">
                        <span className="nav-link-num">{String(i + 1).padStart(2, "0")}</span>
                        {link.label}
                      </p>
                      <div className="nav-link-hover-bg"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {meta ? (
              <div className="menu-meta" data-menu-fade>
                {meta}
              </div>
            ) : null}
          </nav>
        </div>
      </section>
    </div>
  );
}

export default Component;
