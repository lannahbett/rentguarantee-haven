import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import RoompeerFooter from "@/components/roompeer/RoompeerFooter";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, MessageCircle, KeyRound, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Tell us about yourself, your lifestyle, and what you're looking for in a flatmate. Share your habits, interests, and preferences to help us find your perfect match.",
    Icon: UserPlus,
  },
  {
    number: "02",
    title: "Find Your Match",
    description: "Use our smart filters to find compatible flatmates in your desired area. Browse through profiles, check compatibility scores, and discover people who share your living style.",
    Icon: Search,
  },
  {
    number: "03",
    title: "Connect & Chat",
    description: "Safely message your matches to get to know them better. Ask questions, share more about yourself, and build trust before making any commitments.",
    Icon: MessageCircle,
  },
  {
    number: "04",
    title: "Move In!",
    description: "Finalize the details and start your positive living experience. Once you've found the right match, take the next step towards your new home together.",
    Icon: KeyRound,
  },
];

const HowItWorksRoompeer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#232323] mb-6">
            How Roompeer Works
          </h1>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            Finding your perfect flatmate has never been easier. Follow these simple steps 
            to start your journey towards a harmonious living experience.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-8 bg-azul text-white font-heading font-bold text-xl px-4 py-2 rounded-lg">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="mt-4 mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-azul to-blue-heath rounded-2xl">
                    <step.Icon size={32} className="text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="font-heading text-2xl font-bold text-[#232323] mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {step.description}
                </p>

                {/* Connector for desktop */}
                {index < steps.length - 1 && index % 2 === 0 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight size={24} className="text-azul" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Timeline for Mobile */}
      <section className="py-8 px-6 md:hidden">
        <div className="container mx-auto max-w-md">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-azul" />
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-azul/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-azul to-blue-heath">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Flatmate?
          </h2>
          <p className="text-white/90 font-body text-lg mb-8">
            Join thousands of people who have found their ideal living situation through Roompeer.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-white text-azul hover:bg-white/90 font-body font-semibold rounded-full px-8"
          >
            Get Started Today
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </section>

      <RoompeerFooter />
    </div>
  );
};

export default HowItWorksRoompeer;
