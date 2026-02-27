import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackWidget from "@/components/roompeer/FeedbackWidget";
import { supabase } from "@/integrations/supabase/client";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, MessageCircle, User, MapPin, Calendar, Home, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string;
  age: number | null;
  bio: string | null;
  occupation: string | null;
  hobbies: string[] | null;
  budget: number | null;
  desired_location: string | null;
  move_in_date: string | null;
  accommodation_type: string | null;
  smoker: boolean;
  cleanliness_level: string | null;
}

const Dashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filter states
  const [locationFilter, setLocationFilter] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [nonSmokerOnly, setNonSmokerOnly] = useState(false);
  const [accommodationTypeFilter, setAccommodationTypeFilter] = useState("");

  useEffect(() => {
    checkAuth();
    fetchProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [profiles, locationFilter, minBudget, maxBudget, minAge, maxAge, nonSmokerOnly, accommodationTypeFilter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, age, bio, occupation, hobbies, budget, desired_location, move_in_date, accommodation_type, early_riser, night_owl, smoker, cleanliness_level, guest_preferences, ideal_flatmate, profile_completed, has_pets, wants_pets, created_at, updated_at")
        .eq("profile_completed", true)
        .neq("user_id", user?.id || "");

      if (error) throw error;
      setProfiles(data || []);
      setFilteredProfiles(data || []);
    } catch (error: any) {
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...profiles];

    if (locationFilter) {
      filtered = filtered.filter(p => 
        p.desired_location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (minBudget) {
      filtered = filtered.filter(p => 
        p.budget && p.budget >= parseFloat(minBudget)
      );
    }

    if (maxBudget) {
      filtered = filtered.filter(p => 
        p.budget && p.budget <= parseFloat(maxBudget)
      );
    }

    if (minAge) {
      filtered = filtered.filter(p => 
        p.age && p.age >= parseInt(minAge)
      );
    }

    if (maxAge) {
      filtered = filtered.filter(p => 
        p.age && p.age <= parseInt(maxAge)
      );
    }

    if (nonSmokerOnly) {
      filtered = filtered.filter(p => !p.smoker);
    }

    if (accommodationTypeFilter) {
      filtered = filtered.filter(p => 
        p.accommodation_type === accommodationTypeFilter
      );
    }

    setFilteredProfiles(filtered);
  };

  const handleLike = (profileId: string) => {
    toast.success("Profile liked!");
  };

  const handleMessage = (profileId: string) => {
    toast.info("Messaging feature coming soon!");
  };

  const getTags = (profile: Profile) => {
    const tags: string[] = [];
    if (profile.occupation) tags.push(profile.occupation);
    if (!profile.smoker) tags.push("Non-Smoker");
    if (profile.cleanliness_level) tags.push(profile.cleanliness_level);
    return tags.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80 bg-card border border-border rounded-lg p-6 h-fit">
            <h2 className="font-heading text-xl font-bold mb-4">Filters</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="font-body text-sm">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., London"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="font-body"
                />
              </div>

              <div>
                <Label className="font-body text-sm">Budget Range</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    className="font-body"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="font-body"
                  />
                </div>
              </div>

              <div>
                <Label className="font-body text-sm">Age Range</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="font-body"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="font-body"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accommodationType" className="font-body text-sm">Accommodation Type</Label>
                <select
                  id="accommodationType"
                  value={accommodationTypeFilter}
                  onChange={(e) => setAccommodationTypeFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="room">Room</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="nonSmoker"
                  checked={nonSmokerOnly}
                  onChange={(e) => setNonSmokerOnly(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="nonSmoker" className="font-body text-sm cursor-pointer">
                  Non-Smoker Only
                </Label>
              </div>

              <Button
                onClick={() => {
                  setLocationFilter("");
                  setMinBudget("");
                  setMaxBudget("");
                  setMinAge("");
                  setMaxAge("");
                  setNonSmokerOnly(false);
                  setAccommodationTypeFilter("");
                }}
                variant="outline"
                className="w-full font-body"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Profile Cards */}
          <div className="flex-1">
            <h1 className="font-heading text-3xl font-bold mb-6">Find Your Perfect Flatmate</h1>
            
            {loading ? (
              <p className="text-muted-foreground font-body">Loading profiles...</p>
            ) : filteredProfiles.length === 0 ? (
              <p className="text-muted-foreground font-body">No profiles found matching your criteria.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-azul to-blue-heath p-3 rounded-full">
                          <User size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg">{profile.full_name}</h3>
                          {profile.age && (
                            <p className="text-sm text-muted-foreground font-body">{profile.age} years old</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-foreground font-body mb-4 line-clamp-3">
                      {profile.bio || "No bio available"}
                    </p>

                    <div className="space-y-2 mb-4">
                      {profile.desired_location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={16} />
                          <span className="font-body">{profile.desired_location}</span>
                        </div>
                      )}
                      {profile.budget && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign size={16} />
                          <span className="font-body">£{profile.budget}/month</span>
                        </div>
                      )}
                      {profile.accommodation_type && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Home size={16} />
                          <span className="font-body capitalize">{profile.accommodation_type}</span>
                        </div>
                      )}
                      {profile.move_in_date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={16} />
                          <span className="font-body">{new Date(profile.move_in_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {getTags(profile).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-heath/10 text-azul rounded-full text-xs font-body font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleLike(profile.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 font-body"
                      >
                        <Heart size={16} className="mr-1" />
                        Like
                      </Button>
                      <Button
                        onClick={() => handleMessage(profile.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 font-body"
                      >
                        <MessageCircle size={16} className="mr-1" />
                        Message
                      </Button>
                    </div>

                    <Button
                      onClick={() => navigate(`/profile/${profile.id}`)}
                      className="w-full mt-2 bg-azul hover:bg-azul/90 text-white font-body font-semibold"
                      size="sm"
                    >
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <FeedbackWidget />
    </div>
  );
};

export default Dashboard;
