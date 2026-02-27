import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import FeedbackWidget from "@/components/roompeer/FeedbackWidget";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, X, MapPin, User, Sparkles, MessageCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  age: number | null;
  bio: string | null;
  occupation: string | null;
  hobbies: string[] | null;
  budget: number | null;
  desired_location: string | null;
  smoker: boolean;
  cleanliness_level: string | null;
  early_riser: boolean;
  night_owl: boolean;
  has_pets: boolean;
  accommodation_type: string | null;
  guest_preferences: string | null;
}

interface ScoredProfile extends Profile {
  compatibilityScore: number;
}

// Compatibility scoring algorithm
const calculateCompatibility = (
  userProfile: Profile | null,
  candidate: Profile,
  discoverySettings: any | null
): number => {
  if (!userProfile) return 50; // Default score if no user profile

  let score = 0;
  let factors = 0;

  // Location match (high weight)
  if (userProfile.desired_location && candidate.desired_location) {
    factors += 3;
    if (userProfile.desired_location.toLowerCase() === candidate.desired_location.toLowerCase()) {
      score += 3;
    } else if (
      userProfile.desired_location.toLowerCase().includes(candidate.desired_location.toLowerCase()) ||
      candidate.desired_location.toLowerCase().includes(userProfile.desired_location.toLowerCase())
    ) {
      score += 2;
    }
  }

  // Budget compatibility (high weight)
  if (userProfile.budget && candidate.budget) {
    factors += 3;
    const diff = Math.abs(userProfile.budget - candidate.budget);
    const avg = (userProfile.budget + candidate.budget) / 2;
    const ratio = diff / avg;
    if (ratio < 0.1) score += 3;
    else if (ratio < 0.25) score += 2;
    else if (ratio < 0.5) score += 1;
  }

  // Smoking compatibility
  if (userProfile.smoker !== undefined && candidate.smoker !== undefined) {
    factors += 2;
    if (userProfile.smoker === candidate.smoker) score += 2;
  }

  // Sleep schedule compatibility
  factors += 2;
  if (userProfile.early_riser === candidate.early_riser && userProfile.night_owl === candidate.night_owl) {
    score += 2;
  } else if (userProfile.early_riser === candidate.early_riser || userProfile.night_owl === candidate.night_owl) {
    score += 1;
  }

  // Cleanliness level
  if (userProfile.cleanliness_level && candidate.cleanliness_level) {
    factors += 2;
    if (userProfile.cleanliness_level === candidate.cleanliness_level) score += 2;
  }

  // Pets compatibility
  factors += 1;
  if (userProfile.has_pets === candidate.has_pets) score += 1;

  // Accommodation type
  if (userProfile.accommodation_type && candidate.accommodation_type) {
    factors += 2;
    if (userProfile.accommodation_type === candidate.accommodation_type) score += 2;
  }

  // Shared hobbies
  if (userProfile.hobbies?.length && candidate.hobbies?.length) {
    factors += 2;
    const shared = userProfile.hobbies.filter(h => candidate.hobbies!.includes(h));
    const ratio = shared.length / Math.max(userProfile.hobbies.length, candidate.hobbies.length);
    score += ratio * 2;
  }

  // Guest preferences
  if (userProfile.guest_preferences && candidate.guest_preferences) {
    factors += 1;
    if (userProfile.guest_preferences === candidate.guest_preferences) score += 1;
  }

  // Apply discovery settings filters
  if (discoverySettings) {
    if (discoverySettings.smoking_preference === "non-smoker" && candidate.smoker) return 0;
    if (discoverySettings.smoking_preference === "smoker" && !candidate.smoker) return 0;
    if (discoverySettings.pet_preference === "no-pets" && candidate.has_pets) return 0;
    if (discoverySettings.min_budget && candidate.budget && candidate.budget < discoverySettings.min_budget) return 0;
    if (discoverySettings.max_budget && candidate.budget && candidate.budget > discoverySettings.max_budget) return 0;
  }

  return factors > 0 ? Math.round((score / factors) * 100) : 50;
};

const BrowseMatch = () => {
  const [profiles, setProfiles] = useState<ScoredProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<ScoredProfile | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setCurrentUserId(session.user.id);
    fetchProfiles(session.user.id);
  };

  const fetchProfiles = async (userId: string) => {
    try {
      // Fetch in parallel: liked profiles, user profile, discovery settings, all candidates
      const [likesRes, userProfileRes, settingsRes, candidatesRes] = await Promise.all([
        supabase.from("likes").select("liked_id").eq("liker_id", userId),
        supabase.from("profiles").select("id, user_id, full_name, age, bio, occupation, hobbies, budget, desired_location, move_in_date, accommodation_type, early_riser, night_owl, smoker, cleanliness_level, guest_preferences, ideal_flatmate, profile_completed, has_pets, wants_pets, created_at, updated_at").eq("user_id", userId).maybeSingle(),
        supabase.from("discovery_settings").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("profiles").select("id, user_id, full_name, age, bio, occupation, hobbies, budget, desired_location, move_in_date, accommodation_type, early_riser, night_owl, smoker, cleanliness_level, guest_preferences, ideal_flatmate, profile_completed, has_pets, wants_pets, created_at, updated_at").eq("profile_completed", true).neq("user_id", userId),
      ]);

      const likedIds = likesRes.data?.map(l => l.liked_id) || [];
      const userProfile = userProfileRes.data;
      const discoverySettings = settingsRes.data;

      if (candidatesRes.error) throw candidatesRes.error;

      // Filter out already liked, score, and sort by compatibility
      const scored = (candidatesRes.data || [])
        .filter(p => !likedIds.includes(p.user_id))
        .map(p => ({
          ...p,
          smoker: p.smoker ?? false,
          early_riser: p.early_riser ?? false,
          night_owl: p.night_owl ?? false,
          has_pets: p.has_pets ?? false,
          compatibilityScore: calculateCompatibility(
            userProfile ? { ...userProfile, smoker: userProfile.smoker ?? false, early_riser: userProfile.early_riser ?? false, night_owl: userProfile.night_owl ?? false, has_pets: userProfile.has_pets ?? false } : null,
            { ...p, smoker: p.smoker ?? false, early_riser: p.early_riser ?? false, night_owl: p.night_owl ?? false, has_pets: p.has_pets ?? false },
            discoverySettings
          ),
        }))
        .filter(p => p.compatibilityScore > 0) // Filter out incompatible based on hard filters
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      setProfiles(scored);
    } catch (error: any) {
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUserId || currentIndex >= profiles.length) return;
    
    const likedProfile = profiles[currentIndex];
    setSwipeDirection('right');
    
    try {
      const { error } = await supabase
        .from("likes")
        .insert({ liker_id: currentUserId, liked_id: likedProfile.user_id });

      if (error) throw error;

      // Check if it's a match (the trigger creates it automatically)
      const { data: match } = await supabase
        .from("matches")
        .select("*")
        .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${likedProfile.user_id}),and(user1_id.eq.${likedProfile.user_id},user2_id.eq.${currentUserId})`)
        .maybeSingle();

      if (match) {
        setMatchedProfile(likedProfile);
        setShowMatch(true);
      }

      setTimeout(() => {
        setSwipeDirection(null);
        setCurrentIndex(prev => prev + 1);
      }, 300);
    } catch (error: any) {
      toast.error("Failed to like profile");
      setSwipeDirection(null);
    }
  };

  const handlePass = () => {
    if (currentIndex >= profiles.length) return;
    setSwipeDirection('left');
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const handleDragStart = () => setIsDragging(true);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - window.innerWidth / 2);
  }, [isDragging]);

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 100) handleLike();
    else if (dragOffset < -100) handlePass();
    setDragOffset(0);
  };

  const currentProfile = profiles[currentIndex];

  const getTags = (profile: ScoredProfile) => {
    const tags: string[] = [];
    if (!profile.smoker) tags.push("Non-Smoker");
    if (profile.early_riser) tags.push("Early Riser");
    if (profile.night_owl) tags.push("Night Owl");
    if (profile.occupation) tags.push(profile.occupation);
    if (profile.has_pets) tags.push("Pet Lover");
    if (profile.budget) tags.push(`£${profile.budget}/mo`);
    return tags.slice(0, 5);
  };

  const getCardStyle = () => {
    if (swipeDirection === 'left') return { transform: 'translateX(-150%) rotate(-30deg)', opacity: 0 };
    if (swipeDirection === 'right') return { transform: 'translateX(150%) rotate(30deg)', opacity: 0 };
    if (isDragging) return { transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)` };
    return {};
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600 bg-green-100";
    if (score >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            {t("browse.findMatch")}
          </h1>
          <Button variant="outline" onClick={() => navigate("/discovery-settings")} className="font-body">
            <Settings size={18} className="mr-2" /> {t("browse.preferences")}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          {loading ? (
            <p className="text-muted-foreground font-body">{t("browse.loading")}</p>
          ) : currentIndex >= profiles.length ? (
            <div className="text-center">
              <div className="bg-card border border-border rounded-2xl p-8 max-w-md">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="font-heading text-xl font-bold mb-2 text-foreground">{t("browse.noMore")}</h2>
                <p className="text-muted-foreground font-body mb-4">{t("browse.noMoreDesc")}</p>
                <Button onClick={() => navigate("/dashboard")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-body">
                  {t("browse.browseAll")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="relative w-full max-w-sm cursor-grab active:cursor-grabbing"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden transition-all duration-300 select-none" style={getCardStyle()}>
                  <div className="bg-gradient-to-br from-primary to-secondary h-64 flex items-center justify-center relative">
                    <User size={80} className="text-primary-foreground/80" />
                    {/* Compatibility score badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full font-body font-bold text-sm ${getScoreColor(currentProfile.compatibilityScore)}`}>
                      {currentProfile.compatibilityScore}% match
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <h2 className="font-heading text-2xl font-bold text-foreground">{currentProfile.full_name}</h2>
                      {currentProfile.age && (
                        <span className="text-xl text-muted-foreground font-body">{currentProfile.age}</span>
                      )}
                    </div>

                    {currentProfile.bio && (
                      <p className="text-foreground font-body text-sm mb-4 line-clamp-3">{currentProfile.bio}</p>
                    )}

                    {currentProfile.desired_location && (
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin size={16} className="text-primary" />
                        <span className="font-body text-sm">{currentProfile.desired_location}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {getTags(currentProfile).map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-secondary/10 text-primary rounded-full text-xs font-body font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isDragging && dragOffset > 50 && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg font-body font-bold rotate-[-20deg]">LIKE</div>
                  )}
                  {isDragging && dragOffset < -50 && (
                    <div className="absolute top-4 right-4 bg-muted-foreground text-white px-4 py-2 rounded-lg font-body font-bold rotate-[20deg]">PASS</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-8 mt-8">
                <Button onClick={handlePass} variant="outline" size="lg" className="w-16 h-16 rounded-full border-2 border-muted-foreground hover:bg-muted-foreground hover:text-white transition-colors">
                  <X size={28} />
                </Button>
                <Button onClick={() => navigate(`/profile/${currentProfile.id}`)} variant="outline" size="lg" className="w-12 h-12 rounded-full border-2 border-secondary hover:bg-secondary hover:text-white transition-colors">
                  <User size={20} />
                </Button>
                <Button onClick={handleLike} size="lg" className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Heart size={28} />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground font-body mt-4">{t("browse.swipeHint")}</p>
            </>
          )}
        </div>
      </div>

      <Dialog open={showMatch} onOpenChange={setShowMatch}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-heading text-primary">
                <Sparkles className="w-8 h-8" /> {t("browse.itsAMatch")} <Sparkles className="w-8 h-8" />
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <User size={36} className="text-primary-foreground" />
              </div>
              <Heart className="w-8 h-8 text-primary animate-pulse" />
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                <User size={36} className="text-primary-foreground" />
              </div>
            </div>
            <p className="text-muted-foreground font-body mb-6">
              You and <span className="font-semibold text-foreground">{matchedProfile?.full_name}</span> {t("browse.matchedWith")}
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => { setShowMatch(false); navigate("/matches"); }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-body"
              >
                <MessageCircle size={18} className="mr-2" /> {t("browse.sendMessage")}
              </Button>
              <Button variant="outline" onClick={() => setShowMatch(false)} className="font-body">
                {t("browse.keepSwiping")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FeedbackWidget />
    </div>
  );
};

export default BrowseMatch;
