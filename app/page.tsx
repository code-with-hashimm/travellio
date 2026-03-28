"use client";

import { useState, useEffect } from "react";
import { HackathonBanner } from "@/components/HackathonBanner";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemStatement } from "@/components/ProblemStatement";
import { HowItWorks } from "@/components/HowItWorks";
import { LiveDemoPreview } from "@/components/LiveDemoPreview";
import { About } from "@/components/About";
import { StatsBar } from "@/components/StatsBar";
import { Experience } from "@/components/Experience";
import { Destinations } from "@/components/Destinations";
import { Tours } from "@/components/Tours";
import { WhyUs } from "@/components/WhyUs";
import { TechStack } from "@/components/TechStack";
import { Testimonials } from "@/components/Testimonials";
import { Blogs } from "@/components/Blogs";
import { FAQ } from "@/components/FAQ";
import { Stories } from "@/components/Stories";
import { Footer } from "@/components/Footer";

export default function Page() {
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBannerVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <HackathonBanner visible={bannerVisible} onClose={() => setBannerVisible(false)} />
      <Navbar bannerVisible={bannerVisible} />
      <Hero />
      <ProblemStatement />
      <HowItWorks />
      <LiveDemoPreview />
      <About />
      <StatsBar />
      <Experience />
      <Destinations />
      <Tours />
      <WhyUs />
      <TechStack />
      <Testimonials />
      <Blogs />
      <FAQ />
      <Stories />
      <Footer />
    </main>
  );
}
