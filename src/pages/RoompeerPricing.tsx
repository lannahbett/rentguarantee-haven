import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import RoompeerFooter from "@/components/roompeer/RoompeerFooter";
import SEOHelmet from "@/components/seo/SEOHelmet";
import { useLanguage } from "@/i18n/LanguageContext";

const RoompeerPricing = () => {
  const { t } = useLanguage();

  const freeFeatureKeys = [
    "pricing.free1" as const,
    "pricing.free2" as const,
    "pricing.free3" as const,
    "pricing.free4" as const,
    "pricing.free5" as const,
  ];

  const proFeatureKeys = [
    "pricing.pro1" as const,
    "pricing.pro2" as const,
    "pricing.pro3" as const,
    "pricing.pro4" as const,
    "pricing.pro5" as const,
    "pricing.pro6" as const,
    "pricing.pro7" as const,
    "pricing.pro8" as const,
  ];

  const faqs = [
    { qKey: "pricing.faq1q" as const, aKey: "pricing.faq1a" as const },
    { qKey: "pricing.faq2q" as const, aKey: "pricing.faq2a" as const },
    { qKey: "pricing.faq3q" as const, aKey: "pricing.faq3a" as const },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Pricing - Roompeer"
        description="Simple, transparent pricing. Start for free, upgrade to unlock powerful features for finding your perfect flatmate."
      />
      <RoompeerNavbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-youngNight mb-4">
              {t("pricing.title")}
            </h1>
            <p className="font-body text-lg text-youngNight/70 max-w-2xl mx-auto">
              {t("pricing.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-youngNight mb-2">
                {t("pricing.free")}
              </h2>
              <div className="mb-6">
                <span className="font-heading text-4xl font-bold text-youngNight">€0</span>
                <span className="font-body text-youngNight/60">{t("pricing.perMonth")}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {freeFeatureKeys.map((key, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-azul flex-shrink-0 mt-0.5" />
                    <span className="font-body text-youngNight/80">{t(key)}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <Button variant="outline" className="w-full font-body border-youngNight text-youngNight hover:bg-youngNight hover:text-white">
                  {t("pricing.getStarted")}
                </Button>
              </Link>
            </div>

            <div className="bg-white border-2 border-azul rounded-2xl p-8 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-azul text-white font-body text-sm font-semibold px-4 py-1 rounded-full">
                  {t("pricing.mostPopular")}
                </span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-youngNight mb-2">
                {t("pricing.pro")}
              </h2>
              <div className="mb-2">
                <span className="font-heading text-4xl font-bold text-youngNight">€9.99</span>
                <span className="font-body text-youngNight/60">{t("pricing.perMonth")}</span>
              </div>
              <p className="font-body text-sm text-blueHeath mb-6">
                {t("pricing.perYear")}
              </p>
              <ul className="space-y-4 mb-8">
                {proFeatureKeys.map((key, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-azul flex-shrink-0 mt-0.5" />
                    <span className="font-body text-youngNight/80">{t(key)}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <Button className="w-full font-body bg-azul hover:bg-azul/90 text-white">
                  {t("pricing.startTrial")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-youngNight text-center mb-8">
              {t("pricing.faqTitle")}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="font-body text-youngNight text-left">
                    {t(faq.qKey)}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-youngNight/70">
                    {t(faq.aKey)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>

      <RoompeerFooter />
    </div>
  );
};

export default RoompeerPricing;
