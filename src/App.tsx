import { ArrowUpRight } from "lucide-react";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import { PrismaHero } from "@/components/ui/prisma-hero";
import StackSpread from "@/components/ui/stack-spread";

export default function App() {
  return (
    <main className="bg-ink">
      <div id="studio">
        <PrismaHero />
      </div>

      <PerspectiveTunnelHero />

      <StackSpread />

      {/* Platzhalter-Footer – Team & Kontakt */}
      <footer id="kontakt" className="px-4 py-20 sm:px-6 md:px-10 md:py-28">
        <div id="team" className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-primary/50">Kontakt</p>
            <h2 className="text-5xl font-medium leading-[0.9] tracking-[-0.05em] text-primary sm:text-7xl md:text-8xl">
              Lass uns was
              <br />
              bauen<span className="text-primary/40">.</span>
            </h2>
            <a
              href="mailto:hallo@fismet.de"
              className="group mt-10 inline-flex items-center gap-3 text-lg text-primary/80 transition-colors hover:text-primary sm:text-2xl"
            >
              hallo@fismet.de
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="flex flex-col justify-end gap-6 md:col-span-5">
            {[
              { name: "Pierre", role: "Design & Konzept" },
              { name: "Abderrahman", role: "Entwicklung & Technik" },
            ].map((p) => (
              <div key={p.name} className="flex items-baseline justify-between border-t border-primary/15 pt-4">
                <span className="text-2xl tracking-tight text-primary">{p.name}</span>
                <span className="text-sm text-primary/50">{p.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex flex-wrap justify-between gap-4 border-t border-primary/15 pt-6 text-xs text-primary/40">
          <span>© {new Date().getFullYear()} Fismet Webdesign</span>
          <span>Impressum · Datenschutz</span>
        </div>
      </footer>
    </main>
  );
}
