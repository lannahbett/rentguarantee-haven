import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Globe, Linkedin, Shield, Cookie, Home, HelpCircle, DollarSign } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const RoompeerFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-youngNight text-youngNight-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
                <img src="/roompeer-logo.png" alt="Roompeer" className="h-8 w-8 rounded-lg" />
                Roompeer
              </h3>
              <p className="font-body text-white/70 mb-4 max-w-md">
                {t("footer.tagline")}
              </p>
            </div>
            
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">{t("footer.quickLinks")}</h4>
              <div className="space-y-3">
                <Link to="/browse-match" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body">
                  <Home size={16} /> <span>{t("footer.home")}</span>
                </Link>
                <Link to="/how-it-works-roompeer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body">
                  <HelpCircle size={16} /> <span>{t("nav.howItWorks")}</span>
                </Link>
                <Link to="/roompeer-pricing" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body">
                  <DollarSign size={16} /> <span>{t("nav.pricing")}</span>
                </Link>
                <Link to="/safety-trust" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body">
                  <Shield size={16} /> <span>{t("nav.safety")}</span>
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">{t("footer.legal")}</h4>
              <div className="space-y-3">
                <Link to="/roompeer-privacy-policy" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body">
                  <Shield size={16} /> <span>{t("footer.privacyPolicy")}</span>
                </Link>
                <Link to="/cookie-policy" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body">
                  <Cookie size={16} /> <span>{t("footer.cookiePolicy")}</span>
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">{t("footer.contactUs")}</h4>
              <div className="space-y-3">
                <a href="https://chat.whatsapp.com/KHbEDVHvQzWIO7r1k9s4zl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body">
                  <MessageCircle size={18} /> <span>WhatsApp</span>
                </a>
                <a href="https://roompeer.lovable.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body">
                  <Globe size={18} /> <span>roompeer.lovable.app</span>
                </a>
                <a href="https://www.linkedin.com/company/roompeer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body">
                  <Linkedin size={18} /> <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-white/60 text-sm">
              © {new Date().getFullYear()} Roompeer. {t("footer.rights")}
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/roompeer-privacy-policy" className="text-white/60 hover:text-white transition-colors font-body">
                {t("footer.privacy")}
              </Link>
              <Link to="/cookie-policy" className="text-white/60 hover:text-white transition-colors font-body">
                {t("footer.cookies")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RoompeerFooter;
