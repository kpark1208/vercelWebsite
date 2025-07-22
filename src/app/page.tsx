"use client";
import { AboutCarousel } from "@/components/about/AboutCarousel";
import { HeroMain } from "@/components/home/HeroMain";
import { HeroAnimated } from "@/components/home/HeroAnimated";
import { HeroBoxes } from "@/components/home/HeroBoxes";
import HeroCreative from "@/components/home/HeroCreative";
import { HeroStats } from "@/components/home/HeroStats";
import { Boxes } from "@/components/aceternity/background-boxes";
import { Particles } from "@/components/magicui/particles";
import { Divider } from "@/components/home/Divider";

import Link from "next/link";


export default function Home() {
  return (
    <>
      <HeroBoxes />
      <Divider />
      <HeroStats />
    </>
  );
}
