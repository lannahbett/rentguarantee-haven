import React, { useState } from "react";
import { MessageSquarePlus, Star, Send, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    await supabase.from("feedback" as any).insert({
      rating,
      comment: comment || null,
      page_url: window.location.pathname,
      user_id: session?.user?.id || null,
    } as any);

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setRating(0);
      setComment("");
    }, 2000);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-azul hover:bg-azul/90 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Give feedback"
      >
        <MessageSquarePlus size={22} />
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-foreground text-background text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none font-body">
          Give Feedback
        </div>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-2xl animate-scale-in">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">Thank you!</h3>
                <p className="text-muted-foreground font-body">Your feedback helps us improve Roompeer.</p>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-xl font-bold text-foreground mb-1">How's your experience?</h3>
                <p className="text-muted-foreground font-body text-sm mb-6">Rate and share your thoughts with us</p>

                {/* Stars */}
                <div className="flex gap-2 justify-center mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        size={36}
                        className={`transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Comment */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us more (optional)..."
                  className="w-full border border-border rounded-xl p-3 text-sm font-body resize-none h-24 focus:ring-2 focus:ring-azul/20 focus:border-azul outline-none bg-background text-foreground"
                />

                <Button
                  onClick={handleSubmit}
                  disabled={rating === 0 || loading}
                  className="w-full mt-4 bg-azul hover:bg-azul/90 text-white font-body rounded-full"
                >
                  <Send size={16} className="mr-2" />
                  {loading ? "Sending..." : "Submit Feedback"}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
