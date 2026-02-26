import React from "react";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import RoompeerHero from "@/components/roompeer/RoompeerHero";
import MissionVision from "@/components/roompeer/MissionVision";
import CoreValues from "@/components/roompeer/CoreValues";
import FinalCTA from "@/components/roompeer/FinalCTA";
import RoompeerFooter from "@/components/roompeer/RoompeerFooter";
import FeedbackWidget from "@/components/roompeer/FeedbackWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      <RoompeerHero />
      <MissionVision />
      <CoreValues />
      <FinalCTA />
      <RoompeerFooter />
      <FeedbackWidget />
    </div>
  );
};

export default Index;
