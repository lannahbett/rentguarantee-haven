import React from "react";
import { Shield, Users, Lightbulb, Heart, Globe } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We prioritize honesty and openness in every interaction, ensuring a safe and reliable platform for all users.",
  },
  {
    icon: Users,
    title: "User-Centered",
    description: "Your needs come first. We design every feature with our community's best interests in mind.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously improve and innovate to make flatmate finding easier, smarter, and more effective.",
  },
  {
    icon: Heart,
    title: "Community",
    description: "Building meaningful connections and fostering a supportive community of compatible flatmates.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making our platform available and easy to use for everyone, anywhere, at any time.",
  },
];

const CoreValues = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Our Core Values
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Roompeer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
                >
                  <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-3 text-foreground">
                    {value.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
