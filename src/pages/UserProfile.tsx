import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  MessageCircle, 
  Edit, 
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
  Heart
} from "lucide-react";
import { toast } from "sonner";

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
}

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, [id]);

  const checkAuthAndFetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    setCurrentUserId(session.user.id);

    try {
      let query = supabase.from("profiles").select("*");
      
      if (id) {
        query = query.eq("id", id);
      } else {
        query = query.eq("user_id", session.user.id);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("Profile not found");
        navigate("/dashboard");
        return;
      }

      setProfile(data);
      setIsOwnProfile(data.user_id === session.user.id);
    } catch (error: any) {
      toast.error("Failed to load profile");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    toast.info("Messaging feature coming soon!");
  };

  const handleEdit = () => {
    navigate("/onboarding");
  };

  const getCleanlinessLabel = (level: string | null) => {
    const labels: Record<string, string> = {
      "very-clean": "Very Clean",
      "clean": "Clean",
      "moderate": "Moderate",
      "relaxed": "Relaxed"
    };
    return level ? labels[level] || level : "Not specified";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoompeerNavbar />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <p className="text-muted-foreground font-body">Loading profile...</p>
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
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card border border-border rounded-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <div className="bg-gradient-to-br from-azul to-blue-heath p-6 rounded-full">
                <User size={48} className="text-white" />
              </div>
              
              {/* Name & Headline */}
              <div className="flex-1">
                <h1 className="font-heading text-3xl font-bold text-[#232323]">
                  {profile.full_name}
                </h1>
                {profile.age && (
                  <p className="text-lg text-muted-foreground font-body mt-1">
                    {profile.age} years old
                  </p>
                )}
                <p className="text-muted-foreground font-body mt-2">
                  {profile.occupation || "Looking for a flatmate"}
                  {profile.desired_location && ` • ${profile.desired_location}`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwnProfile ? (
                  <Button
                    onClick={handleEdit}
                    className="bg-azul hover:bg-azul/90 text-white font-body font-semibold"
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleMessage}
                      className="bg-azul hover:bg-azul/90 text-white font-body font-semibold"
                    >
                      <MessageCircle size={18} className="mr-2" />
                      Message
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

          {/* Profile Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start bg-card border border-border rounded-lg p-1 mb-6">
              <TabsTrigger value="overview" className="font-body">Overview</TabsTrigger>
              <TabsTrigger value="preferences" className="font-body">Living Preferences</TabsTrigger>
              <TabsTrigger value="lifestyle" className="font-body">Lifestyle</TabsTrigger>
              <TabsTrigger value="ideal-match" className="font-body">Ideal Match</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#232323] mb-3 flex items-center gap-2">
                    <User size={20} className="text-azul" />
                    About
                  </h3>
                  <p className="text-foreground font-body leading-relaxed">
                    {profile.bio || "No bio added yet."}
                  </p>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-heading text-xl font-bold text-[#232323] mb-3 flex items-center gap-2">
                    <Briefcase size={20} className="text-azul" />
                    Occupation
                  </h3>
                  <p className="text-foreground font-body">
                    {profile.occupation || "Not specified"}
                  </p>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-heading text-xl font-bold text-[#232323] mb-3 flex items-center gap-2">
                    <Heart size={20} className="text-azul" />
                    Interests & Hobbies
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
                    <p className="text-muted-foreground font-body">No hobbies added yet.</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Living Preferences Tab */}
            <TabsContent value="preferences">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold text-[#232323] mb-6">
                  Living Preferences
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="bg-azul/10 p-3 rounded-lg">
                      <DollarSign size={24} className="text-azul" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-body">Monthly Budget</p>
                      <p className="text-lg font-semibold font-body text-[#232323]">
                        {profile.budget ? `£${profile.budget}` : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="bg-azul/10 p-3 rounded-lg">
                      <MapPin size={24} className="text-azul" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-body">Desired Location</p>
                      <p className="text-lg font-semibold font-body text-[#232323]">
                        {profile.desired_location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="bg-azul/10 p-3 rounded-lg">
                      <Calendar size={24} className="text-azul" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-body">Move-in Date</p>
                      <p className="text-lg font-semibold font-body text-[#232323]">
                        {profile.move_in_date 
                          ? new Date(profile.move_in_date).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })
                          : "Flexible"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="bg-azul/10 p-3 rounded-lg">
                      <Home size={24} className="text-azul" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-body">Accommodation Type</p>
                      <p className="text-lg font-semibold font-body text-[#232323] capitalize">
                        {profile.accommodation_type || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Lifestyle Tab */}
            <TabsContent value="lifestyle">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <h3 className="font-heading text-xl font-bold text-[#232323] mb-4">
                  Lifestyle & Habits
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className={`p-3 rounded-lg ${profile.early_riser ? 'bg-green-100' : 'bg-muted'}`}>
                      <Sun size={24} className={profile.early_riser ? 'text-green-600' : 'text-muted-foreground'} />
                    </div>
                    <div>
                      <p className="font-semibold font-body text-[#232323]">Early Riser</p>
                      <p className="text-sm text-muted-foreground font-body">
                        {profile.early_riser ? "Yes, I'm a morning person" : "Not particularly"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className={`p-3 rounded-lg ${profile.night_owl ? 'bg-indigo-100' : 'bg-muted'}`}>
                      <Moon size={24} className={profile.night_owl ? 'text-indigo-600' : 'text-muted-foreground'} />
                    </div>
                    <div>
                      <p className="font-semibold font-body text-[#232323]">Night Owl</p>
                      <p className="text-sm text-muted-foreground font-body">
                        {profile.night_owl ? "Yes, I stay up late" : "Not usually"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className={`p-3 rounded-lg ${profile.smoker ? 'bg-orange-100' : 'bg-green-100'}`}>
                      <Cigarette size={24} className={profile.smoker ? 'text-orange-600' : 'text-green-600'} />
                    </div>
                    <div>
                      <p className="font-semibold font-body text-[#232323]">Smoking</p>
                      <p className="text-sm text-muted-foreground font-body">
                        {profile.smoker ? "Smoker" : "Non-smoker"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="bg-azul/10 p-3 rounded-lg">
                      <Sparkles size={24} className="text-azul" />
                    </div>
                    <div>
                      <p className="font-semibold font-body text-[#232323]">Cleanliness</p>
                      <p className="text-sm text-muted-foreground font-body">
                        {getCleanlinessLabel(profile.cleanliness_level)}
                      </p>
                    </div>
                  </div>
                </div>

                {profile.guest_preferences && (
                  <div className="border-t border-border pt-6">
                    <h4 className="font-heading text-lg font-bold text-[#232323] mb-3 flex items-center gap-2">
                      <Users size={20} className="text-azul" />
                      Guest Preferences
                    </h4>
                    <p className="text-foreground font-body leading-relaxed">
                      {profile.guest_preferences}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Ideal Match Tab */}
            <TabsContent value="ideal-match">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-heading text-xl font-bold text-[#232323] mb-4 flex items-center gap-2">
                  <Heart size={20} className="text-azul" />
                  What I'm Looking For
                </h3>
                
                <p className="text-foreground font-body leading-relaxed">
                  {profile.ideal_flatmate || "No preferences specified yet."}
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Back Button */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="font-body"
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
