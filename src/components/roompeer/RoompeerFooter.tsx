import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Globe, Linkedin, Shield, Cookie, Home, HelpCircle, DollarSign } from "lucide-react";

const RoompeerFooter = () => {
  return (
    <footer className="bg-youngNight text-youngNight-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <h3 className="font-heading text-2xl font-bold mb-4">Roompeer</h3>
              <p className="font-body text-white/70 mb-4 max-w-md">
                Making it simple, stress-free, and pleasant to locate a compatible flatmate.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-3">
                <Link 
                  to="/browse-match" 
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <Home size={16} />
                  <span>Home</span>
                </Link>
                <Link 
                  to="/how-it-works-roompeer" 
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <HelpCircle size={16} />
                  <span>How It Works</span>
                </Link>
                <Link 
                  to="/roompeer-pricing" 
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <DollarSign size={16} />
                  <span>Pricing</span>
                </Link>
                <Link 
                  to="/safety-trust" 
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <Shield size={16} />
                  <span>Safety & Trust</span>
                </Link>
              </div>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-3">
                <Link 
                  to="/roompeer-privacy-policy" 
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <Shield size={16} />
                  <span>Privacy Policy</span>
                </Link>
                <Link 
                  to="/cookie-policy" 
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <Cookie size={16} />
                  <span>Cookie Policy</span>
                </Link>
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <a 
                  href="mailto:roompeer@gmail.com" 
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <Mail size={18} />
                  <span>roompeer@gmail.com</span>
                </a>
                <a 
                  href="tel:+36204339457" 
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <Phone size={18} />
                  <span>+36 20 433 9457</span>
                </a>
                <a 
                  href="https://www.roompeer.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <Globe size={18} />
                  <span>www.roompeer.com</span>
                </a>
                <a 
                  href="https://www.linkedin.com/company/roompeer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-body"
                >
                  <Linkedin size={18} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-white/60 text-sm">
              © {new Date().getFullYear()} Roompeer. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link 
                to="/roompeer-privacy-policy" 
                className="text-white/60 hover:text-white transition-colors font-body"
              >
                Privacy
              </Link>
              <Link 
                to="/cookie-policy" 
                className="text-white/60 hover:text-white transition-colors font-body"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RoompeerFooter;
