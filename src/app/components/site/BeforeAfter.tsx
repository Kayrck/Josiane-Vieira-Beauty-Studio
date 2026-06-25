import { useRef, useState, useCallback, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { IMAGES } from "../../data/site";
import { Reveal, SectionLabel, BookButton, Orb } from "./primitives";

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const update = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, next)));
  }, []);

  return (
    <section
      id="resultados"
      className="relative overflow-hidden bg-secondary/60 py-24 md:py-32"
    >
      <Orb className="left-[-10%] top-10 size-[28rem]" />
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionLabel center>Antes & Depois</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-espresso">
              Arraste e veja a{" "}
              <span className="italic text-gradient-gold">transformação</span>.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div
            ref={containerRef}
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              update(e.clientX);
            }}
            onPointerMove={(e) => dragging.current && update(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerLeave={() => (dragging.current = false)}
            className="relative mx-auto mt-12 aspect-[16/10] w-full max-w-4xl cursor-ew-resize touch-none select-none overflow-hidden rounded-[1.8rem] bg-champagne-soft shadow-[0_40px_90px_-40px_rgba(46,37,32,0.5)]"
          >
            {/* After (full) */}
            <ImageWithFallback
              src={IMAGES.beforeAfterAfter}
              alt="Olhar após a extensão de cílios"
              className="absolute inset-0 size-full object-cover"
            />
            <span className="absolute bottom-4 right-4 rounded-full bg-primary/85 px-3 py-1 text-[11px] text-primary-foreground">
              Depois
            </span>

            {/* Before (clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${pos}%` }}
            >
              <ImageWithFallback
                src={IMAGES.beforeAfterBefore}
                alt="Olhar antes da extensão de cílios"
                className="absolute inset-0 h-full max-w-none object-cover grayscale-[0.2]"
                style={{ width: width || "100%" }}
              />
              <span className="glass absolute bottom-4 left-4 rounded-full px-3 py-1 text-[11px] text-espresso">
                Antes
              </span>
            </div>

            {/* Handle */}
            <div
              className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]"
              style={{ left: `${pos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-espresso shadow-xl">
                <MoveHorizontal className="size-5" />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <p className="max-w-md text-espresso/60">
              Resultados naturais, marcantes e feitos sob medida para realçar a
              sua expressão.
            </p>
            <BookButton message="Olá! Quero esse resultado no meu olhar. Vamos agendar?">
              Quero meu resultado
            </BookButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
