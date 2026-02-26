import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Heart, MessageCircle, Settings, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const RoompeerNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2">
            <img src="/roompeer-logo.png" alt="Roompeer Logo" className="h-10 w-10 rounded-lg" />
            <span className="font-heading text-2xl font-bold text-foreground">Roompeer</span>
          </a>
          
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <a href="/browse-match" className="font-body text-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Heart size={16} /> {t("nav.browse")}
                </a>
                <a href="/matches" className="font-body text-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <MessageCircle size={16} /> {t("nav.matches")}
                </a>
                <a href="/profile" className="font-body text-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <User size={16} /> {t("nav.profile")}
                </a>
                <a href="/settings" className="font-body text-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Settings size={16} /> {t("nav.settings")}
                </a>
                <LanguageSwitcher />
                <Button onClick={handleLogout} variant="outline" className="font-body font-semibold rounded-full">
                  <LogOut size={16} className="mr-1" /> {t("nav.logout")}
                </Button>
              </>
            ) : (
              <>
                <a href="/how-it-works-roompeer" className="font-body text-foreground hover:text-primary transition-colors">
                  {t("nav.howItWorks")}
                </a>
                <a href="/safety-trust" className="font-body text-foreground hover:text-primary transition-colors">
                  {t("nav.safety")}
                </a>
                <a href="/roompeer-pricing" className="font-body text-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <DollarSign size={16} /> {t("nav.pricing")}
                </a>
                <LanguageSwitcher />
                <Button onClick={() => navigate('/auth')} className="bg-azul hover:bg-azul/90 text-white font-body font-semibold rounded-full">
                  {t("nav.signUp")}
                </Button>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button className="text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {isLoggedIn ? (
                <>
                  <a href="/browse-match" className="font-body text-foreground hover:text-primary transition-colors py-2 flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <Heart size={16} /> {t("nav.browse")}
                  </a>
                  <a href="/matches" className="font-body text-foreground hover:text-primary transition-colors py-2 flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <MessageCircle size={16} /> {t("nav.matches")}
                  </a>
                  <a href="/profile" className="font-body text-foreground hover:text-primary transition-colors py-2 flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <User size={16} /> {t("nav.profile")}
                  </a>
                  <a href="/settings" className="font-body text-foreground hover:text-primary transition-colors py-2 flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <Settings size={16} /> {t("nav.settings")}
                  </a>
                  <Button onClick={() => { handleLogout(); setIsMenuOpen(false); }} variant="outline" className="font-body font-semibold rounded-full w-full">
                    <LogOut size={16} className="mr-1" /> {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <>
                  <a href="/how-it-works-roompeer" className="font-body text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                    {t("nav.howItWorks")}
                  </a>
                  <a href="/safety-trust" className="font-body text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                    {t("nav.safety")}
                  </a>
                  <a href="/roompeer-pricing" className="font-body text-foreground hover:text-primary transition-colors py-2 flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                    <DollarSign size={16} /> {t("nav.pricing")}
                  </a>
                  <Button onClick={() => { navigate('/auth'); setIsMenuOpen(false); }} className="bg-azul hover:bg-azul/90 text-white font-body font-semibold rounded-full w-full">
                    {t("nav.signUp")}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default RoompeerNavbar;
