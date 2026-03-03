import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Users, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // If email confirmation is required, user won't have a session yet
          if (!data.session) {
            setShowConfirmation(true);
          } else {
            // Auto-confirmed (shouldn't happen with email confirmation enabled)
            const { error: profileError } = await supabase
              .from("profiles")
              .insert({
                user_id: data.user.id,
                email: email,
                full_name: fullName,
              });
            if (profileError && !profileError.message.includes("duplicate")) {
              console.error("Profile creation error:", profileError);
            }
            toast.success("Account created! Complete your profile to get started.");
            navigate("/onboarding");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Handle unconfirmed email
          if (error.message.toLowerCase().includes("email not confirmed")) {
            toast.error("Please confirm your email address first. Check your inbox for the confirmation link.");
            return;
          }
          throw error;
        }

        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Confirmation screen after signup
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <div className="bg-azul/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-azul" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Check your email</h2>
            <p className="text-muted-foreground font-body mb-6">
              We've sent a confirmation link to <span className="font-semibold text-foreground">{email}</span>. 
              Click the link to activate your account.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground font-body">
                Didn't receive the email? Check your spam folder or try signing up again.
              </p>
            </div>
            <Button
              onClick={() => { setShowConfirmation(false); setIsSignUp(false); }}
              variant="outline"
              className="w-full font-body"
            >
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-muted-foreground font-body">
            {isSignUp ? "Create your account to find your perfect flatmate" : "Welcome back! Sign in to continue"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-body">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isSignUp}
                  className="font-body"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-body"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-body">Password</Label>
                {!isSignUp && (
                  <Link
                    to="/forgot-password"
                    className="text-azul hover:underline font-body text-xs"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-body"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-azul hover:bg-azul/90 text-white font-body font-semibold"
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-azul hover:underline font-body text-sm"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
