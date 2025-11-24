import React from "react";
import { Mail, Phone, Globe, Linkedin } from "lucide-react";

const RoompeerFooter = () => {
  return (
    <footer className="bg-youngNight text-youngNight-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <h3 className="font-heading text-2xl font-bold mb-4">Roompeer</h3>
              <p className="font-body text-white/70 mb-4 max-w-md">
                Making it simple, stress-free, and pleasant to locate a compatible flatmate.
              </p>
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
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Follow Us</h4>
              <div className="space-y-3">
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
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="font-body text-white/60 text-sm">
              © {new Date().getFullYear()} Roompeer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RoompeerFooter;
