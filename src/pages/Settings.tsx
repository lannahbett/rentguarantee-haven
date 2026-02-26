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
  MessageSquare,
  Flag,
  Star
} from "lucide-react";
import { toast } from "sonner";

// Import the EditProfile content
import EditProfile from "./EditProfile";

const Settings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);
  
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
    { id: "profile", label: "Profile", icon: User },
    { id: "discovery", label: "Discovery Preferences", icon: SettingsIcon },
    { id: "security", label: "Account Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "feedback", label: "Feedback & Reports", icon: MessageSquare },
    { id: "help", label: "Help & Support", icon: HelpCircle },
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
          <h1 className="font-heading text-3xl font-bold text-[#232323] mb-8">Settings</h1>

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
                  <h2 className="font-heading text-xl font-bold text-[#232323] mb-6">Edit Profile</h2>
                  <EditProfile embedded />
                </div>
              )}

              {activeTab === "discovery" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-[#232323] mb-4">Discovery Preferences</h2>
                  <p className="text-muted-foreground font-body mb-4">
                    Configure your matching preferences to find the perfect flatmate.
                  </p>
                  <Button
                    onClick={() => navigate("/discovery-settings")}
                    className="bg-azul hover:bg-azul/90 text-white font-body"
                  >
                    Open Discovery Settings
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="font-heading text-xl font-bold text-[#232323] mb-4 flex items-center gap-2">
                      <Key size={20} className="text-azul" />
                      Change Password
                    </h2>
                    
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="font-body">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="font-body"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="font-body">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="font-body"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="font-body">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="font-body"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={changingPassword}
                        className="bg-azul hover:bg-azul/90 text-white font-body"
                      >
                        {changingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </form>

                    <div className="mt-4 pt-4 border-t border-border">
                      <Button
                        variant="link"
                        onClick={() => navigate("/forgot-password")}
                        className="text-blue-heath hover:text-azul font-body p-0"
                      >
                        Forgot your password? Reset it here
                      </Button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="font-heading text-xl font-bold text-[#232323] mb-4 flex items-center gap-2">
                      <Smartphone size={20} className="text-azul" />
                      Two-Factor Authentication
                    </h2>
                    <p className="text-muted-foreground font-body mb-4">
                      Add an extra layer of security to your account.
                    </p>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-body font-semibold text-foreground">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground font-body">Coming soon</p>
                      </div>
                      <Switch disabled />
                    </div>
                  </div>

                  {/* Connected Sessions */}
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="font-heading text-xl font-bold text-[#232323] mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-azul" />
                      Connected Sessions
                    </h2>
                    <p className="text-muted-foreground font-body mb-4">
                      Manage your active sessions across devices.
                    </p>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-body font-semibold text-foreground">Current Session</p>
                          <p className="text-sm text-muted-foreground font-body">This device • Active now</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-body">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-[#232323] mb-6 flex items-center gap-2">
                    <Bell size={20} className="text-azul" />
                    Notification Preferences
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: "matches", label: "New Matches", desc: "Get notified when someone matches with you" },
                      { id: "messages", label: "Messages", desc: "Receive notifications for new messages" },
                      { id: "likes", label: "Likes", desc: "Know when someone likes your profile" },
                      { id: "updates", label: "Product Updates", desc: "Stay informed about new features" },
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
                  <h2 className="font-heading text-xl font-bold text-[#232323] mb-4 flex items-center gap-2">
                    <CreditCard size={20} className="text-azul" />
                    Billing & Subscription
                  </h2>
                  <p className="text-muted-foreground font-body mb-4">
                    Manage your subscription and payment methods.
                  </p>
                  <Button
                    onClick={() => navigate("/roompeer-billing")}
                    className="bg-azul hover:bg-azul/90 text-white font-body"
                  >
                    View Billing Details
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-[#232323] mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-azul" />
                    Privacy Settings
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: "visibility", label: "Profile Visibility", desc: "Make your profile visible to other users" },
                      { id: "online", label: "Show Online Status", desc: "Let others see when you're active" },
                      { id: "read", label: "Read Receipts", desc: "Show when you've read messages" },
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
                    <h3 className="font-heading text-lg font-bold text-[#232323] mb-4">Legal</h3>
                    <div className="space-y-2">
                      <Button
                        variant="link"
                        onClick={() => navigate("/roompeer-privacy-policy")}
                        className="text-azul hover:underline font-body p-0 h-auto"
                      >
                        Privacy Policy
                      </Button>
                      <br />
                      <Button
                        variant="link"
                        onClick={() => navigate("/terms-of-use")}
                        className="text-azul hover:underline font-body p-0 h-auto"
                      >
                        Terms of Service
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "feedback" && <FeedbackReportsTab />}

              {activeTab === "help" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <HelpCircle size={20} className="text-azul" />
                    Help & Support
                  </h2>
                  
                  <div className="space-y-4">
                    <a 
                      href="/how-it-works-roompeer"
                      className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-body font-semibold text-foreground">How Roompeer Works</p>
                      <p className="text-sm text-muted-foreground font-body">Learn about finding flatmates</p>
                    </a>
                    <a 
                      href="/safety-trust"
                      className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-body font-semibold text-foreground">Safety Guidelines</p>
                      <p className="text-sm text-muted-foreground font-body">Tips for safe meetups</p>
                    </a>
                    <a 
                      href="mailto:roompeer@gmail.com"
                      className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <p className="font-body font-semibold text-foreground">Contact Support</p>
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


// Feedback & Reports Tab Component
const FeedbackReportsTab = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [concerns, setConcerns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"feedback" | "concerns">("feedback");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [feedbackRes, concernsRes] = await Promise.all([
      supabase.from("feedback").select("*").order("created_at", { ascending: false }),
      supabase.from("concerns").select("*").order("created_at", { ascending: false }),
    ]);
    setFeedbacks(feedbackRes.data || []);
    setConcerns(concernsRes.data || []);
    setLoading(false);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "reviewed": return "bg-blue-100 text-blue-700";
      case "resolved": return "bg-green-100 text-green-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-azul" />
          My Feedback & Reports
        </h2>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeSubTab === "feedback" ? "default" : "outline"}
            onClick={() => setActiveSubTab("feedback")}
            size="sm"
            className="font-body rounded-full"
          >
            <Star size={14} className="mr-1" /> Feedback ({feedbacks.length})
          </Button>
          <Button
            variant={activeSubTab === "concerns" ? "default" : "outline"}
            onClick={() => setActiveSubTab("concerns")}
            size="sm"
            className="font-body rounded-full"
          >
            <Flag size={14} className="mr-1" /> Concerns ({concerns.length})
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : activeSubTab === "feedback" ? (
          feedbacks.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No feedback submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= fb.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-body">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {fb.comment && <p className="text-sm text-foreground font-body">{fb.comment}</p>}
                  {fb.page_url && <p className="text-xs text-muted-foreground font-body mt-1">Page: {fb.page_url}</p>}
                </div>
              ))}
            </div>
          )
        ) : (
          concerns.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No concerns reported yet.</p>
          ) : (
            <div className="space-y-3">
              {concerns.map((c) => (
                <div key={c.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-body font-semibold capitalize text-foreground">
                      {c.category.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-body ${statusColor(c.status)}`}>
                        {c.status}
                      </span>
                      <span className="text-xs text-muted-foreground font-body">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground font-body">{c.description}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Settings;
