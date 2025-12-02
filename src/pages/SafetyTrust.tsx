import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import RoompeerFooter from "@/components/roompeer/RoompeerFooter";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  MessageSquareLock, 
  BookOpen, 
  Flag, 
  CheckCircle2, 
  Heart,
  Users,
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const safetyFeatures = [
  {
    Icon: ShieldCheck,
    title: "Profile Verification",
    description: "All profiles go through our verification process to ensure authenticity. We encourage users to verify their identity, adding an extra layer of trust to every interaction.",
  },
  {
    Icon: MessageSquareLock,
    title: "Secure In-App Messaging",
    description: "All conversations happen within our secure messaging system. Your personal contact details remain private until you choose to share them.",
  },
  {
    Icon: BookOpen,
    title: "Community Guidelines",
    description: "Our comprehensive community guidelines set clear expectations for respectful behavior. Every member agrees to treat others with dignity and respect.",
  },
  {
    Icon: Flag,
    title: "Easy Reporting System",
    description: "If something doesn't feel right, you can quickly report any concerning behavior. Our team reviews all reports promptly to maintain a safe environment.",
  },
];

const trustPrinciples = [
  {
    Icon: Heart,
    title: "Respect & Inclusivity",
    description: "We celebrate diversity and create a welcoming space for everyone.",
  },
  {
    Icon: Users,
    title: "Community First",
    description: "Every decision we make prioritizes the safety of our community.",
  },
  {
    Icon: Lock,
    title: "Data Privacy",
    description: "Your personal information is protected with industry-standard security.",
  },
];

const SafetyTrust = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <RoompeerNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-blue-heath/5 to-transparent">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-azul to-blue-heath rounded-2xl mb-6">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#232323] mb-6">
            Your Safety is Our Priority
          </h1>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            At Roompeer, we're committed to building a trusted community where everyone 
            can find their perfect flatmate with confidence and peace of mind.
          </p>
        </div>
      </section>

      {/* Safety Features Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-heading text-3xl font-bold text-[#232323] text-center mb-12">
            Our Safety Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-heath/10 rounded-xl flex items-center justify-center">
                    <feature.Icon size={28} className="text-blue-heath" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#232323] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground font-body leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-[#232323] mb-4">
              Trust & Transparency
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Transparency is at the heart of everything we do. We believe that honest, 
              open communication creates the foundation for positive living experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustPrinciples.map((principle) => (
              <div
                key={principle.title}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-heath/10 rounded-full mb-4">
                  <principle.Icon size={24} className="text-blue-heath" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#232323] mb-2">
                  {principle.title}
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-azul/5 to-blue-heath/5 border border-blue-heath/20 rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#232323] mb-6">
              Our Commitment to You
            </h2>
            
            <div className="space-y-4">
              {[
                "We never share your personal data with third parties without consent.",
                "Our team actively monitors the platform to prevent misuse.",
                "We continuously improve our safety features based on community feedback.",
                "We provide 24/7 support for urgent safety concerns.",
                "We take immediate action on reported violations of our community guidelines.",
              ].map((commitment, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-azul flex-shrink-0 mt-0.5" />
                  <p className="text-foreground font-body">{commitment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#232323] mb-4">
            Need to Report Something?
          </h2>
          <p className="text-muted-foreground font-body mb-8">
            If you encounter any behavior that violates our community guidelines or makes you 
            feel unsafe, please let us know. Your reports help us keep Roompeer safe for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/auth")}
              className="bg-azul hover:bg-azul/90 text-white font-body font-semibold rounded-full px-8"
            >
              Get Started Safely
            </Button>
            <Button
              variant="outline"
              className="font-body font-semibold rounded-full px-8 border-blue-heath text-blue-heath hover:bg-blue-heath/10"
            >
              <Flag size={18} className="mr-2" />
              Report a Concern
            </Button>
          </div>
        </div>
      </section>

      <RoompeerFooter />
    </div>
  );
};

export default SafetyTrust;
