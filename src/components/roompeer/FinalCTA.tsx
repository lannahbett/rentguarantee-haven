import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const FinalCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-blueHeath rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles size={20} className="text-white" />
            <span className="font-body text-white font-medium">{t("cta.badge")}</span>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          
          <p className="font-heading text-5xl md:text-6xl font-bold text-white mb-10">
            {t("cta.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.location.href = '/auth'} size="lg" className="bg-white text-azul hover:bg-white/90 font-body font-semibold text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all group">
              {t("cta.signUp")}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'} size="lg" variant="outline" className="border-2 border-white hover:bg-white/10 font-body font-semibold text-lg px-10 py-6 rounded-full backdrop-blur-sm text-primary">
              {t("cta.explore")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
