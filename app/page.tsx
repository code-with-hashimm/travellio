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
  return (
    <main className="min-h-screen bg-black text-white">
      <HackathonBanner />
      <Navbar />
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
