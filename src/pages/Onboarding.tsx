import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Users } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form data
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [budget, setBudget] = useState("");
  const [desiredLocation, setDesiredLocation] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [accommodationType, setAccommodationType] = useState("");
  const [earlyRiser, setEarlyRiser] = useState(false);
  const [nightOwl, setNightOwl] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [cleanlinessLevel, setCleanlinessLevel] = useState("");
  const [guestPreferences, setGuestPreferences] = useState("");
  const [idealFlatmate, setIdealFlatmate] = useState("");

  useEffect(() => {
    const ensureProfileExists = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      // Create profile if it doesn't exist yet (e.g., after email confirmation)
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (!existing) {
        const fullName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User";
        await supabase.from("profiles").insert({
          user_id: session.user.id,
          email: session.user.email || "",
          full_name: fullName,
        });
      }
    };
    ensureProfileExists();
  }, [navigate]);

  const progress = (step / 4) * 100;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const hobbiesArray = hobbies.split(",").map(h => h.trim()).filter(Boolean);

      const { error } = await supabase
        .from("profiles")
        .update({
          bio,
          age: age ? parseInt(age) : null,
          occupation,
          hobbies: hobbiesArray,
          budget: budget ? parseFloat(budget) : null,
          desired_location: desiredLocation,
          move_in_date: moveInDate || null,
          accommodation_type: accommodationType,
          early_riser: earlyRiser,
          night_owl: nightOwl,
          smoker,
          cleanliness_level: cleanlinessLevel,
          guest_preferences: guestPreferences,
          ideal_flatmate: idealFlatmate,
          profile_completed: true,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Profile completed! Let's find your perfect flatmate.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-azul to-blue-heath p-2 rounded-lg">
              <Users size={32} className="text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Complete Your Profile</h1>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-muted-foreground font-body mt-2">Step {step} of 4</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold mb-4">About You</h2>
              
              <div className="space-y-2">
                <Label htmlFor="bio" className="font-body">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="font-body">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className="font-body">Occupation</Label>
                <Input
                  id="occupation"
                  type="text"
                  placeholder="Software Developer"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hobbies" className="font-body">Hobbies (comma-separated)</Label>
                <Input
                  id="hobbies"
                  type="text"
                  placeholder="Reading, Cooking, Hiking"
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  className="font-body"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold mb-4">Living Preferences</h2>
              
              <div className="space-y-2">
                <Label htmlFor="budget" className="font-body">Budget (monthly)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="800"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="font-body">Desired Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="London, UK"
                  value={desiredLocation}
                  onChange={(e) => setDesiredLocation(e.target.value)}
                  className="font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moveInDate" className="font-body">Move-in Date</Label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="font-body"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accommodationType" className="font-body">Type of Accommodation</Label>
                <select
                  id="accommodationType"
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-body"
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="room">Room</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold mb-4">Lifestyle</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="earlyRiser"
                    checked={earlyRiser}
                    onChange={(e) => setEarlyRiser(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="earlyRiser" className="font-body cursor-pointer">Early Riser</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="nightOwl"
                    checked={nightOwl}
                    onChange={(e) => setNightOwl(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="nightOwl" className="font-body cursor-pointer">Night Owl</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="smoker"
                    checked={smoker}
                    onChange={(e) => setSmoker(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="smoker" className="font-body cursor-pointer">Smoker</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleanlinessLevel" className="font-body">Cleanliness Level</Label>
                <select
                  id="cleanlinessLevel"
                  value={cleanlinessLevel}
                  onChange={(e) => setCleanlinessLevel(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-body"
                >
                  <option value="">Select level</option>
                  <option value="very-clean">Very Clean</option>
                  <option value="clean">Clean</option>
                  <option value="moderate">Moderate</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestPreferences" className="font-body">Guest Preferences</Label>
                <Textarea
                  id="guestPreferences"
                  placeholder="How do you feel about guests?"
                  value={guestPreferences}
                  onChange={(e) => setGuestPreferences(e.target.value)}
                  rows={3}
                  className="font-body"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold mb-4">Ideal Flatmate</h2>
              
              <div className="space-y-2">
                <Label htmlFor="idealFlatmate" className="font-body">
                  What are you looking for in a flatmate?
                </Label>
                <Textarea
                  id="idealFlatmate"
                  placeholder="Describe your ideal flatmate..."
                  value={idealFlatmate}
                  onChange={(e) => setIdealFlatmate(e.target.value)}
                  rows={6}
                  className="font-body"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="font-body"
              >
                Back
              </Button>
            )}
            
            {step < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-azul hover:bg-azul/90 text-white font-body font-semibold"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto bg-azul hover:bg-azul/90 text-white font-body font-semibold"
              >
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
