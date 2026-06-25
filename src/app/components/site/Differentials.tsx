import {
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Feather,
  Clock,
} from "lucide-react";
import { DIFFERENTIALS } from "../../data/site";
import { Reveal, SectionLabel } from "./primitives";

const ICONS = [
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Feather,
  Clock,
];

export function Differentials() {
  return (
    <section className="relative bg-secondary/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="max-w-2xl">
          <Reveal>
            <SectionLabel>Por que o estúdio</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.2rem)] leading-[1.06] text-espresso">
              Detalhes que fazem toda a{" "}
              <span className="italic text-gradient-gold">diferença</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFERENTIALS.map((d, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={d.title} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(46,37,32,0.4)]">
                  <div className="glow-champagne pointer-events-none absolute -right-10 -top-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative grid size-12 place-items-center rounded-xl bg-secondary text-gold transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="relative mt-5 font-display text-xl text-espresso">
                    {d.title}
                  </h3>
                  <p className="relative mt-2 leading-relaxed text-espresso/60">
                    {d.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
