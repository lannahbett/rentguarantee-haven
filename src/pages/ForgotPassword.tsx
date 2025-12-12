import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Users, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSubmitted(true);
    } catch (error: any) {
      // Always show same message to prevent email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

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
          {!submitted ? (
            <>
              <div className="text-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Reset Your Password
                </h2>
                <p className="text-muted-foreground font-body text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body">Email Address</Label>
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-azul hover:bg-azul/90 text-white font-body font-semibold"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto w-12 h-12 bg-azul/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-azul" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                Check Your Email
              </h2>
              <p className="text-muted-foreground font-body text-sm mb-4">
                If an account exists with this email, you will receive reset instructions shortly.
              </p>
              <p className="text-muted-foreground font-body text-xs">
                The reset link will expire after 24 hours and can only be used once.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-azul hover:underline font-body text-sm"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
