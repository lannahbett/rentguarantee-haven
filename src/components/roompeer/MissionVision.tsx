import React from "react";
import { Target, Eye } from "lucide-react";

const MissionVision = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl border border-primary/10">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Eye size={32} />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-4 text-foreground">
                Our Vision
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Making it simple, stress-free, and pleasant to locate a compatible flatmate. We envision a world where finding the perfect roommate is as easy as connecting with a friend.
              </p>
            </div>
            
            {/* Mission */}
            <div className="bg-gradient-to-br from-secondary/5 to-primary/5 p-8 rounded-2xl border border-secondary/10">
              <div className="bg-secondary text-secondary-foreground w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Target size={32} />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-4 text-foreground">
                Our Mission
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Our mission is to provide a secure and easy-to-use platform that connects people looking for flatmates with compatible roommates, resulting in long-term and positive living experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
