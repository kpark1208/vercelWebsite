"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useRef } from "react";
import { getAllProjects } from "@/lib/projects";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";

// Helper to parse duration string to hours
function parseDurationToHours(duration: string): number {
  if (!duration) return 0;
  const lower = duration.toLowerCase();
  const num = parseFloat(lower);
  if (lower.includes('month')) return num * 30 * 10; // 30 days/month, 10 hours/day
  if (lower.includes('week')) return num * 7 * 10; // 7 days/week, 10 hours/day
  if (lower.includes('day')) return num * 10; // 10 hours/day
  if (lower.includes('hour')) return num;
  return 0;
}

const HeroStats = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [uniqueTechs, setUniqueTechs] = useState(0);
  const [displayProjects, setDisplayProjects] = useState(0);
  const [displayHours, setDisplayHours] = useState(0);
  const [displayTechs, setDisplayTechs] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    async function fetchStats() {
      const projects = await getAllProjects();
      setTotalProjects(projects.length);
      setTotalHours(projects.reduce((sum, p) => sum + parseDurationToHours(p.duration), 0));
      const techSet = new Set<string>();
      projects.forEach(p => p.technologies.forEach(t => techSet.add(t)));
      setUniqueTechs(techSet.size);
    }
    fetchStats();
  }, []);

  // Animate numbers when in view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  // Roll-up animation for numbers
  useEffect(() => {
    if (!inView) return;
    const projTarget = totalProjects;
    const hoursTarget = Math.round(totalHours);
    const techsTarget = uniqueTechs;
    const duration = 1000; // ms
    const steps = 30;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDisplayProjects(Math.round((projTarget * step) / steps));
      setDisplayHours(Math.round((hoursTarget * step) / steps));
      setDisplayTechs(Math.round((techsTarget * step) / steps));
      if (step >= steps) {
        setDisplayProjects(projTarget);
        setDisplayHours(hoursTarget);
        setDisplayTechs(techsTarget);
        clearInterval(interval);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [inView, totalProjects, totalHours, uniqueTechs]);

  // Ensure displayHours updates if totalHours changes after animation
  useEffect(() => {
    if (displayHours !== Math.round(totalHours) && displayHours > 0) {
      setDisplayHours(Math.round(totalHours));
    }
  }, [totalHours, displayHours]);

  return (
    <section ref={ref} className="py-32 max-w-5xl mx-auto">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
              <Badge
                variant="outline"
                className="flex w-fit items-center gap-1"
              >
                Portfolio Stats
              </Badge>
              <h1 className="mb-5 text-4xl font-semibold text-pretty">
                My Coding Journey in Numbers
              </h1>
              <p className="text-muted-foreground">
                Explore my experience, dedication, and the technologies I've mastered through real-world projects.
              </p>
            </div>
            <div className="mt-12 flex justify-center gap-7 lg:justify-start">
              <Link href="/work" className="flex flex-col gap-1.5 group cursor-pointer">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={controls}
                  variants={{ visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold text-primary sm:text-3xl group-hover:scale-110 transition-transform"
                >
                  {displayProjects}+
                </motion.p>
                <p className="text-muted-foreground">Projects</p>
              </Link>
              <Separator orientation="vertical" className="h-auto" />
              <Link href="/work" className="flex flex-col gap-1.5 group cursor-pointer">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={controls}
                  variants={{ visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-bold text-primary sm:text-3xl group-hover:scale-110 transition-transform"
                >
                  {displayHours}+
                </motion.p>
                <p className="text-muted-foreground">Hours of Experience</p>
              </Link>
              <Separator orientation="vertical" className="h-auto" />
              <Link href="/work" className="flex flex-col gap-1.5 group cursor-pointer">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={controls}
                  variants={{ visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl font-bold text-primary sm:text-3xl group-hover:scale-110 transition-transform"
                >
                  {displayTechs}+
                </motion.p>
                <p className="text-muted-foreground">Technologies Used</p>
              </Link>
            </div>
          </div>
          <div className="grid gap-2.5 text-left sm:grid-cols-2 sm:text-center lg:text-left">
            {[
              {
                img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
                title: "Python-based Billiard Game",
                desc: "Python-based pool game with collision detection, friction modeling, and cue control using object-oriented programming.",
                link: "/projects/traveling-salesman-problem-solver"
              },
              {
                img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-2.svg",
                title: "Web Development Project for Personal Website",
                desc: "A full-featured personal website using React and Next.js.",
                link: "/projects/euchre-card-game"
              }
              // {
              //   img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-3.svg",
              //   title: "Traveling Salesman Problem Solver",
              //   desc: "Explore advanced algorithms and data visualization in this TSP project.",
              //   link: "/projects/traveling-salesman-problem-solver"
              // },
              // {
              //   img: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-4.svg",
              //   title: "Euchre Card Game",
              //   desc: "Play Euchre online with friends or AI, featuring robust game logic.",
              //   link: "/projects/euchre-card-game"
              // }
            ].map((card, i) => (
              <Link
                key={i}
                href={card.link}
                className="flex items-center gap-5 rounded-lg border border-border bg-muted p-6 sm:flex-col sm:items-start sm:p-7 transition-transform hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={card.img}
                  alt="logo"
                  className="mx-0 size-12 sm:mx-auto lg:mx-0"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground sm:text-base">
                    {card.title}
                  </p>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {card.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { HeroStats };
