"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Boxes } from "@/components/aceternity/background-boxes";
// import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { Button } from "@/components/ui/button";

const fadeInSeq = `
  @keyframes fadeInUp1 {
    0% { opacity: 0; transform: translateY(40px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp2 {
    0%, 40% { opacity: 0; transform: translateY(40px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp3 {
    0%, 70% { opacity: 0; transform: translateY(40px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .fadeInUp1 { animation: fadeInUp1 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.1s both; }
  .fadeInUp2 { animation: fadeInUp2 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.5s both; }
  .fadeInUp3 { animation: fadeInUp3 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.9s both; }
`;

export const Hero223 = () => {
  return (
    <section className="py-32 max-w-5xl mx-auto">
      <style>{fadeInSeq}</style>
      <div className="relative container flex h-150 w-full flex-col items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-background [mask-image:radial-gradient(transparent,white)]" />
        <Boxes className="scale-150" />
        <h1 className="relative z-99 max-w-4xl text-center md:text-7xl text-5xl font-normal tracking-normal leading-tight md:leading-[1.1]">
          <div className="fadeInUp1 mb-4 md:mb-6">Hi, I am</div>
          <div className="fadeInUp2 font-extrabold md:text-8xl text-6xl mb-4 md:mb-6">Hyeonjae Park</div>
          <div className="fadeInUp3 font-semibold text-primary md:text-6xl text-4xl mb-2 md:mb-4">Your Software Developer.</div>
        </h1>
        <p className="relative z-99 mt-4 max-w-xl text-center text-lg text-muted-foreground">
          CMU.
        </p>
        <div className="realtive z-99 mt-10 flex items-center justify-center gap-4">
          <Button
            variant="default"
            className="group text-md flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
          >
            <span>Download CV</span>
            <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
          </Button>
          <Button
            variant="secondary"
            className="group text-md flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
          >
            <span>Contact Me</span>
            <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { Hero223 as HeroBoxes };
