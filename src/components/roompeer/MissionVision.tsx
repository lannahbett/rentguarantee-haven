import React from "react";
import { Target, Eye } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const MissionVision = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl border border-primary/10">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Eye size={32} />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-4 text-foreground">
                {t("mv.vision")}
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                {t("mv.visionDesc")}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-secondary/5 to-primary/5 p-8 rounded-2xl border border-secondary/10">
              <div className="bg-secondary text-secondary-foreground w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Target size={32} />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-4 text-foreground">
                {t("mv.mission")}
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                {t("mv.missionDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
