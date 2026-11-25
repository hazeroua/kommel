"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";

const PILLS = [
  { label: "Judo", color: "bg-corail", deg: -3 },
  { label: "Confiance", color: "bg-pervenche", deg: 2 },
  { label: "Émancipation", color: "bg-moutarde", deg: -1 },
  { label: "Sport", color: "bg-rose", deg: 3 },
  { label: "Inspiration", color: "bg-vert-sauge", deg: -2 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 20%, rgba(243,143,181,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(138,151,236,0.13) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-30 pb-16 sm:px-8 sm:pt-36 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pb-24">
        <div>
          <div className="mb-6 flex flex-wrap gap-2 sm:gap-3" aria-hidden="true">
            {PILLS.map((pill, i) => (
              <motion.span
                key={pill.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, rotate: pill.deg }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                className={`${pill.color} inline-block rounded-pill border-2 border-brun px-4 py-1 font-display text-sm font-bold uppercase text-brun shadow-dure`}
              >
                {pill.label}
              </motion.span>
            ))}
          </div>

          <motion.h1
            className="font-display text-hero font-extrabold uppercase leading-[0.88] text-brun"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Révéler
            <br />
            <span className="text-corail">la force</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-lead text-brun/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Pour que chaque jeune fille puisse se dire : <em>moi aussi, je peux réussir.</em>{" "}
            KOM&apos;MEL accompagne les jeunes vers l&apos;émancipation par le sport et
            l&apos;éducation.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/nous-soutenir" className="btn btn-primary">
              Nous soutenir
            </Link>
            <Link href="/actions" className="link-feutre font-bold text-brun">
              Découvrir nos actions →
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0, rotate: 2 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -top-6 -right-4 z-10 rotate-12 rounded-pill border-2 border-brun bg-moutarde px-4 py-2 font-display text-xs font-extrabold uppercase text-brun shadow-dure"
            >
              ⭐ Championne
            </div>
            <Image
              src="/images/melkia-dojo.jpg"
              alt="Melkia Auchecorne en kimono, ceinture noire, sur le tatami"
              width={900}
              height={1352}
              priority
              sizes="(min-width: 1024px) 400px, 320px"
              className="mx-auto aspect-[4/5] w-full max-w-[320px] rounded-card border-2 border-brun object-cover object-top shadow-dure-lg lg:max-w-[400px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
