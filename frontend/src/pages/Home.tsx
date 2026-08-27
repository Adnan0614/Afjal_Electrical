import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustMarquee from "@/components/TrustMarquee";
import ServicesBento from "@/components/ServicesBento";
import CostEstimator from "@/components/CostEstimator";
import RoiCalculator from "@/components/RoiCalculator";
import BeforeAfterShowcase from "@/components/BeforeAfterShowcase";
import JobTrackerView from "@/components/JobTrackerView";
import ServiceCoverage from "@/components/ServiceCoverage";
import LicensesCompliance from "@/components/LicensesCompliance";
import ReviewsSection from "@/components/ReviewsSection";
import EmergencyDispatchModal from "@/components/EmergencyDispatchModal";
import CompanyBrochureModal from "@/components/CompanyBrochureModal";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";

export default function Home() {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenTracker = () => scrollTo("tracker");
  const handleOpenLicenses = () => scrollTo("licenses");
  const handleSelectService = () => scrollTo("estimator");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar
        onOpenEmergency={() => setEmergencyOpen(true)}
        onOpenTracker={handleOpenTracker}
        onOpenBrochure={() => setBrochureOpen(true)}
        onOpenLicenses={handleOpenLicenses}
      />

      <main>
        <Hero
          onOpenEmergency={() => setEmergencyOpen(true)}
          onOpenTracker={handleOpenTracker}
          onOpenLicenses={handleOpenLicenses}
        />
        <TrustMarquee />
        <ServicesBento onSelectService={handleSelectService} />
        <CostEstimator />
        <RoiCalculator />
        <BeforeAfterShowcase />
        <JobTrackerView />
        <ServiceCoverage />
        <LicensesCompliance onOpenBrochure={() => setBrochureOpen(true)} />
        <ReviewsSection />
      </main>

      <Footer
        onOpenEmergency={() => setEmergencyOpen(true)}
        onOpenTracker={handleOpenTracker}
        onOpenBrochure={() => setBrochureOpen(true)}
        onOpenLicenses={handleOpenLicenses}
      />

      <FloatingActions
        onOpenEmergency={() => setEmergencyOpen(true)}
        onOpenLicenses={handleOpenLicenses}
      />

      <EmergencyDispatchModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
      <CompanyBrochureModal isOpen={brochureOpen} onClose={() => setBrochureOpen(false)} />

      <Toaster position="bottom-left" richColors />
    </div>
  );
}
