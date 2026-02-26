import React, { useState } from "react";
import { Flag, Send, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const categories = [
  { value: "harassment", label: "Harassment or Abuse" },
  { value: "fake_profile", label: "Fake Profile" },
  { value: "scam", label: "Scam or Fraud" },
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "safety", label: "Safety Concern" },
  { value: "general", label: "Other" },
];

interface ReportConcernDialogProps {
  triggerClassName?: string;
}

const ReportConcernDialog = ({ triggerClassName }: ReportConcernDialogProps) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!description.trim()) {
      toast.error("Please describe your concern");
      return;
    }

    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Please log in to report a concern");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("concerns").insert({
      category,
      description: description.trim().slice(0, 2000),
      page_url: window.location.pathname,
      user_id: session.user.id,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to submit concern. Please try again.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setCategory("general");
      setDescription("");
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={triggerClassName || "font-body font-semibold rounded-full px-8 border-blue-heath text-blue-heath hover:bg-blue-heath/10"}
          onClick={(e) => e.stopPropagation()}
        >
          <Flag size={18} className="mr-2" />
          Report a Concern
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">Concern Reported</h3>
            <p className="text-muted-foreground font-body">Thank you. Our team will review your report promptly.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl font-bold">Report a Concern</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground font-body text-sm mb-4">
              Help us keep Roompeer safe. All reports are reviewed by our team.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-body font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body ring-offset-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-body font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the issue in detail..."
                  maxLength={2000}
                  required
                  className="w-full border border-border rounded-xl p-3 text-sm font-body resize-none h-32 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-background text-foreground"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body rounded-full"
              >
                <Send size={16} className="mr-2" />
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportConcernDialog;
