import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { waLink } from "../../data/site";

export function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating WhatsApp — desktop & mobile */}
      <motion.a
        href={waLink("Olá! Vim pelo site e gostaria de agendar um horário.")}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 16 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-24 right-5 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_18px_40px_-12px_rgba(46,37,32,0.6)] md:bottom-7 md:right-7"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
        <MessageCircle className="relative size-6" />
      </motion.a>

      {/* Mobile sticky booking bar */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-3 z-40 lg:hidden"
          >
            <a
              href={waLink("Olá! Gostaria de agendar meu horário.")}
              target="_blank"
              rel="noreferrer"
              className="glass-dark flex items-center justify-between rounded-full px-5 py-3.5 text-primary-foreground shadow-[0_18px_40px_-12px_rgba(46,37,32,0.6)]"
            >
              <span className="font-display text-lg">Agende seu olhar</span>
              <span className="rounded-full bg-white px-4 py-1.5 text-sm text-espresso">
                Agendar
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
