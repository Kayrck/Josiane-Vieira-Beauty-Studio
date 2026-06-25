import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { TESTIMONIALS } from "../../data/site";
import { Reveal, SectionLabel, Orb } from "./primitives";

export function Testimonials() {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    const id = setInterval(() => embla.scrollNext(), 6000);
    return () => {
      embla.off("select", onSelect);
      clearInterval(id);
    };
  }, [embla, onSelect]);

  return (
    <section
      id="depoimentos"
      className="relative overflow-hidden bg-secondary/60 py-24 md:py-32"
    >
      <Orb className="right-[-12%] top-1/3 size-[30rem]" variant="rose" />
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionLabel center>Depoimentos</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-espresso">
              Quem vive a experiência{" "}
              <span className="italic text-gradient-gold">se apaixona</span>.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div className="mt-14 overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.name}
                  className="min-w-0 flex-[0_0_100%] px-2 md:flex-[0_0_70%] lg:flex-[0_0_55%]"
                >
                  <div
                    className={`relative h-full rounded-[1.6rem] border border-border bg-card p-8 transition-all duration-500 md:p-10 ${
                      selected === i ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <Quote className="size-9 text-gold/40" />
                    <div className="mt-3 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="size-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="mt-5 font-display text-[1.35rem] leading-relaxed text-espresso md:text-[1.6rem]">
                      “{t.text}”
                    </p>
                    <div className="mt-7 flex items-center gap-4">
                      <div className="size-14 overflow-hidden rounded-full bg-champagne-soft">
                        <ImageWithFallback
                          src={t.image}
                          alt={`Foto de ${t.name}`}
                          className="size-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-espresso">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={() => embla?.scrollPrev()}
            aria-label="Anterior"
            className="grid size-11 place-items-center rounded-full border border-espresso/20 text-espresso transition-colors hover:bg-espresso hover:text-primary-foreground"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => embla?.scrollTo(i)}
                aria-label={`Ir para depoimento ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  selected === i ? "w-7 bg-gold" : "w-1.5 bg-espresso/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => embla?.scrollNext()}
            aria-label="Próximo"
            className="grid size-11 place-items-center rounded-full border border-espresso/20 text-espresso transition-colors hover:bg-espresso hover:text-primary-foreground"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
