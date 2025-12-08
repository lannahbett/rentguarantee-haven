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

const freeFeatures = [
  "Create your profile",
  "10 daily swipes",
  "Basic location & budget filters",
  "Match & message",
  "Standard customer support",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Unlimited swipes",
  "See who likes you",
  "Advanced filters (lifestyle, habits, interests)",
  "Profile boost (get more visibility)",
  "Read receipts",
  "Incognito mode",
  "Priority support",
];

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription anytime without hassle.",
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes! Students get 20% off Roompeer Pro. Contact us with your student ID.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and Apple/Google Pay.",
  },
];

const RoompeerPricing = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Pricing - Roompeer"
        description="Simple, transparent pricing. Start for free, upgrade to unlock powerful features for finding your perfect flatmate."
      />
      <RoompeerNavbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-youngNight mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="font-body text-lg text-youngNight/70 max-w-2xl mx-auto">
              Start for free, upgrade to unlock powerful features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Free Plan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-youngNight mb-2">
                Free Forever
              </h2>
              <div className="mb-6">
                <span className="font-heading text-4xl font-bold text-youngNight">€0</span>
                <span className="font-body text-youngNight/60">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-azul flex-shrink-0 mt-0.5" />
                    <span className="font-body text-youngNight/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  className="w-full font-body border-youngNight text-youngNight hover:bg-youngNight hover:text-white"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border-2 border-azul rounded-2xl p-8 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-azul text-white font-body text-sm font-semibold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-youngNight mb-2">
                Roompeer Pro
              </h2>
              <div className="mb-2">
                <span className="font-heading text-4xl font-bold text-youngNight">€9.99</span>
                <span className="font-body text-youngNight/60">/month</span>
              </div>
              <p className="font-body text-sm text-blueHeath mb-6">
                €89.99/year (Save 25%)
              </p>
              <ul className="space-y-4 mb-8">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-azul flex-shrink-0 mt-0.5" />
                    <span className="font-body text-youngNight/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <Button className="w-full font-body bg-azul hover:bg-azul/90 text-white">
                  Start 7-Day Free Trial
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-youngNight text-center mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="font-body text-youngNight text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-youngNight/70">
                    {faq.answer}
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
