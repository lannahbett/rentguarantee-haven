import React, { useEffect, useRef } from "react";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import RoompeerFooter from "@/components/roompeer/RoompeerFooter";
import FeedbackWidget from "@/components/roompeer/FeedbackWidget";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, MessageCircle, KeyRound, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const stepImages = [
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
];

const HowItWorksRoompeer = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const steps = [
    { number: "01", titleKey: "hiw.step1.title" as const, descKey: "hiw.step1.desc" as const, Icon: UserPlus, image: stepImages[0] },
    { number: "02", titleKey: "hiw.step2.title" as const, descKey: "hiw.step2.desc" as const, Icon: Search, image: stepImages[1] },
    { number: "03", titleKey: "hiw.step3.title" as const, descKey: "hiw.step3.desc" as const, Icon: MessageCircle, image: stepImages[2] },
    { number: "04", titleKey: "hiw.step4.title" as const, descKey: "hiw.step4.desc" as const, Icon: KeyRound, image: stepImages[3] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />

      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-body font-medium mb-6">
            {t("hiw.badge")}
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t("hiw.title")} <span className="text-primary">Works</span>
          </h1>
          <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl mx-auto">
            {t("hiw.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl space-y-20">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} t={t} />
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8">{t("hiw.diverse")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
            ].map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img src={src} alt="Diverse community member" className="w-full h-[200px] object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto text-center max-w-2xl relative z-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">{t("hiw.cta.title")}</h2>
          <p className="text-primary-foreground/90 font-body text-lg mb-8">{t("hiw.cta.subtitle")}</p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-background text-primary hover:bg-background/90 font-body font-semibold rounded-full px-8"
          >
            {t("hiw.cta.button")}
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </section>

      <RoompeerFooter />
      <FeedbackWidget />
    </div>
  );
};

const StepCard = ({ step, index, t }: { step: any; index: number; t: (key: any) => string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-12");
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="opacity-0 translate-y-12 transition-all duration-700 ease-out" style={{ transitionDelay: `${index * 150}ms` }}>
      <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}>
        <div className="w-full md:w-1/2 group">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src={step.image} alt={t(step.titleKey)} className="w-full h-[280px] md:h-[340px] object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground font-heading font-bold text-xl px-4 py-2 rounded-lg shadow-lg">
              {step.number}
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
            <step.Icon size={28} className="text-primary-foreground" />
          </div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t(step.titleKey)}</h3>
          <p className="text-muted-foreground font-body leading-relaxed text-lg">{t(step.descKey)}</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksRoompeer;
