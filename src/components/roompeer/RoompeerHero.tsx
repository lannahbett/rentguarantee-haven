import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const peopleImages = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
];

const RoompeerHero = () => {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const animate = () => {
      if (scrollRef1.current) {
        scrollRef1.current.scrollTop += 0.5;
        if (scrollRef1.current.scrollTop >= scrollRef1.current.scrollHeight / 2) {
          scrollRef1.current.scrollTop = 0;
        }
      }
      if (scrollRef2.current) {
        scrollRef2.current.scrollTop -= 0.5;
        if (scrollRef2.current.scrollTop <= 0) {
          scrollRef2.current.scrollTop = scrollRef2.current.scrollHeight / 2;
        }
      }
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  const ImageColumn = ({ images, scrollRef, className = "" }: { images: string[]; scrollRef: React.RefObject<HTMLDivElement>; className?: string }) => (
    <div ref={scrollRef} className={`overflow-hidden h-[500px] md:h-[600px] w-[140px] md:w-[180px] ${className}`} style={{ scrollbarWidth: 'none' }}>
      <div className="flex flex-col gap-4">
        {[...images, ...images].map((src, i) => (
          <div key={i} className="rounded-2xl overflow-hidden shadow-xl flex-shrink-0">
            <img src={src} alt="Diverse flatmate" className="w-full h-[200px] md:h-[240px] object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative bg-background min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-body font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {t("hero.badge")}
            </div>

            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-[1.1] text-foreground">
              {t("hero.title1")}
              <span className="block text-primary">{t("hero.title2")}</span>
            </h1>

            <p className="font-body text-lg md:text-xl mb-8 text-muted-foreground max-w-xl leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => window.location.href = '/auth'}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all group"
              >
                {t("hero.getStarted")}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                onClick={() => window.location.href = '/how-it-works-roompeer'}
                size="lg"
                variant="outline"
                className="border-2 border-primary/20 hover:bg-primary/5 text-foreground font-body font-semibold text-lg px-8 py-6 rounded-full"
              >
                {t("hero.howItWorks")}
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                {peopleImages.slice(0, 4).map((src, i) => (
                  <img key={i} src={src} alt="" className="w-10 h-10 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-body">
                <span className="font-semibold text-foreground">300+</span> {t("hero.matched")}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex gap-4 items-center">
            <ImageColumn images={peopleImages.slice(0, 4)} scrollRef={scrollRef1} />
            <ImageColumn images={peopleImages.slice(4, 8)} scrollRef={scrollRef2} className="mt-20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoompeerHero;
