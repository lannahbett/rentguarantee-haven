import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import RoompeerFooter from "@/components/roompeer/RoompeerFooter";
import ReportConcernDialog from "@/components/roompeer/ReportConcernDialog";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  MessageSquareLock, 
  BookOpen, 
  Flag, 
  CheckCircle2, 
  Heart,
  Users,
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const SafetyTrust = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const safetyFeatures = [
    { Icon: ShieldCheck, titleKey: "safety.profileVerification" as const, descKey: "safety.profileVerificationDesc" as const },
    { Icon: MessageSquareLock, titleKey: "safety.secureMessaging" as const, descKey: "safety.secureMessagingDesc" as const },
    { Icon: BookOpen, titleKey: "safety.communityGuidelines" as const, descKey: "safety.communityGuidelinesDesc" as const },
    { Icon: Flag, titleKey: "safety.reportingSystem" as const, descKey: "safety.reportingSystemDesc" as const },
  ];

  const trustPrinciples = [
    { Icon: Heart, titleKey: "safety.respect" as const, descKey: "safety.respectDesc" as const },
    { Icon: Users, titleKey: "safety.communityFirst" as const, descKey: "safety.communityFirstDesc" as const },
    { Icon: Lock, titleKey: "safety.dataPrivacy" as const, descKey: "safety.dataPrivacyDesc" as const },
  ];

  const commitments = [
    "safety.commitment1" as const,
    "safety.commitment2" as const,
    "safety.commitment3" as const,
    "safety.commitment4" as const,
    "safety.commitment5" as const,
  ];

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-blue-heath/5 to-transparent">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-azul to-blue-heath rounded-2xl mb-6">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("safety.heroTitle")}
          </h1>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            {t("safety.heroDesc")}
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">
            {t("safety.featuresTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyFeatures.map((feature) => (
              <div key={feature.titleKey} className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-heath/10 rounded-xl flex items-center justify-center">
                    <feature.Icon size={28} className="text-blue-heath" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-muted-foreground font-body leading-relaxed">{t(feature.descKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">{t("safety.trustTitle")}</h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">{t("safety.trustDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustPrinciples.map((principle) => (
              <div key={principle.titleKey} className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-heath/10 rounded-full mb-4">
                  <principle.Icon size={24} className="text-blue-heath" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{t(principle.titleKey)}</h3>
                <p className="text-sm text-muted-foreground font-body">{t(principle.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-azul/5 to-blue-heath/5 border border-blue-heath/20 rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">{t("safety.commitmentTitle")}</h2>
            <div className="space-y-4">
              {commitments.map((key, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-azul flex-shrink-0 mt-0.5" />
                  <p className="text-foreground font-body">{t(key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">{t("safety.reportTitle")}</h2>
          <p className="text-muted-foreground font-body mb-8">{t("safety.reportDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/auth")} className="bg-azul hover:bg-azul/90 text-white font-body font-semibold rounded-full px-8">
              {t("safety.getStartedSafely")}
            </Button>
            <ReportConcernDialog />
          </div>
        </div>
      </section>

      <RoompeerFooter />
    </div>
  );
};

export default SafetyTrust;
