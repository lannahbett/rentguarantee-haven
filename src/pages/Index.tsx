import React, { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ErrorBoundary from "@/components/performance/ErrorBoundary";

// Lazy-loaded components with better chunk names
const Features = lazy(() => import("@/components/Features"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const GuaranteeSection = lazy(() => import("@/components/GuaranteeSection"));
const HiddenCostsSection = lazy(() => import("@/components/HiddenCostsSection"));
const PackagesSection = lazy(() => import("@/components/PackagesSection"));
const FAQSection = lazy(() => import("@/components/faq/FAQSection"));
const ROICalculator = lazy(() => import("@/components/ROICalculator"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const CallToAction = lazy(() => import("@/components/CallToAction"));

// Optimized loading component
const SectionLoader = () => (
  <div className="py-16 flex justify-center items-center">
    <div className="critical-spinner"></div>
  </div>
);

// Error fallback for sections
const SectionErrorFallback = ({ sectionName }: { sectionName: string }) => (
  <div className="py-16 flex justify-center items-center bg-gray-50">
    <div className="text-center">
      <p className="text-gray-600">Unable to load {sectionName} section</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-[var(--theme-primary)] text-white rounded"
      >
        Retry
      </button>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <Hero />
        
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="Hidden Costs" />}>
          <Suspense fallback={<SectionLoader />}>
            <HiddenCostsSection />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="Guarantee" />}>
          <Suspense fallback={<SectionLoader />}>
            <GuaranteeSection />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="Features" />}>
          <Suspense fallback={<SectionLoader />}>
            <Features />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="How It Works" />}>
          <Suspense fallback={<SectionLoader />}>
            <HowItWorks />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="ROI Calculator" />}>
          <Suspense fallback={<SectionLoader />}>
            <ROICalculator />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="Packages" />}>
          <Suspense fallback={<SectionLoader />}>
            <PackagesSection />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="Testimonials" />}>
          <Suspense fallback={<SectionLoader />}>
            <Testimonials />
          </Suspense>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<SectionErrorFallback sectionName="FAQ" />}>
          <Suspense fallback={<SectionLoader />}>
            <FAQSection />
          </Suspense>
        </ErrorBoundary>
        
        <div id="property-inquiry-form">
          <ErrorBoundary fallback={<SectionErrorFallback sectionName="Contact Form" />}>
            <Suspense fallback={<SectionLoader />}>
              <CallToAction />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        <Footer />
      </div>
      
      {/* WhatsApp floating button */}
      <WhatsAppButton />
    </div>
  );
};

export default Index;
