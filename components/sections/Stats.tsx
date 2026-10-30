"use client";

import { useEffect, useRef, useState } from "react";
import { WaveEdge } from "@/components/decor/WaveEdge";

type StatItem = {
  prefix: string;
  value: number;
  suffix: string;
  label: string;
  color: "corail" | "pervenche" | "moutarde" | "rose" | "vert-sauge";
};

const colorMap: Record<StatItem["color"], string> = {
  corail: "text-corail",
  pervenche: "text-pervenche",
  moutarde: "text-moutarde",
  rose: "text-rose",
  "vert-sauge": "text-vert-sauge",
};

function CountUp({ target, started }: { target: number; started: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);
  return <>{count}</>;
}

const defaultStats: StatItem[] = [
  { prefix: "", value: 200, suffix: "+", label: "jeunes sensibilisés", color: "corail" },
  { prefix: "", value: 15, suffix: "", label: "interventions réalisées", color: "pervenche" },
  { prefix: "", value: 3, suffix: "", label: "établissements partenaires", color: "moutarde" },
  { prefix: "", value: 1, suffix: "", label: "championne au cœur du projet", color: "rose" },
];

type StatsProps = { stats?: StatItem[] };

export function Stats({ stats = defaultStats }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-brun">
      <WaveEdge fillClassName="fill-creme" position="top" className="-mt-px" />
      <section ref={ref} className="px-5 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center font-display text-title font-extrabold uppercase text-creme">
            En chiffres
          </h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const textColor = colorMap[stat.color] ?? "text-corail";
              return (
                <div key={i} className="flex flex-col items-center gap-2 rounded-card border-2 border-blanc/20 bg-blanc/10 p-6 text-center">
                  <div className={`stat-sticker font-display text-[clamp(3.5rem,8vw,6.5rem)] leading-none ${textColor}`}>
                    {stat.prefix}<CountUp target={stat.value} started={started} />{stat.suffix}
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-creme/80">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <WaveEdge fillClassName="fill-creme" position="bottom" className="-mb-px" />
    </div>
  );
}
