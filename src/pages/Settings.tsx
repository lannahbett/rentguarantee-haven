import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  CreditCard, 
  Lock,
  HelpCircle,
  Smartphone,
  Key,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

// Import the EditProfile content
import EditProfile from "./EditProfile";

const Settings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  const sidebarItems = [
    { id: "profile", label: t("settings.profile"), icon: User },
    { id: "discovery", label: t("settings.discovery"), icon: SettingsIcon },
    { id: "security", label: t("settings.security"), icon: Shield },
    { id: "notifications", label: t("settings.notifications"), icon: Bell },
    { id: "billing", label: t("settings.billing"), icon: CreditCard },
    { id: "privacy", label: t("settings.privacy"), icon: Lock },
    { id: "help", label: t("settings.help"), icon: HelpCircle },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoompeerNavbar />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-8">{t("settings.title")}</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <nav className="bg-card border border-border rounded-lg p-2 sticky top-24">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-body transition-colors ${
                      activeTab === item.id
                        ? "bg-azul/10 text-azul font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full flex-wrap h-auto gap-1 bg-card border border-border p-2">
                  {sidebarItems.map((item) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="font-body text-xs px-3 py-2 data-[state=active]:bg-azul data-[state=active]:text-white"
                    >
                      <item.icon size={14} className="mr-1" />
                      {item.label.split(" ")[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {activeTab === "profile" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-6">{t("settings.editProfile")}</h2>
                  <EditProfile embedded />
                </div>
              )}

              {activeTab === "discovery" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4">{t("settings.discovery")}</h2>
                  <p className="text-muted-foreground font-body mb-4">
                    {t("settings.discoveryDesc")}
                  </p>
                  <Button
                    onClick={() => navigate("/discovery-settings")}
                    className="bg-azul hover:bg-azul/90 text-white font-body"
                  >
                    {t("settings.openDiscovery")}
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Key size={20} className="text-azul" />
                      {t("settings.changePassword")}
                    </h2>
                    
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="font-body">{t("settings.currentPassword")}</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="font-body"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="font-body">{t("settings.newPassword")}</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="font-body"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="font-body">{t("settings.confirmPassword")}</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="font-body"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={changingPassword}
                        className="bg-azul hover:bg-azul/90 text-white font-body"
                      >
                        {changingPassword ? "Updating..." : t("settings.updatePassword")}
                      </Button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-border">
                      <Button
                        variant="link"
                        onClick={() => navigate("/forgot-password")}
                        className="text-blue-heath hover:text-azul font-body p-0"
                      >
                        {t("settings.forgotPassword")}
                      </Button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Smartphone size={20} className="text-azul" />
                      {t("settings.twoFactor")}
                    </h2>
                    <p className="text-muted-foreground font-body mb-4">
                      {t("settings.twoFactorDesc")}
                    </p>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-body font-semibold text-foreground">{t("settings.enable2FA")}</p>
                        <p className="text-sm text-muted-foreground font-body">{t("settings.comingSoon")}</p>
                      </div>
                      <Switch disabled />
                    </div>
                  </div>

                  {/* Connected Sessions */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-azul" />
                      {t("settings.connectedSessions")}
                    </h2>
                    <p className="text-muted-foreground font-body mb-4">
                      {t("settings.sessionsDesc")}
                    </p>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-body font-semibold text-foreground">{t("settings.currentSession")}</p>
                          <p className="text-sm text-muted-foreground font-body">{t("settings.activeNow")}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-body">
                          {t("settings.active")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Bell size={20} className="text-azul" />
                    {t("settings.notificationPrefs")}
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: "matches", label: t("settings.newMatches"), desc: t("settings.newMatchesDesc") },
                      { id: "messages", label: t("settings.messages"), desc: t("settings.messagesDesc") },
                      { id: "likes", label: t("settings.likes"), desc: t("settings.likesDesc") },
                      { id: "updates", label: t("settings.productUpdates"), desc: t("settings.productUpdatesDesc") },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-body font-semibold text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-azul" />
                    {t("settings.billing")}
                  </h2>
                  <p className="text-muted-foreground font-body mb-4">
                    {t("settings.billingDesc")}
                  </p>
                  <Button
                    onClick={() => navigate("/roompeer-billing")}
                    className="bg-azul hover:bg-azul/90 text-white font-body"
                  >
                    {t("settings.viewBilling")}
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-azul" />
                    {t("settings.privacySettings")}
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: "visibility", label: t("settings.profileVisibility"), desc: t("settings.profileVisibilityDesc") },
                      { id: "online", label: t("settings.showOnline"), desc: t("settings.showOnlineDesc") },
                      { id: "read", label: t("settings.readReceipts"), desc: t("settings.readReceiptsDesc") },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-body font-semibold text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">{t("settings.legal")}</h3>
                    <div className="space-y-2">
                      <Button
                        variant="link"
                        onClick={() => navigate("/roompeer-privacy-policy")}
                        className="text-azul hover:underline font-body p-0 h-auto"
                      >
                        {t("settings.privacyPolicy")}
                      </Button>
                      <br />
                      <Button
                        variant="link"
                        onClick={() => navigate("/terms-of-use")}
                        className="text-azul hover:underline font-body p-0 h-auto"
                      >
                        {t("settings.termsOfService")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "help" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <HelpCircle size={20} className="text-azul" />
                    {t("settings.help")}
                  </h2>
                  
                  <div className="space-y-4">
                    <a 
                      href="/how-it-works-roompeer"
                      className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-body font-semibold text-foreground">{t("settings.howItWorks")}</p>
                      <p className="text-sm text-muted-foreground font-body">{t("settings.howItWorksDesc")}</p>
                    </a>
                    <a 
                      href="/safety-trust"
                      className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-body font-semibold text-foreground">{t("settings.safetyGuidelines")}</p>
                      <p className="text-sm text-muted-foreground font-body">{t("settings.safetyGuidelinesDesc")}</p>
                    </a>
                    <a 
                      href="mailto:roompeer@gmail.com"
                      className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-body font-semibold text-foreground">{t("settings.contactSupport")}</p>
                      <p className="text-sm text-muted-foreground font-body">roompeer@gmail.com</p>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;