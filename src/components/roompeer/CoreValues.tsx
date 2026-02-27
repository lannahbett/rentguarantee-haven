import React from "react";
import { Shield, Users, Lightbulb, Heart, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const CoreValues = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Shield, titleKey: "cv.trust" as const, descKey: "cv.trustDesc" as const },
    { icon: Users, titleKey: "cv.userCentered" as const, descKey: "cv.userCenteredDesc" as const },
    { icon: Lightbulb, titleKey: "cv.innovation" as const, descKey: "cv.innovationDesc" as const },
    { icon: Heart, titleKey: "cv.community" as const, descKey: "cv.communityDesc" as const },
    { icon: Globe, titleKey: "cv.accessibility" as const, descKey: "cv.accessibilityDesc" as const },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {t("cv.title")}
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("cv.subtitle")}
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
                    {t(value.titleKey)}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {t(value.descKey)}
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
