import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Cookie, Settings, X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'roompeer_cookie_consent';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setShowBanner(false);
    setShowCustomize(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-border shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-[#232323] text-sm md:text-base">
                  This website uses cookies to ensure you get the best experience and to enable matching functionality.{' '}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    See our Cookie Policy for details.
                  </a>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="flex-1 md:flex-none border-[#232323] text-[#232323] hover:bg-gray-100"
              >
                Reject All
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCustomize(true)}
                className="flex-1 md:flex-none border-primary text-primary hover:bg-primary/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="flex-1 md:flex-none bg-[#1F64ED] hover:bg-[#1F64ED]/90 text-white"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customize Modal */}
      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#232323] flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Some cookies are essential and cannot be disabled.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label className="text-[#232323] font-medium">Necessary Cookies</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Essential for the website to function. Cannot be disabled.
                </p>
              </div>
              <Switch checked={true} disabled className="opacity-50" />
            </div>

            {/* Preference Cookies */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label className="text-[#232323] font-medium">Preference Cookies</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Remember your settings and preferences for a better experience.
                </p>
              </div>
              <Switch
                checked={preferences.preferences}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, preferences: checked }))
                }
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label className="text-[#232323] font-medium">Analytics Cookies</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, analytics: checked }))
                }
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Label className="text-[#232323] font-medium">Marketing Cookies</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Used to deliver personalized advertisements.
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, marketing: checked }))
                }
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCustomize(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustom} className="bg-[#1F64ED] hover:bg-[#1F64ED]/90 text-white">
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsentBanner;