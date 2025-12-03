import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, X, MapPin, User, Sparkles, MessageCircle, Settings } from "lucide-react";
import { toast } from "sonner";

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
}

const BrowseMatch = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const navigate = useNavigate();

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
      // Get profiles the user has already liked
      const { data: likedProfiles } = await supabase
        .from("likes")
        .select("liked_id")
        .eq("liker_id", userId);

      const likedIds = likedProfiles?.map(l => l.liked_id) || [];

      // Fetch profiles excluding current user and already liked
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("profile_completed", true)
        .neq("user_id", userId);

      if (error) throw error;
      
      // Filter out already liked profiles
      const filteredProfiles = (data || []).filter(
        p => !likedIds.includes(p.user_id)
      );
      
      setProfiles(filteredProfiles);
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

      // Check if it's a match
      const { data: match } = await supabase
        .from("matches")
        .select("*")
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
        .or(`user1_id.eq.${likedProfile.user_id},user2_id.eq.${likedProfile.user_id}`)
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

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const cardCenter = window.innerWidth / 2;
    const offset = clientX - cardCenter;
    setDragOffset(offset);
  }, [isDragging]);

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (dragOffset > 100) {
      handleLike();
    } else if (dragOffset < -100) {
      handlePass();
    }
    setDragOffset(0);
  };

  const currentProfile = profiles[currentIndex];

  const getTags = (profile: Profile) => {
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
    if (swipeDirection === 'left') {
      return { transform: 'translateX(-150%) rotate(-30deg)', opacity: 0 };
    }
    if (swipeDirection === 'right') {
      return { transform: 'translateX(150%) rotate(30deg)', opacity: 0 };
    }
    if (isDragging) {
      const rotation = dragOffset * 0.05;
      return { transform: `translateX(${dragOffset}px) rotate(${rotation}deg)` };
    }
    return {};
  };

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-youngNight">
            Find Your Match
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate("/discovery-settings")}
            className="font-body"
          >
            <Settings size={18} className="mr-2" />
            Preferences
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          {loading ? (
            <p className="text-muted-foreground font-body">Loading profiles...</p>
          ) : currentIndex >= profiles.length ? (
            <div className="text-center">
              <div className="bg-card border border-border rounded-2xl p-8 max-w-md">
                <Sparkles className="w-16 h-16 text-azul mx-auto mb-4" />
                <h2 className="font-heading text-xl font-bold mb-2 text-youngNight">
                  No More Profiles
                </h2>
                <p className="text-muted-foreground font-body mb-4">
                  You've seen all available flatmates. Check back later for new matches!
                </p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-azul hover:bg-azul/90 text-white font-body"
                >
                  Browse All Profiles
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Profile Card */}
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
                <div
                  className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden transition-all duration-300 select-none"
                  style={getCardStyle()}
                >
                  {/* Profile Image Placeholder */}
                  <div className="bg-gradient-to-br from-azul to-blueHeath h-64 flex items-center justify-center">
                    <User size={80} className="text-white/80" />
                  </div>

                  {/* Profile Info */}
                  <div className="p-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <h2 className="font-heading text-2xl font-bold text-youngNight">
                        {currentProfile.full_name}
                      </h2>
                      {currentProfile.age && (
                        <span className="text-xl text-muted-foreground font-body">
                          {currentProfile.age}
                        </span>
                      )}
                    </div>

                    {currentProfile.bio && (
                      <p className="text-foreground font-body text-sm mb-4 line-clamp-3">
                        {currentProfile.bio}
                      </p>
                    )}

                    {currentProfile.desired_location && (
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin size={16} className="text-azul" />
                        <span className="font-body text-sm">
                          {currentProfile.desired_location}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {getTags(currentProfile).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blueHeath/10 text-azul rounded-full text-xs font-body font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Swipe Indicators */}
                  {isDragging && dragOffset > 50 && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg font-body font-bold rotate-[-20deg]">
                      LIKE
                    </div>
                  )}
                  {isDragging && dragOffset < -50 && (
                    <div className="absolute top-4 right-4 bg-muted-foreground text-white px-4 py-2 rounded-lg font-body font-bold rotate-[20deg]">
                      PASS
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-8 mt-8">
                <Button
                  onClick={handlePass}
                  variant="outline"
                  size="lg"
                  className="w-16 h-16 rounded-full border-2 border-muted-foreground hover:bg-muted-foreground hover:text-white transition-colors"
                >
                  <X size={28} />
                </Button>

                <Button
                  onClick={() => navigate(`/profile/${currentProfile.id}`)}
                  variant="outline"
                  size="lg"
                  className="w-12 h-12 rounded-full border-2 border-blueHeath hover:bg-blueHeath hover:text-white transition-colors"
                >
                  <User size={20} />
                </Button>

                <Button
                  onClick={handleLike}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-azul hover:bg-azul/90 text-white"
                >
                  <Heart size={28} />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground font-body mt-4">
                Swipe right to like, left to pass
              </p>
            </>
          )}
        </div>
      </div>

      {/* Match Modal */}
      <Dialog open={showMatch} onOpenChange={setShowMatch}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2 text-2xl font-heading text-azul">
                <Sparkles className="w-8 h-8" />
                It's a Match!
                <Sparkles className="w-8 h-8" />
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-azul to-blueHeath rounded-full flex items-center justify-center">
                <User size={36} className="text-white" />
              </div>
              <Heart className="w-8 h-8 text-azul animate-pulse" />
              <div className="w-20 h-20 bg-gradient-to-br from-blueHeath to-azul rounded-full flex items-center justify-center">
                <User size={36} className="text-white" />
              </div>
            </div>

            <p className="text-muted-foreground font-body mb-6">
              You and <span className="font-semibold text-foreground">{matchedProfile?.full_name}</span> liked each other!
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  setShowMatch(false);
                  toast.info("Messaging feature coming soon!");
                }}
                className="bg-azul hover:bg-azul/90 text-white font-body"
              >
                <MessageCircle size={18} className="mr-2" />
                Send a Message
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowMatch(false)}
                className="font-body"
              >
                Keep Swiping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseMatch;
