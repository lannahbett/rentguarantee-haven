import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Users, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Password requirements validation
  const requirements = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    numberOrSpecial: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allRequirementsMet = requirements.minLength && requirements.uppercase && requirements.numberOrSpecial;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired reset link. Please request a new one.");
        navigate("/forgot-password");
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      toast.error("Please meet all password requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      toast.success("Your password has been updated successfully.");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm font-body">
      {met ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-muted-foreground" />
      )}
      <span className={met ? "text-green-600" : "text-muted-foreground"}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-azul to-blue-heath p-2 rounded-lg">
              <Users size={32} className="text-white" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Roompeer</h1>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          {!success ? (
            <>
              <div className="text-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Create New Password
                </h2>
                <p className="text-muted-foreground font-body text-sm">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-body">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="font-body pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-body font-medium text-foreground">Password Requirements:</p>
                    <RequirementItem met={requirements.minLength} text="Minimum 8 characters" />
                    <RequirementItem met={requirements.uppercase} text="At least 1 uppercase letter" />
                    <RequirementItem met={requirements.numberOrSpecial} text="At least 1 number or special character" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-body">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`font-body pr-10 ${
                        confirmPassword.length > 0
                          ? passwordsMatch
                            ? "border-green-500 focus-visible:ring-green-500"
                            : "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-sm text-destructive font-body">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || !allRequirementsMet || !passwordsMatch}
                  className="w-full bg-azul hover:bg-azul/90 text-white font-body font-semibold disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                Password Updated!
              </h2>
              <p className="text-muted-foreground font-body text-sm">
                Your password has been updated successfully. Redirecting to your dashboard...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
