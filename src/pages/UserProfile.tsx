import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import QuickEditField from "@/components/profile/QuickEditField";
import EditProfile from "./EditProfile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  MessageCircle, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Home, 
  Briefcase,
  Sun,
  Moon,
  Cigarette,
  Sparkles,
  Users,
  Heart,
  Pencil,
  Eye,
  Edit,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  age: number | null;
  bio: string | null;
  occupation: string | null;
  hobbies: string[] | null;
  budget: number | null;
  desired_location: string | null;
  move_in_date: string | null;
  accommodation_type: string | null;
  early_riser: boolean;
  night_owl: boolean;
  smoker: boolean;
  cleanliness_level: string | null;
  guest_preferences: string | null;
  ideal_flatmate: string | null;
  show_budget?: boolean;
  show_location?: boolean;
  show_photos?: boolean;
  show_habits?: boolean;
}

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState("view");
  const { t } = useLanguage();

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, [id]);

  // Re-fetch profile when switching to "view" tab to reflect edits
  useEffect(() => {
    if (activeProfileTab === "view" && isOwnProfile) {
      checkAuthAndFetchProfile();
    }
  }, [activeProfileTab]);

  const checkAuthAndFetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    setCurrentUserId(session.user.id);

    try {
      const isViewingOther = !!id;
      let data: any = null;
      
      if (isViewingOther) {
        // Use profiles_public view for other users (no RLS restriction, no email exposed)
        // Try by profile id first, then by user_id for compatibility
        const { data: byId } = await supabase
          .from("profiles_public")
          .select("id, user_id, full_name, age, bio, occupation, hobbies, budget, desired_location, move_in_date, accommodation_type, early_riser, night_owl, smoker, cleanliness_level, guest_preferences, ideal_flatmate, profile_completed, has_pets, wants_pets, created_at, updated_at")
          .eq("id", id)
          .maybeSingle();
        
        if (byId) {
          data = byId;
        } else {
          // Matches page sends user_id as the param
          const { data: byUserId } = await supabase
            .from("profiles_public")
            .select("id, user_id, full_name, age, bio, occupation, hobbies, budget, desired_location, move_in_date, accommodation_type, early_riser, night_owl, smoker, cleanliness_level, guest_preferences, ideal_flatmate, profile_completed, has_pets, wants_pets, created_at, updated_at")
            .eq("user_id", id)
            .maybeSingle();
          data = byUserId;
        }
      } else {
        const { data: ownData, error } = await supabase
          .from("profiles")
          .select("id, user_id, full_name, email, age, bio, occupation, hobbies, budget, desired_location, move_in_date, accommodation_type, early_riser, night_owl, smoker, cleanliness_level, guest_preferences, ideal_flatmate, profile_completed, has_pets, wants_pets, show_budget, show_location, show_photos, show_habits, created_at, updated_at")
          .eq("user_id", session.user.id)
          .maybeSingle();
        if (error) throw error;
        data = ownData;
      }
      
      if (!data) {
        toast.error("Profile not found");
        navigate("/dashboard");
        return;
      }

      setProfile(data as any);
      const ownProfile = (data as any).user_id === session.user.id;
      setIsOwnProfile(ownProfile);
      
      if (ownProfile) {
        const tabParam = searchParams.get("tab");
        setActiveProfileTab(tabParam || "edit");
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSave = async (field: string, value: string) => {
    if (!profile || !isOwnProfile) return;

    try {
      const updateData: Record<string, any> = {};
      
      if (field === "budget") {
        updateData[field] = value ? parseFloat(value) : null;
      } else if (field === "age") {
        updateData[field] = value ? parseInt(value) : null;
      } else {
        updateData[field] = value || null;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("user_id", profile.user_id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      toast.success("Updated successfully!");
    } catch (error: any) {
      toast.error("Failed to update");
      throw error;
    }
  };

  const handleMessage = () => {
    toast.info("Messaging feature coming soon!");
  };

  const getCleanlinessLabel = (level: string | null) => {
    const labels: Record<string, string> = {
      "very-clean": "Very Clean",
      "clean": "Clean",
      "moderate": "Moderate",
      "relaxed": "Relaxed"
    };
    return level ? labels[level] || level : t("profile.notSpecified");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoompeerNavbar />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <p className="text-muted-foreground font-body">{t("profile.loading")}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      {/* Mobile FAB for Edit */}
      {isOwnProfile && activeProfileTab === "view" && (
        <button
          onClick={() => setActiveProfileTab("edit")}
          className="md:hidden fixed bottom-6 right-6 z-50 bg-azul hover:bg-azul/90 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all"
        >
          <Pencil size={20} />
          <span className="font-body font-semibold">{t("profile.editProfile")}</span>
        </button>
      )}
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card border border-border rounded-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <div className="bg-gradient-to-br from-azul to-blue-heath p-6 rounded-full">
                  <User size={48} className="text-white" />
                </div>
                {isOwnProfile && (
                  <button 
                    onClick={() => toast.info("Photo upload coming soon!")}
                    className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Pencil size={24} className="text-white" />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-3xl font-bold text-foreground">
                    {profile.full_name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-body font-semibold">
                    <CheckCircle size={12} />
                    Verified
                  </span>
                </div>
                {profile.age && (
                  <p className="text-lg text-muted-foreground font-body mt-1">
                    {profile.age} {t("profile.yearsOld")}
                  </p>
                )}
                <p className="text-muted-foreground font-body mt-2">
                  {profile.occupation || t("profile.lookingForFlatmate")}
                  {profile.desired_location && ` • ${profile.desired_location}`}
                </p>
              </div>

              <div className="flex gap-3">
                {!isOwnProfile && (
                  <>
                    <Button
                      onClick={handleMessage}
                      className="bg-azul hover:bg-azul/90 text-white font-body font-semibold"
                    >
                      <MessageCircle size={18} className="mr-2" />
                      {t("profile.message")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toast.success("Profile liked!")}
                      className="font-body"
                    >
                      <Heart size={18} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* View/Edit Tabs for Own Profile */}
          {isOwnProfile ? (
            <Tabs value={activeProfileTab} onValueChange={setActiveProfileTab} className="w-full">
              <TabsList className="w-full justify-start bg-card border border-border rounded-lg p-1 mb-6">
                <TabsTrigger value="view" className="font-body flex items-center gap-2">
                  <Eye size={16} />
                  {t("profile.viewProfile")}
                </TabsTrigger>
                <TabsTrigger value="edit" className="font-body flex items-center gap-2">
                  <Edit size={16} />
                  {t("profile.editProfile")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="view">
                <ProfileViewContent 
                  profile={profile} 
                  isOwnProfile={isOwnProfile}
                  handleQuickSave={handleQuickSave}
                  getCleanlinessLabel={getCleanlinessLabel}
                  t={t}
                />
              </TabsContent>

              <TabsContent value="edit">
                <div className="bg-card border border-border rounded-lg p-6">
                  <EditProfile embedded />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <ProfileViewContent 
              profile={profile} 
              isOwnProfile={isOwnProfile}
              handleQuickSave={handleQuickSave}
              getCleanlinessLabel={getCleanlinessLabel}
              t={t}
            />
          )}

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="font-body"
            >
              {t("profile.backToDashboard")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted profile view content component
interface ProfileViewContentProps {
  profile: Profile;
  isOwnProfile: boolean;
  handleQuickSave: (field: string, value: string) => Promise<void>;
  getCleanlinessLabel: (level: string | null) => string;
  t: (key: any) => string;
}

const ProfileViewContent = ({ profile, isOwnProfile, handleQuickSave, getCleanlinessLabel, t }: ProfileViewContentProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start bg-card border border-border rounded-lg p-1 mb-6">
        <TabsTrigger value="overview" className="font-body">{t("profile.overview")}</TabsTrigger>
        <TabsTrigger value="preferences" className="font-body">{t("profile.preferences")}</TabsTrigger>
        <TabsTrigger value="lifestyle" className="font-body">{t("profile.lifestyle")}</TabsTrigger>
        <TabsTrigger value="ideal-match" className="font-body">{t("profile.idealMatch")}</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <User size={20} className="text-azul" />
              {t("profile.about")}
            </h3>
            {isOwnProfile ? (
              <QuickEditField
                value={profile.bio}
                onSave={(val) => handleQuickSave("bio", val)}
                type="textarea"
                placeholder={t("profile.aboutPlaceholder")}
              />
            ) : (
              <p className="text-foreground font-body leading-relaxed">
                {profile.bio || "No bio added yet."}
              </p>
            )}
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-heading text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Briefcase size={20} className="text-azul" />
              {t("profile.occupation")}
            </h3>
            {isOwnProfile ? (
              <QuickEditField
                value={profile.occupation}
                onSave={(val) => handleQuickSave("occupation", val)}
                placeholder={t("profile.occupation")}
              />
            ) : (
              <p className="text-foreground font-body">
                {profile.occupation || t("profile.notSpecified")}
              </p>
            )}
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-heading text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Heart size={20} className="text-azul" />
              {t("profile.interests")}
            </h3>
            {profile.hobbies && profile.hobbies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-heath/10 text-azul rounded-full text-sm font-body font-medium"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground font-body">{t("profile.noHobbies")}</p>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Living Preferences Tab */}
      <TabsContent value="preferences">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-heading text-xl font-bold text-foreground mb-6">
            {t("profile.livingPrefs")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-azul/10 p-3 rounded-lg">
                <DollarSign size={24} className="text-azul" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-body">{t("profile.monthlyBudget")}</p>
                {isOwnProfile ? (
                  <QuickEditField
                    value={profile.budget}
                    displayValue={profile.budget ? `€${profile.budget}` : undefined}
                    onSave={(val) => handleQuickSave("budget", val)}
                    type="number"
                    prefix="€"
                    placeholder={t("profile.monthlyBudget")}
                    className="text-lg font-semibold text-foreground"
                  />
                ) : (
                  <p className="text-lg font-semibold font-body text-foreground">
                    {profile.budget !== null ? `€${profile.budget}` : (profile.show_budget === false ? "🔒 Private" : t("profile.notSpecified"))}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-azul/10 p-3 rounded-lg">
                <MapPin size={24} className="text-azul" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-body">{t("profile.desiredLocation")}</p>
                {isOwnProfile ? (
                  <QuickEditField
                    value={profile.desired_location}
                    onSave={(val) => handleQuickSave("desired_location", val)}
                    placeholder={t("profile.desiredLocation")}
                    className="text-lg font-semibold text-foreground"
                  />
                ) : (
                  <p className="text-lg font-semibold font-body text-foreground">
                    {profile.desired_location || (profile.show_location === false ? "🔒 Private" : t("profile.notSpecified"))}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-azul/10 p-3 rounded-lg">
                <Calendar size={24} className="text-azul" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-body">{t("profile.moveInDate")}</p>
                {isOwnProfile ? (
                  <QuickEditField
                    value={profile.move_in_date}
                    displayValue={profile.move_in_date 
                      ? new Date(profile.move_in_date).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })
                      : undefined
                    }
                    onSave={(val) => handleQuickSave("move_in_date", val)}
                    placeholder="YYYY-MM-DD"
                    className="text-lg font-semibold text-foreground"
                  />
                ) : (
                  <p className="text-lg font-semibold font-body text-foreground">
                    {profile.move_in_date 
                      ? new Date(profile.move_in_date).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })
                      : t("profile.flexible")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-azul/10 p-3 rounded-lg">
                <Home size={24} className="text-azul" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-body">{t("profile.accommodationType")}</p>
                <p className="text-lg font-semibold font-body text-foreground capitalize">
                  {profile.accommodation_type || t("profile.notSpecified")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Lifestyle Tab */}
      <TabsContent value="lifestyle">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-heading text-xl font-bold text-foreground mb-6">
            {t("profile.lifestyle")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Sun size={20} className="text-azul" />
              <div>
                <p className="text-sm text-muted-foreground font-body">{t("profile.earlyRiser")}</p>
                <p className="font-semibold font-body text-foreground">
                  {profile.early_riser ? t("profile.yes") : t("profile.no")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Moon size={20} className="text-azul" />
              <div>
                <p className="text-sm text-muted-foreground font-body">{t("profile.nightOwl")}</p>
                <p className="font-semibold font-body text-foreground">
                  {profile.night_owl ? t("profile.yes") : t("profile.no")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Cigarette size={20} className="text-azul" />
              <div>
                <p className="text-sm text-muted-foreground font-body">{t("profile.smoker")}</p>
                <p className="font-semibold font-body text-foreground">
                  {profile.smoker ? t("profile.yes") : t("profile.no")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Sparkles size={20} className="text-azul" />
              <div>
                <p className="text-sm text-muted-foreground font-body">{t("profile.cleanliness")}</p>
                <p className="font-semibold font-body text-foreground">
                  {getCleanlinessLabel(profile.cleanliness_level)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg md:col-span-2">
              <Users size={20} className="text-azul" />
              <div>
                <p className="text-sm text-muted-foreground font-body">{t("profile.guestPolicy")}</p>
                <p className="font-semibold font-body text-foreground capitalize">
                  {profile.guest_preferences || t("profile.notSpecified")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Ideal Match Tab */}
      <TabsContent value="ideal-match">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-heading text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <Heart size={20} className="text-azul" />
            {t("profile.idealMatchDesc")}
          </h3>
          
          {isOwnProfile ? (
            <QuickEditField
              value={profile.ideal_flatmate}
              onSave={(val) => handleQuickSave("ideal_flatmate", val)}
              type="textarea"
              placeholder={t("profile.idealMatch")}
            />
          ) : (
            <p className="text-foreground font-body leading-relaxed">
              {profile.ideal_flatmate || t("profile.noIdealMatch")}
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UserProfile;