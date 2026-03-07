import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import FeedbackWidget from "@/components/roompeer/FeedbackWidget";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, X, MapPin, User, Sparkles, MessageCircle, Settings, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface PublicProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number | null;
  bio: string | null;
  occupation: string | null;
  hobbies: string[] | null;
  budget: number | null;
  desired_location: string | null;
  smoker: boolean | null;
  cleanliness_level: string | null;
  early_riser: boolean | null;
  night_owl: boolean | null;
  has_pets: boolean | null;
  accommodation_type: string | null;
  guest_preferences: string | null;
  latitude: number | null;
  longitude: number | null;
  show_budget: boolean | null;
  show_location: boolean | null;
  show_photos: boolean | null;
  show_habits: boolean | null;
}

interface ScoredProfile extends PublicProfile {
  compatibilityScore: number;
  distanceKm: number | null;
}

// Haversine distance in km
const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Compatibility scoring algorithm
const calculateCompatibility = (
  userProfile: PublicProfile | null,
  candidate: PublicProfile,
  discoverySettings: any | null
): number => {
  if (!userProfile) return 50;

  let score = 0;
  let factors = 0;

  // Location match
  if (userProfile.desired_location && candidate.desired_location) {
    factors += 3;
    if (userProfile.desired_location.toLowerCase() === candidate.desired_location.toLowerCase()) score += 3;
    else if (
      userProfile.desired_location.toLowerCase().includes(candidate.desired_location.toLowerCase()) ||
      candidate.desired_location.toLowerCase().includes(userProfile.desired_location.toLowerCase())
    ) score += 2;
  }

  // Budget compatibility
  if (userProfile.budget && candidate.budget) {
    factors += 3;
    const diff = Math.abs(userProfile.budget - candidate.budget);
    const avg = (userProfile.budget + candidate.budget) / 2;
    const ratio = diff / avg;
    if (ratio < 0.1) score += 3;
    else if (ratio < 0.25) score += 2;
    else if (ratio < 0.5) score += 1;
  }

  // Smoking
  if (userProfile.smoker != null && candidate.smoker != null) {
    factors += 2;
    if (userProfile.smoker === candidate.smoker) score += 2;
  }

  // Sleep schedule
  if (userProfile.early_riser != null && candidate.early_riser != null) {
    factors += 2;
    if (userProfile.early_riser === candidate.early_riser && userProfile.night_owl === candidate.night_owl) score += 2;
    else if (userProfile.early_riser === candidate.early_riser || userProfile.night_owl === candidate.night_owl) score += 1;
  }

  // Cleanliness
  if (userProfile.cleanliness_level && candidate.cleanliness_level) {
    factors += 2;
    if (userProfile.cleanliness_level === candidate.cleanliness_level) score += 2;
  }

  // Pets
  if (userProfile.has_pets != null && candidate.has_pets != null) {
    factors += 1;
    if (userProfile.has_pets === candidate.has_pets) score += 1;
  }

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

  // Hard filters from discovery settings
  if (discoverySettings) {
    if (discoverySettings.smoking_preference === "non-smoker" && candidate.smoker) return 0;
    if (discoverySettings.smoking_preference === "smoker" && !candidate.smoker) return 0;
    if (discoverySettings.pet_preference === "no-pets" && candidate.has_pets) return 0;
    if (discoverySettings.min_budget && candidate.budget && candidate.budget < discoverySettings.min_budget) return 0;
    if (discoverySettings.max_budget && candidate.budget && candidate.budget > discoverySettings.max_budget) return 0;
  }

  return factors > 0 ? Math.round((score / factors) * 100) : 50;
};

const FIELDS = "id, user_id, full_name, age, bio, occupation, hobbies, budget, desired_location, accommodation_type, early_riser, night_owl, smoker, cleanliness_level, guest_preferences, ideal_flatmate, profile_completed, has_pets, wants_pets, latitude, longitude, show_budget, show_location, show_photos, show_habits, created_at, updated_at";

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
  const [startX, setStartX] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Request GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          // Save to profile
          saveUserLocation(pos.coords.latitude, pos.coords.longitude);
        },
        () => { /* GPS denied, proceed without */ }
      );
    }
    checkAuthAndFetch();
  }, []);

  const saveUserLocation = async (lat: number, lng: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from("profiles").update({ latitude: lat, longitude: lng } as any).eq("user_id", session.user.id);
  };

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }
    setCurrentUserId(session.user.id);
    fetchProfiles(session.user.id);
  };

  const fetchProfiles = async (userId: string) => {
    try {
      const [likesRes, userProfileRes, settingsRes, candidatesRes] = await Promise.all([
        supabase.from("likes").select("liked_id").eq("liker_id", userId),
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("discovery_settings").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("profiles_public").select(FIELDS).eq("profile_completed", true).neq("user_id", userId),
      ]);

      const likedIds = likesRes.data?.map(l => l.liked_id) || [];
      const userProfile = userProfileRes.data as any;
      const discoverySettings = settingsRes.data;
      const maxDist = discoverySettings?.max_distance || 25;

      if (candidatesRes.error) throw candidatesRes.error;

      const scored = (candidatesRes.data || [])
        .filter((p: any) => !likedIds.includes(p.user_id))
        .map((p: any) => {
          let distanceKm: number | null = null;
          if (userProfile?.latitude && userProfile?.longitude && p.latitude && p.longitude) {
            distanceKm = haversineKm(userProfile.latitude, userProfile.longitude, p.latitude, p.longitude);
          }
          return {
            ...p,
            compatibilityScore: calculateCompatibility(userProfile, p, discoverySettings),
            distanceKm,
          } as ScoredProfile;
        })
        .filter(p => p.compatibilityScore > 0)
        // Filter by distance if both have GPS
        .filter(p => p.distanceKm === null || p.distanceKm <= maxDist)
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
      const { error } = await supabase.from("likes").insert({ liker_id: currentUserId, liked_id: likedProfile.user_id });
      if (error) throw error;

      const { data: match } = await supabase
        .from("matches")
        .select("*")
        .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${likedProfile.user_id}),and(user1_id.eq.${likedProfile.user_id},user2_id.eq.${currentUserId})`)
        .maybeSingle();

      if (match) { setMatchedProfile(likedProfile); setShowMatch(true); }

      setTimeout(() => { setSwipeDirection(null); setCurrentIndex(prev => prev + 1); }, 300);
    } catch (error: any) {
      toast.error("Failed to like profile");
      setSwipeDirection(null);
    }
  };

  const handlePass = () => {
    if (currentIndex >= profiles.length) return;
    setSwipeDirection('left');
    setTimeout(() => { setSwipeDirection(null); setCurrentIndex(prev => prev + 1); }, 300);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - startX);
  }, [isDragging, startX]);

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
    if (profile.show_budget !== false && profile.budget) tags.push(`${profile.budget}k HUF`);
    if (profile.show_location !== false && profile.desired_location) tags.push(profile.desired_location);
    if (profile.show_habits !== false) {
      if (profile.smoker === false) tags.push(t("tag.nonSmoker"));
      if (profile.early_riser) tags.push(t("tag.earlyRiser"));
      if (profile.night_owl) tags.push(t("tag.nightOwl"));
      if (profile.has_pets) tags.push(t("tag.petsOk"));
    }
    if (profile.occupation) tags.push(profile.occupation);
    return tags.slice(0, 6);
  };

  const getCardStyle = () => {
    if (swipeDirection === 'left') return { transform: 'translateX(-150%) rotate(-30deg)', opacity: 0, transition: 'all 0.3s ease-out' };
    if (swipeDirection === 'right') return { transform: 'translateX(150%) rotate(30deg)', opacity: 0, transition: 'all 0.3s ease-out' };
    if (isDragging) return { transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.04}deg)`, transition: 'none' };
    return { transition: 'all 0.3s ease-out' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-700 bg-green-100 border-green-200";
    if (score >= 50) return "text-yellow-700 bg-yellow-100 border-yellow-200";
    return "text-orange-700 bg-orange-100 border-orange-200";
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
              {/* Tinder-style card */}
              <div
                className="relative w-full max-w-sm cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                <div
                  className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden"
                  style={getCardStyle()}
                >
                  {/* Photo area */}
                  <div className="bg-gradient-to-br from-primary/80 to-secondary/80 h-72 flex items-center justify-center relative">
                    <User size={96} className="text-primary-foreground/60" />

                    {/* Score badge */}
                    <div className={cn("absolute top-4 right-4 px-3 py-1.5 rounded-full font-body font-bold text-sm border", getScoreColor(currentProfile.compatibilityScore))}>
                      {currentProfile.compatibilityScore}% match
                    </div>

                    {/* Distance badge */}
                    {currentProfile.distanceKm !== null && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-card/90 text-foreground font-body text-xs font-medium flex items-center gap-1 border border-border">
                        <Navigation size={12} />
                        {currentProfile.distanceKm < 1 ? "<1 km" : `${Math.round(currentProfile.distanceKm)} km`}
                      </div>
                    )}

                    {/* Swipe indicators */}
                    {isDragging && dragOffset > 50 && (
                      <div className="absolute top-16 left-4 bg-green-500 text-white px-5 py-2 rounded-xl font-heading font-bold text-xl rotate-[-15deg] shadow-lg">LIKE</div>
                    )}
                    {isDragging && dragOffset < -50 && (
                      <div className="absolute top-16 right-4 bg-destructive text-white px-5 py-2 rounded-xl font-heading font-bold text-xl rotate-[15deg] shadow-lg">PASS</div>
                    )}

                    {/* Bottom gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent" />

                    {/* Name overlay at bottom of image */}
                    <div className="absolute bottom-4 left-6 right-6">
                      <div className="flex items-baseline gap-2">
                        <h2 className="font-heading text-2xl font-bold text-foreground">{currentProfile.full_name}</h2>
                        {currentProfile.age && (
                          <span className="text-xl text-muted-foreground font-body">{currentProfile.age}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 space-y-4">
                    {currentProfile.bio && (
                      <p className="text-foreground font-body text-sm line-clamp-2">{currentProfile.bio}</p>
                    )}

                    {currentProfile.show_location !== false && currentProfile.desired_location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} className="text-primary shrink-0" />
                        <span className="font-body text-sm">{currentProfile.desired_location}</span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {getTags(currentProfile).map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-secondary/10 text-primary rounded-full text-xs font-body font-medium border border-primary/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-6 mt-8">
                <Button
                  onClick={handlePass}
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-full border-2 border-destructive/50 hover:bg-destructive hover:text-white transition-all shadow-md"
                >
                  <X size={28} />
                </Button>
                <Button
                  onClick={() => navigate(`/profile/${currentProfile.id}`)}
                  variant="outline"
                  size="lg"
                  className="w-12 h-12 rounded-full border-2 border-secondary hover:bg-secondary hover:text-white transition-all"
                >
                  <User size={20} />
                </Button>
                <Button
                  onClick={handleLike}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all"
                >
                  <Heart size={28} />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground font-body mt-4">{t("browse.swipeHint")}</p>
            </>
          )}
        </div>
      </div>

      {/* Match dialog */}
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
