import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, DollarSign, Moon, Sun, Sparkles, Dog, Users, Save } from "lucide-react";
import { toast } from "sonner";

const INTERESTS = [
  "Cooking", "Gaming", "Fitness", "Reading", "Travel", 
  "Music", "Movies", "Art", "Photography", "Hiking",
  "Yoga", "Dancing", "Gardening", "Tech", "Sports"
];

const DiscoverySettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings state
  const [maxDistance, setMaxDistance] = useState(25);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(2000);
  const [sleepSchedule, setSleepSchedule] = useState("any");
  const [cleanlinessRange, setCleanlinessRange] = useState([1, 5]);
  const [smokingPreference, setSmokingPreference] = useState("any");
  const [petPreference, setPetPreference] = useState("any");
  const [guestPolicy, setGuestPolicy] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [accommodationTypes, setAccommodationTypes] = useState<string[]>(["apartment", "house", "room"]);

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    loadSettings(session.user.id);
  };

  const loadSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("discovery_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setMaxDistance(data.max_distance || 25);
        setMinBudget(Number(data.min_budget) || 0);
        setMaxBudget(Number(data.max_budget) || 2000);
        setSleepSchedule(data.sleep_schedule || "any");
        setCleanlinessRange([data.cleanliness_min || 1, data.cleanliness_max || 5]);
        setSmokingPreference(data.smoking_preference || "any");
        setPetPreference(data.pet_preference || "any");
        setGuestPolicy(data.guest_policy || []);
        setInterests(data.interests || []);
        setAccommodationTypes(data.accommodation_types || ["apartment", "house", "room"]);
      }
    } catch (error: any) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const settings = {
        user_id: user.id,
        max_distance: maxDistance,
        min_budget: minBudget,
        max_budget: maxBudget,
        sleep_schedule: sleepSchedule,
        cleanliness_min: cleanlinessRange[0],
        cleanliness_max: cleanlinessRange[1],
        smoking_preference: smokingPreference,
        pet_preference: petPreference,
        guest_policy: guestPolicy,
        interests: interests,
        accommodation_types: accommodationTypes,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("discovery_settings")
        .upsert(settings, { onConflict: "user_id" });

      if (error) throw error;

      toast.success("Preferences saved! Redirecting to matches...");
      setTimeout(() => navigate("/browse"), 1500);
    } catch (error: any) {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleGuestPolicy = (policy: string) => {
    setGuestPolicy(prev => 
      prev.includes(policy) 
        ? prev.filter(p => p !== policy)
        : [...prev, policy]
    );
  };

  const toggleAccommodationType = (type: string) => {
    setAccommodationTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoompeerNavbar />
        <div className="container mx-auto px-6 pt-24 pb-12 flex justify-center">
          <p className="text-muted-foreground font-body">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      <div className="container mx-auto px-4 md:px-6 pt-24 pb-12 max-w-2xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2 text-youngNight">
          Discovery Settings
        </h1>
        <p className="text-muted-foreground font-body mb-8">
          Customize your preferences to find the perfect flatmate match.
        </p>

        <div className="space-y-8">
          {/* Location */}
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-azul/10 rounded-lg">
                <MapPin className="w-5 h-5 text-azul" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-youngNight">Location</h2>
            </div>
            
            <Label className="font-body text-sm text-muted-foreground mb-2 block">
              Find flatmates within {maxDistance} miles of your location
            </Label>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
            >
              <option value={1}>1 mile</option>
              <option value={5}>5 miles</option>
              <option value={10}>10 miles</option>
              <option value={25}>25 miles</option>
              <option value={50}>50 miles</option>
            </select>
          </section>

          {/* Living Preferences */}
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-azul/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-azul" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-youngNight">Living Preferences</h2>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="font-body text-sm text-muted-foreground mb-3 block">
                  Budget Range: £{minBudget} - £{maxBudget}/month
                </Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label className="text-xs font-body mb-1 block">Min</Label>
                    <Input
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(Number(e.target.value))}
                      className="font-body"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs font-body mb-1 block">Max</Label>
                    <Input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="font-body"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-body text-sm text-muted-foreground mb-3 block">
                  Accommodation Type
                </Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "apartment", label: "Entire Apartment" },
                    { value: "room", label: "Private Room" },
                    { value: "house", label: "Shared House" }
                  ].map(type => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors font-body text-sm ${
                        accommodationTypes.includes(type.value)
                          ? "bg-azul/10 border-azul text-azul"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <Checkbox
                        checked={accommodationTypes.includes(type.value)}
                        onCheckedChange={() => toggleAccommodationType(type.value)}
                      />
                      {type.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Lifestyle Matching */}
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-azul/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-azul" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-youngNight">Lifestyle Matching</h2>
            </div>

            <div className="space-y-6">
              {/* Sleep Schedule */}
              <div>
                <Label className="font-body text-sm text-muted-foreground mb-3 block">
                  Sleep Schedule Preference
                </Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "early", label: "Early Bird", icon: Sun },
                    { value: "night", label: "Night Owl", icon: Moon },
                    { value: "any", label: "Any", icon: null }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSleepSchedule(option.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors font-body text-sm ${
                        sleepSchedule === option.value
                          ? "bg-azul/10 border-azul text-azul"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {option.icon && <option.icon size={16} />}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cleanliness */}
              <div>
                <Label className="font-body text-sm text-muted-foreground mb-3 block">
                  Cleanliness Level: {cleanlinessRange[0]} - {cleanlinessRange[1]} (1=Relaxed, 5=Very Tidy)
                </Label>
                <Slider
                  value={cleanlinessRange}
                  onValueChange={setCleanlinessRange}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-body mt-1">
                  <span>Messy</span>
                  <span>Very Tidy</span>
                </div>
              </div>

              {/* Smoking */}
              <div>
                <Label className="font-body text-sm text-muted-foreground mb-3 block">
                  Smoking Preference
                </Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "non-smoker", label: "Non-Smoker Only" },
                    { value: "smoker", label: "Smoker OK" },
                    { value: "any", label: "Doesn't Matter" }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSmokingPreference(option.value)}
                      className={`px-4 py-2 rounded-lg border transition-colors font-body text-sm ${
                        smokingPreference === option.value
                          ? "bg-azul/10 border-azul text-azul"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pets */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Dog size={16} className="text-muted-foreground" />
                  <Label className="font-body text-sm text-muted-foreground">
                    Pet Preference
                  </Label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "has-pets", label: "Has Pets" },
                    { value: "wants-pets", label: "Wants Pets" },
                    { value: "no-pets", label: "No Pets" },
                    { value: "any", label: "Doesn't Matter" }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setPetPreference(option.value)}
                      className={`px-4 py-2 rounded-lg border transition-colors font-body text-sm ${
                        petPreference === option.value
                          ? "bg-azul/10 border-azul text-azul"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Policy */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-muted-foreground" />
                  <Label className="font-body text-sm text-muted-foreground">
                    Guest Policy (select all that apply)
                  </Label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "often-guests", label: "Often has guests" },
                    { value: "quiet-home", label: "Prefers quiet home" },
                    { value: "any", label: "Doesn't matter" }
                  ].map(option => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors font-body text-sm ${
                        guestPolicy.includes(option.value)
                          ? "bg-azul/10 border-azul text-azul"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <Checkbox
                        checked={guestPolicy.includes(option.value)}
                        onCheckedChange={() => toggleGuestPolicy(option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Interests */}
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-azul/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-azul" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-youngNight">Interests</h2>
            </div>
            
            <Label className="font-body text-sm text-muted-foreground mb-3 block">
              Select interests to find like-minded flatmates
            </Label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full border transition-colors font-body text-sm ${
                    interests.includes(interest)
                      ? "bg-azul text-white border-azul"
                      : "border-border hover:border-azul hover:text-azul"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </section>

          {/* Sticky Save Button */}
          <div className="sticky bottom-4 z-10 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-azul hover:bg-azul/90 text-white font-body font-semibold h-12 shadow-lg"
            >
              <Save size={18} className="mr-2" />
              {saving ? "Saving & Finding Matches..." : "Save & Find Matches"}
            </Button>
            <p className="text-center text-xs text-muted-foreground font-body mt-2">
              Your filters will be applied to your match results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverySettings;
