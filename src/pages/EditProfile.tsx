import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Camera, 
  ChevronDown, 
  Check, 
  Save,
  X,
  CalendarIcon,
  Sun,
  Moon,
  Sparkles,
  HelpCircle
} from "lucide-react";

const INTEREST_OPTIONS = [
  "Cooking", "Gaming", "Fitness", "Reading", "Travel", "Music", "Movies", 
  "Photography", "Art", "Sports", "Yoga", "Hiking", "Dancing", "Writing",
  "Technology", "Fashion", "Gardening", "Pets", "Meditation", "Coffee"
];

interface EditProfileProps {
  embedded?: boolean;
}

const EditProfile = ({ embedded = false }: EditProfileProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Section open states
  const [basicOpen, setBasicOpen] = useState(true);
  const [livingOpen, setLivingOpen] = useState(false);
  const [lifestyleOpen, setLifestyleOpen] = useState(false);
  const [lookingForOpen, setLookingForOpen] = useState(false);

  // Form data
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [desiredLocation, setDesiredLocation] = useState("");
  const [neighborhoods, setNeighborhoods] = useState("");
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(2000);
  const [moveInDate, setMoveInDate] = useState<Date | undefined>();
  const [accommodationType, setAccommodationType] = useState("");
  const [sleepSchedule, setSleepSchedule] = useState("flexible");
  const [cleanliness, setCleanliness] = useState([5]);
  const [smoker, setSmoker] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [wantsPets, setWantsPets] = useState(false);
  const [guestPolicy, setGuestPolicy] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestSearch, setInterestSearch] = useState("");
  const [idealFlatmate, setIdealFlatmate] = useState("");
  const [agePreferenceMin, setAgePreferenceMin] = useState(18);
  const [agePreferenceMax, setAgePreferenceMax] = useState(60);
  const [genderPreference, setGenderPreference] = useState("any");

  // Privacy toggles
  const [showBudget, setShowBudget] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showPhotos, setShowPhotos] = useState(true);
  const [showHabits, setShowHabits] = useState(true);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Load existing profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, age, bio, occupation, hobbies, budget, desired_location, move_in_date, accommodation_type, early_riser, night_owl, smoker, cleanliness_level, guest_preferences, ideal_flatmate, profile_completed, has_pets, wants_pets, show_budget, show_location, show_photos, show_habits, created_at, updated_at")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setAge(data.age?.toString() || "");
        setOccupation(data.occupation || "");
        setDesiredLocation(data.desired_location || "");
        setBudgetMin(data.budget ? Math.max(0, data.budget - 200) : 0);
        setBudgetMax(data.budget || 2000);
        setMoveInDate(data.move_in_date ? new Date(data.move_in_date) : undefined);
        setAccommodationType(data.accommodation_type || "");
        
        // Set sleep schedule based on early_riser/night_owl
        if (data.early_riser) setSleepSchedule("early");
        else if (data.night_owl) setSleepSchedule("night");
        else setSleepSchedule("flexible");
        
        // Map cleanliness level to slider value
        const cleanlinessMap: Record<string, number> = {
          "very-clean": 9,
          "clean": 7,
          "moderate": 5,
          "relaxed": 3
        };
        setCleanliness([cleanlinessMap[data.cleanliness_level || "moderate"] || 5]);
        
        setSmoker(data.smoker || false);
        setHasPets(data.has_pets || false);
        setWantsPets(data.wants_pets || false);
        setGuestPolicy(data.guest_preferences || "");
        setInterests(data.hobbies || []);
        setIdealFlatmate(data.ideal_flatmate || "");
        // Privacy toggles
        setShowBudget(data.show_budget ?? true);
        setShowLocation(data.show_location ?? true);
        setShowPhotos(data.show_photos ?? true);
        setShowHabits(data.show_habits ?? true);
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Mark as changed when any field updates
  const markChanged = useCallback(() => {
    setHasChanges(true);
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Map cleanliness slider to level
      const cleanlinessLevel = cleanliness[0] >= 8 ? "very-clean" 
        : cleanliness[0] >= 6 ? "clean" 
        : cleanliness[0] >= 4 ? "moderate" 
        : "relaxed";

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio,
          age: age ? parseInt(age) : null,
          occupation,
          desired_location: desiredLocation,
          budget: budgetMax,
          move_in_date: moveInDate ? format(moveInDate, "yyyy-MM-dd") : null,
          accommodation_type: accommodationType,
          early_riser: sleepSchedule === "early",
          night_owl: sleepSchedule === "night",
          cleanliness_level: cleanlinessLevel,
          smoker,
          has_pets: hasPets,
          wants_pets: wantsPets,
          guest_preferences: guestPolicy,
          hobbies: interests,
          ideal_flatmate: idealFlatmate,
          profile_completed: true,
          show_budget: showBudget,
          show_location: showLocation,
          show_photos: showPhotos,
          show_habits: showHabits,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setSaved(true);
      setHasChanges(false);
      toast.success("Profile saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm("Discard unsaved changes?")) {
        navigate("/profile");
      }
    } else {
      navigate("/profile");
    }
  };

  const toggleInterest = (interest: string) => {
    markChanged();
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const filteredInterests = INTEREST_OPTIONS.filter(i => 
    i.toLowerCase().includes(interestSearch.toLowerCase())
  );

  const getCleanlinessEmoji = (value: number) => {
    if (value >= 8) return "✨";
    if (value >= 6) return "🧹";
    if (value >= 4) return "🏠";
    return "🛋️";
  };

  const getCleanlinessLabel = (value: number) => {
    if (value >= 8) return "Very Tidy";
    if (value >= 6) return "Clean";
    if (value >= 4) return "Moderate";
    return "Relaxed";
  };

  if (loading) {
    if (embedded) {
      return <p className="text-muted-foreground font-body">Loading profile...</p>;
    }
    return (
      <div className="min-h-screen bg-background">
        <RoompeerNavbar />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <p className="text-muted-foreground font-body">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Embedded version without navbar
  if (embedded) {
    return (
      <div className="space-y-6">
        {/* Save Button for embedded */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-azul hover:bg-azul/90 text-white font-body font-semibold"
          >
            {saving ? "Saving..." : saved ? <><Check size={18} className="mr-2" />Saved</> : <><Save size={18} className="mr-2" />Save Changes</>}
          </Button>
        </div>
        
        {saved && (
          <p className="text-green-600 font-body text-sm flex items-center gap-1">
            <Check size={14} /> All changes saved
          </p>
        )}

        {/* Profile Picture Section */}
        <div className="border border-border rounded-lg p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="bg-gradient-to-br from-azul to-blue-heath p-8 rounded-full">
                <Users size={48} className="text-white" />
              </div>
              <button 
                className="absolute bottom-0 right-0 bg-blue-heath text-white p-2 rounded-full hover:bg-blue-heath/90 transition-colors"
                onClick={() => toast.info("Photo upload coming soon!")}
              >
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-[#232323]">Profile Picture</h2>
              <p className="text-muted-foreground font-body text-sm">
                Add a photo to help others recognize you
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 font-body text-sm"
                onClick={() => toast.info("Photo upload coming soon!")}
              >
                Upload Photo
              </Button>
            </div>
          </div>
        </div>

        {/* Section 1: Basic Information */}
        <Collapsible open={basicOpen} onOpenChange={setBasicOpen}>
          <div className="border border-border rounded-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h2 className="font-heading text-xl font-bold text-azul">Basic Information</h2>
              <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", basicOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-body font-medium">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); markChanged(); }}
                    placeholder="John Doe"
                    className="font-body"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="font-body font-medium">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => { setAge(e.target.value); markChanged(); }}
                      placeholder="25"
                      className="font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation" className="font-body font-medium">Occupation</Label>
                    <Input
                      id="occupation"
                      value={occupation}
                      onChange={(e) => { setOccupation(e.target.value); markChanged(); }}
                      placeholder="Software Developer"
                      className="font-body"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="bio" className="font-body font-medium">Bio / Headline</Label>
                    <span className={cn(
                      "text-xs font-body",
                      bio.length > 200 ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {bio.length}/200
                    </span>
                  </div>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => { setBio(e.target.value.slice(0, 200)); markChanged(); }}
                    placeholder="Tell others about yourself in a few words..."
                    rows={3}
                    className="font-body"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Section 2: Living Preferences */}
        <Collapsible open={livingOpen} onOpenChange={setLivingOpen}>
          <div className="border border-border rounded-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h2 className="font-heading text-xl font-bold text-azul">Living Preferences</h2>
              <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", livingOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="font-body font-medium">Desired Location</Label>
                  <Input
                    id="location"
                    value={desiredLocation}
                    onChange={(e) => { setDesiredLocation(e.target.value); markChanged(); }}
                    placeholder="London, UK"
                    className="font-body"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-body font-medium">Budget Range (Monthly)</Label>
                  <div className="pt-2 pb-4">
                    <Slider
                      value={[budgetMin, budgetMax]}
                      onValueChange={(val) => { setBudgetMin(val[0]); setBudgetMax(val[1]); markChanged(); }}
                      max={5000}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm font-body text-muted-foreground">
                      <span>€{budgetMin}</span>
                      <span>€{budgetMax}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-body font-medium">Move-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-body",
                          !moveInDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {moveInDate ? format(moveInDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={moveInDate}
                        onSelect={(date) => { setMoveInDate(date); markChanged(); }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accommodationType" className="font-body font-medium">Accommodation Type</Label>
                  <select
                    id="accommodationType"
                    value={accommodationType}
                    onChange={(e) => { setAccommodationType(e.target.value); markChanged(); }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-body focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="room">Private Room</option>
                    <option value="shared-room">Shared Room</option>
                  </select>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Section 3: Lifestyle */}
        <Collapsible open={lifestyleOpen} onOpenChange={setLifestyleOpen}>
          <div className="border border-border rounded-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h2 className="font-heading text-xl font-bold text-azul">Lifestyle</h2>
              <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", lifestyleOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 space-y-6">
                {/* Sleep Schedule */}
                <div className="space-y-3">
                  <Label className="font-body font-medium">Sleep Schedule</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "early", label: "Early Bird", icon: Sun },
                      { value: "night", label: "Night Owl", icon: Moon },
                      { value: "flexible", label: "Flexible", icon: Sparkles }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => { setSleepSchedule(value); markChanged(); }}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2",
                          sleepSchedule === value 
                            ? "border-azul bg-azul/5" 
                            : "border-border hover:border-muted-foreground"
                        )}
                      >
                        <Icon size={24} className={sleepSchedule === value ? "text-azul" : "text-muted-foreground"} />
                        <span className={cn(
                          "text-sm font-body font-medium",
                          sleepSchedule === value ? "text-azul" : "text-muted-foreground"
                        )}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cleanliness Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-body font-medium">Cleanliness Level</Label>
                    <span className="text-sm font-body">
                      {getCleanlinessEmoji(cleanliness[0])} {getCleanlinessLabel(cleanliness[0])}
                    </span>
                  </div>
                  <Slider
                    value={cleanliness}
                    onValueChange={(val) => { setCleanliness(val); markChanged(); }}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs font-body text-muted-foreground">
                    <span>Relaxed</span>
                    <span>Very Tidy</span>
                  </div>
                </div>

                {/* Smoking & Pets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="font-body font-medium">Smoking</Label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => { setSmoker(false); markChanged(); }}
                        className={cn(
                          "flex-1 py-3 rounded-lg border-2 transition-all font-body text-sm font-medium",
                          !smoker ? "border-azul bg-azul/5 text-azul" : "border-border text-muted-foreground"
                        )}
                      >
                        Non-Smoker
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSmoker(true); markChanged(); }}
                        className={cn(
                          "flex-1 py-3 rounded-lg border-2 transition-all font-body text-sm font-medium",
                          smoker ? "border-azul bg-azul/5 text-azul" : "border-border text-muted-foreground"
                        )}
                      >
                        Smoker
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-body font-medium">Pets</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasPets}
                          onChange={(e) => { setHasPets(e.target.checked); markChanged(); }}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm font-body">I have pets</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={wantsPets}
                          onChange={(e) => { setWantsPets(e.target.checked); markChanged(); }}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm font-body">Open to pets</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Guest Policy */}
                <div className="space-y-2">
                  <Label htmlFor="guestPolicy" className="font-body font-medium">Guest Policy</Label>
                  <select
                    id="guestPolicy"
                    value={guestPolicy}
                    onChange={(e) => { setGuestPolicy(e.target.value); markChanged(); }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-body focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select preference</option>
                    <option value="often">Often have guests</option>
                    <option value="sometimes">Occasional guests</option>
                    <option value="rarely">Prefer quiet home</option>
                    <option value="flexible">No preference</option>
                  </select>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label className="font-body font-medium">Interests & Hobbies</Label>
                  <Input
                    placeholder="Search interests..."
                    value={interestSearch}
                    onChange={(e) => setInterestSearch(e.target.value)}
                    className="font-body mb-3"
                  />
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {filteredInterests.map(interest => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-body transition-all",
                          interests.includes(interest)
                            ? "bg-azul text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  {interests.length > 0 && (
                    <p className="text-xs text-muted-foreground font-body">
                      Selected: {interests.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Section 4: What You're Looking For */}
        <Collapsible open={lookingForOpen} onOpenChange={setLookingForOpen}>
          <div className="border border-border rounded-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h2 className="font-heading text-xl font-bold text-azul">What You're Looking For</h2>
              <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", lookingForOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="idealFlatmate" className="font-body font-medium">Ideal Flatmate Description</Label>
                  <Textarea
                    id="idealFlatmate"
                    value={idealFlatmate}
                    onChange={(e) => { setIdealFlatmate(e.target.value); markChanged(); }}
                    placeholder="Describe your ideal flatmate - personality, habits, shared interests..."
                    rows={4}
                    className="font-body"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-body font-medium">Preferred Age Range</Label>
                  <div className="pt-2 pb-4">
                    <Slider
                      value={[agePreferenceMin, agePreferenceMax]}
                      onValueChange={(val) => { setAgePreferenceMin(val[0]); setAgePreferenceMax(val[1]); markChanged(); }}
                      min={18}
                      max={70}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm font-body text-muted-foreground">
                      <span>{agePreferenceMin} years</span>
                      <span>{agePreferenceMax} years</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-body font-medium">Gender Preference (Optional)</Label>
                  <select
                    value={genderPreference}
                    onChange={(e) => { setGenderPreference(e.target.value); markChanged(); }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-body focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="any">No preference</option>
                    <option value="male">Male only</option>
                    <option value="female">Female only</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Section 5: Privacy Settings */}
        <Collapsible open={privacyOpen} onOpenChange={setPrivacyOpen}>
          <div className="border border-border rounded-lg overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h2 className="font-heading text-xl font-bold text-azul">Privacy Settings</h2>
              <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", privacyOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-6 pb-6 space-y-4">
                <p className="text-sm text-muted-foreground font-body">Control what other users can see on your profile. Hidden fields show as "Private".</p>
                {[
                  { label: "Show Budget", desc: "Let others see your monthly budget", value: showBudget, set: setShowBudget },
                  { label: "Show Location", desc: "Let others see your desired location", value: showLocation, set: setShowLocation },
                  { label: "Show Photos", desc: "Let others see your profile photos", value: showPhotos, set: setShowPhotos },
                  { label: "Show Habits", desc: "Let others see lifestyle details (sleep, smoking, pets, cleanliness)", value: showHabits, set: setShowHabits },
                ].map(({ label, desc, value, set }) => (
                  <div key={label} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-body font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground font-body">{desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { set(!value); markChanged(); }}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                        value ? "bg-azul" : "bg-input"
                      )}
                    >
                      <span className={cn(
                        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
                        value ? "translate-x-5" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    );
  }

  // Full page version
  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      {/* Sticky Save Bar - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 font-body"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-azul hover:bg-azul/90 text-white font-body font-semibold"
          >
            {saving ? "Saving..." : saved ? <><Check size={18} className="mr-2" />Saved</> : "Save Changes"}
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-6 pt-24 pb-32 md:pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Header with Save Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold text-[#232323]">Edit Your Profile</h1>
              {saved && (
                <p className="text-green-600 font-body text-sm mt-1 flex items-center gap-1">
                  <Check size={14} /> All changes saved
                </p>
              )}
            </div>
            <div className="hidden md:flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="font-body"
              >
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-azul hover:bg-azul/90 text-white font-body font-semibold"
              >
                {saving ? "Saving..." : <><Save size={18} className="mr-2" />Save Changes</>}
              </Button>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-azul to-blue-heath p-8 rounded-full">
                  <Users size={48} className="text-white" />
                </div>
                <button 
                  className="absolute bottom-0 right-0 bg-blue-heath text-white p-2 rounded-full hover:bg-blue-heath/90 transition-colors"
                  onClick={() => toast.info("Photo upload coming soon!")}
                >
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-[#232323]">Profile Picture</h2>
                <p className="text-muted-foreground font-body text-sm">
                  Add a photo to help others recognize you
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 font-body text-sm"
                  onClick={() => toast.info("Photo upload coming soon!")}
                >
                  Upload Photo
                </Button>
              </div>
            </div>
          </div>

          {/* Section 1: Basic Information */}
          <Collapsible open={basicOpen} onOpenChange={setBasicOpen} className="mb-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="font-heading text-xl font-bold text-azul">Basic Information</h2>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", basicOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-body font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); markChanged(); }}
                      placeholder="John Doe"
                      className="font-body"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="font-body font-medium">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => { setAge(e.target.value); markChanged(); }}
                        placeholder="25"
                        className="font-body"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occupation" className="font-body font-medium">Occupation</Label>
                      <Input
                        id="occupation"
                        value={occupation}
                        onChange={(e) => { setOccupation(e.target.value); markChanged(); }}
                        placeholder="Software Developer"
                        className="font-body"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bio" className="font-body font-medium">Bio / Headline</Label>
                      <span className={cn(
                        "text-xs font-body",
                        bio.length > 200 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {bio.length}/200
                      </span>
                    </div>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => { setBio(e.target.value.slice(0, 200)); markChanged(); }}
                      placeholder="Tell others about yourself in a few words..."
                      rows={3}
                      className="font-body"
                    />
                    <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                      <HelpCircle size={12} />
                      This appears on your profile card when others browse
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Section 2: Living Preferences */}
          <Collapsible open={livingOpen} onOpenChange={setLivingOpen} className="mb-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="font-heading text-xl font-bold text-azul">Living Preferences</h2>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", livingOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-body font-medium">Desired Location</Label>
                    <Input
                      id="location"
                      value={desiredLocation}
                      onChange={(e) => { setDesiredLocation(e.target.value); markChanged(); }}
                      placeholder="London, UK"
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body font-medium">Budget Range (Monthly)</Label>
                    <div className="pt-2 pb-4">
                      <Slider
                        value={[budgetMin, budgetMax]}
                        onValueChange={(val) => { setBudgetMin(val[0]); setBudgetMax(val[1]); markChanged(); }}
                        max={5000}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-sm font-body text-muted-foreground">
                        <span>€{budgetMin}</span>
                        <span>€{budgetMax}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body font-medium">Move-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-body",
                            !moveInDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {moveInDate ? format(moveInDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={moveInDate}
                          onSelect={(date) => { setMoveInDate(date); markChanged(); }}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accommodationType" className="font-body font-medium">Accommodation Type</Label>
                    <select
                      id="accommodationType"
                      value={accommodationType}
                      onChange={(e) => { setAccommodationType(e.target.value); markChanged(); }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-body focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="room">Private Room</option>
                      <option value="shared-room">Shared Room</option>
                    </select>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Section 3: Lifestyle */}
          <Collapsible open={lifestyleOpen} onOpenChange={setLifestyleOpen} className="mb-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="font-heading text-xl font-bold text-azul">Lifestyle</h2>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", lifestyleOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-6">
                  {/* Sleep Schedule */}
                  <div className="space-y-3">
                    <Label className="font-body font-medium">Sleep Schedule</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "early", label: "Early Bird", icon: Sun },
                        { value: "night", label: "Night Owl", icon: Moon },
                        { value: "flexible", label: "Flexible", icon: Sparkles }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => { setSleepSchedule(value); markChanged(); }}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2",
                            sleepSchedule === value 
                              ? "border-azul bg-azul/5" 
                              : "border-border hover:border-muted-foreground"
                          )}
                        >
                          <Icon size={24} className={sleepSchedule === value ? "text-azul" : "text-muted-foreground"} />
                          <span className={cn(
                            "text-sm font-body font-medium",
                            sleepSchedule === value ? "text-azul" : "text-muted-foreground"
                          )}>
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cleanliness Slider */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-body font-medium">Cleanliness Level</Label>
                      <span className="text-sm font-body">
                        {getCleanlinessEmoji(cleanliness[0])} {getCleanlinessLabel(cleanliness[0])}
                      </span>
                    </div>
                    <Slider
                      value={cleanliness}
                      onValueChange={(val) => { setCleanliness(val); markChanged(); }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs font-body text-muted-foreground">
                      <span>Relaxed</span>
                      <span>Very Tidy</span>
                    </div>
                  </div>

                  {/* Smoking & Pets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="font-body font-medium">Smoking</Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => { setSmoker(false); markChanged(); }}
                          className={cn(
                            "flex-1 py-3 rounded-lg border-2 transition-all font-body text-sm font-medium",
                            !smoker ? "border-azul bg-azul/5 text-azul" : "border-border text-muted-foreground"
                          )}
                        >
                          Non-Smoker
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSmoker(true); markChanged(); }}
                          className={cn(
                            "flex-1 py-3 rounded-lg border-2 transition-all font-body text-sm font-medium",
                            smoker ? "border-azul bg-azul/5 text-azul" : "border-border text-muted-foreground"
                          )}
                        >
                          Smoker
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-body font-medium">Pets</Label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasPets}
                            onChange={(e) => { setHasPets(e.target.checked); markChanged(); }}
                            className="w-4 h-4 rounded border-border"
                          />
                          <span className="text-sm font-body">I have pets</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={wantsPets}
                            onChange={(e) => { setWantsPets(e.target.checked); markChanged(); }}
                            className="w-4 h-4 rounded border-border"
                          />
                          <span className="text-sm font-body">Open to pets</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Guest Policy */}
                  <div className="space-y-2">
                    <Label htmlFor="guestPolicy" className="font-body font-medium">Guest Policy</Label>
                    <select
                      id="guestPolicy"
                      value={guestPolicy}
                      onChange={(e) => { setGuestPolicy(e.target.value); markChanged(); }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-body focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select preference</option>
                      <option value="often">Often have guests</option>
                      <option value="sometimes">Occasional guests</option>
                      <option value="rarely">Prefer quiet home</option>
                      <option value="flexible">No preference</option>
                    </select>
                  </div>

                  {/* Interests */}
                  <div className="space-y-3">
                    <Label className="font-body font-medium">Interests & Hobbies</Label>
                    <Input
                      placeholder="Search interests..."
                      value={interestSearch}
                      onChange={(e) => setInterestSearch(e.target.value)}
                      className="font-body mb-3"
                    />
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {filteredInterests.map(interest => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-body transition-all",
                            interests.includes(interest)
                              ? "bg-azul text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                    {interests.length > 0 && (
                      <p className="text-xs text-muted-foreground font-body">
                        Selected: {interests.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Section 4: What You're Looking For */}
          <Collapsible open={lookingForOpen} onOpenChange={setLookingForOpen} className="mb-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="font-heading text-xl font-bold text-azul">What You're Looking For</h2>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", lookingForOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="idealFlatmate" className="font-body font-medium">Ideal Flatmate Description</Label>
                    <Textarea
                      id="idealFlatmate"
                      value={idealFlatmate}
                      onChange={(e) => { setIdealFlatmate(e.target.value); markChanged(); }}
                      placeholder="Describe your ideal flatmate - personality, habits, shared interests..."
                      rows={4}
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body font-medium">Preferred Age Range</Label>
                    <div className="pt-2 pb-4">
                      <Slider
                        value={[agePreferenceMin, agePreferenceMax]}
                        onValueChange={(val) => { setAgePreferenceMin(val[0]); setAgePreferenceMax(val[1]); markChanged(); }}
                        min={18}
                        max={70}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2 text-sm font-body text-muted-foreground">
                        <span>{agePreferenceMin} years</span>
                        <span>{agePreferenceMax} years</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-body font-medium">Gender Preference (Optional)</Label>
                    <select
                      value={genderPreference}
                      onChange={(e) => { setGenderPreference(e.target.value); markChanged(); }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-body focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="any">No preference</option>
                      <option value="male">Male only</option>
                      <option value="female">Female only</option>
                      <option value="other">Other</option>
                    </select>
                    <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                      <HelpCircle size={12} />
                      This is optional and helps filter your matches
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Section 5: Privacy Settings */}
          <Collapsible open={privacyOpen} onOpenChange={setPrivacyOpen} className="mb-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="font-heading text-xl font-bold text-azul">Privacy Settings</h2>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", privacyOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-4">
                  <p className="text-sm text-muted-foreground font-body">Control what other users can see on your profile. Hidden fields show as "Private".</p>
                  {[
                    { label: "Show Budget", desc: "Let others see your monthly budget", value: showBudget, set: setShowBudget },
                    { label: "Show Location", desc: "Let others see your desired location", value: showLocation, set: setShowLocation },
                    { label: "Show Photos", desc: "Let others see your profile photos", value: showPhotos, set: setShowPhotos },
                    { label: "Show Habits", desc: "Let others see lifestyle details (sleep, smoking, pets, cleanliness)", value: showHabits, set: setShowHabits },
                  ].map(({ label, desc, value, set }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-body font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground font-body">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { set(!value); markChanged(); }}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                          value ? "bg-azul" : "bg-input"
                        )}
                      >
                        <span className={cn(
                          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
                          value ? "translate-x-5" : "translate-x-0"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
