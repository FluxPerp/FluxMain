"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsTicker from "@/components/StatsTicker";
import Architecture from "@/components/Architecture";
import TerminalSection from "@/components/TerminalSection";
import ComparisonTable from "@/components/ComparisonTable";
import Backers from "@/components/Backers";
import CTABottom from "@/components/CTABottom";
import Footer from "@/components/Footer";
import PreloadScreen from "@/components/PreloadScreen";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 1600);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-bg">
      <AnimatePresence onExitComplete={() => setIntroReady(true)}>
        {loading && <PreloadScreen />}
      </AnimatePresence>
      <Navbar />
      <main>
        <Hero introReady={introReady} />
        <StatsTicker />
        <Architecture />
        <TerminalSection />
        <ComparisonTable />
        <Backers />
        <CTABottom />
      </main>
      <Footer />
    </div>
  );
}
