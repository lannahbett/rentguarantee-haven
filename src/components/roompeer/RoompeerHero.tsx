import React from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const RoompeerHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-secondary to-primary min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blueHeath rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Logo placeholder - using icon for now */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl inline-block">
              <Users size={64} className="text-white" />
            </div>
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your Perfect Flatmate
          </h1>
          
          <p className="font-body text-xl md:text-2xl mb-4 text-white/90 max-w-2xl mx-auto">
            Making it simple, stress-free, and pleasant to locate a compatible flatmate.
          </p>
          
          <p className="font-body text-lg md:text-xl mb-10 text-white/80 max-w-3xl mx-auto">
            Our mission is to provide a secure and easy-to-use platform that connects people looking for flatmates with compatible roommates, resulting in long-term and positive living experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/auth'}
              size="lg" 
              className="bg-white text-azul hover:bg-white/90 font-body font-semibold text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              Get Started
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10 font-body font-semibold text-lg px-8 py-6 rounded-full backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default RoompeerHero;
