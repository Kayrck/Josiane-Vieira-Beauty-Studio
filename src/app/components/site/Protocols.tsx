import { Clock, CalendarCheck, ShieldAlert, Check } from "lucide-react";
import { Reveal, SectionLabel, Orb } from "./primitives";

const ATENDIMENTO = [
  "Tolerância de atraso de 10 minutos — após esse período será necessário remarcar.",
  "Mensagens respondidas a partir das 07h00.",
  "A escolha da técnica deve ser feita antes do atendimento.",
  "Remarcações com no mínimo 3 dias de antecedência.",
];

const RESERVA = [
  "Confirmação da reserva mediante pagamento de 50% do valor.",
  "Confirmação final realizada um dia antes do atendimento.",
  "Sem resposta na confirmação, o horário é cancelado automaticamente.",
  "Em caso de desistência, não há reembolso do sinal.",
  "Aviso mínimo de 48 horas para cancelamentos.",
];

export function Protocols() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <Orb className="left-[-10%] bottom-0 size-[28rem] opacity-60" />
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionLabel center>Protocolos</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-espresso">
              Cuidado e organização para a{" "}
              <span className="italic text-gradient-gold">sua experiência</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <PolicyCard
              icon={<Clock className="size-5" />}
              title="Atendimento"
              items={ATENDIMENTO}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <PolicyCard
              icon={<CalendarCheck className="size-5" />}
              title="Reserva & confirmação"
              items={RESERVA}
            />
          </Reveal>
        </div>

        {/* Important info */}
        <Reveal delay={0.12}>
          <div className="glass-dark relative mt-6 overflow-hidden rounded-[1.6rem] p-8 text-primary-foreground md:p-12">
            <div className="glow-rose pointer-events-none absolute -right-10 -top-10 size-48 rounded-full opacity-40 blur-3xl" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-champagne">
                <ShieldAlert className="size-7" />
              </div>
              <div>
                <p className="tracking-luxe text-[10px] uppercase text-champagne">
                  Informação importante
                </p>
                <h3 className="mt-2 font-display text-2xl md:text-[1.8rem]">
                  A remoção dos cílios é obrigatória após o período indicado.
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-white/70">
                  Esse cuidado preserva os fios naturais, evita danos e mantém a
                  saúde ocular — garantindo que o seu olhar continue lindo e
                  saudável a cada nova aplicação.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PolicyCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="h-full rounded-[1.6rem] border border-border bg-card p-8">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-secondary text-gold">
          {icon}
        </span>
        <h3 className="font-display text-2xl text-espresso">{title}</h3>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-espresso/70">
            <Check className="mt-0.5 size-4 shrink-0 text-gold" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
