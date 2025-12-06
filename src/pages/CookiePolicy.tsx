import React from "react";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import RoompeerFooter from "@/components/roompeer/RoompeerFooter";
import SEOHelmet from "@/components/seo/SEOHelmet";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHelmet
        title="Cookie Policy - Roompeer | How We Use Cookies"
        description="Learn about the cookies Roompeer uses and how you can manage your cookie preferences."
      />
      <RoompeerNavbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-10">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-youngNight">
              Cookie Policy
            </h1>
            <p className="font-body text-youngNight/70 mb-8">
              Last Updated: December 6, 2024
            </p>

            <div className="prose max-w-none font-body text-youngNight/80 space-y-8">
              {/* What Are Cookies */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  What Are Cookies?
                </h2>
                <p className="mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.
                </p>
                <p className="mb-4">
                  Cookies help us remember your preferences, understand how you use our platform, and improve your overall experience on Roompeer.
                </p>
              </section>

              {/* How We Use Cookies */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  How We Use Cookies
                </h2>
                <p className="mb-4">
                  We use cookies for various purposes, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Keeping you signed in to your account</li>
                  <li>Remembering your preferences and settings</li>
                  <li>Understanding how you use our platform to improve it</li>
                  <li>Providing personalized content and recommendations</li>
                  <li>Analyzing site traffic and performance</li>
                </ul>
              </section>

              {/* Types of Cookies We Use */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Types of Cookies We Use
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-youngNight/20 mb-6">
                    <thead>
                      <tr className="bg-azulBlue/10">
                        <th className="border border-youngNight/20 px-4 py-3 text-left font-heading font-semibold text-youngNight">
                          Cookie Name
                        </th>
                        <th className="border border-youngNight/20 px-4 py-3 text-left font-heading font-semibold text-youngNight">
                          Purpose
                        </th>
                        <th className="border border-youngNight/20 px-4 py-3 text-left font-heading font-semibold text-youngNight">
                          Provider
                        </th>
                        <th className="border border-youngNight/20 px-4 py-3 text-left font-heading font-semibold text-youngNight">
                          Duration
                        </th>
                        <th className="border border-youngNight/20 px-4 py-3 text-left font-heading font-semibold text-youngNight">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-youngNight/20 px-4 py-3">roompeer_cookie_consent</td>
                        <td className="border border-youngNight/20 px-4 py-3">Stores your cookie preferences</td>
                        <td className="border border-youngNight/20 px-4 py-3">Roompeer</td>
                        <td className="border border-youngNight/20 px-4 py-3">1 year</td>
                        <td className="border border-youngNight/20 px-4 py-3">Necessary</td>
                      </tr>
                      <tr className="bg-youngNight/5">
                        <td className="border border-youngNight/20 px-4 py-3">sb-*-auth-token</td>
                        <td className="border border-youngNight/20 px-4 py-3">Authentication and session management</td>
                        <td className="border border-youngNight/20 px-4 py-3">Roompeer</td>
                        <td className="border border-youngNight/20 px-4 py-3">Session</td>
                        <td className="border border-youngNight/20 px-4 py-3">Necessary</td>
                      </tr>
                      <tr>
                        <td className="border border-youngNight/20 px-4 py-3">roompeer_preferences</td>
                        <td className="border border-youngNight/20 px-4 py-3">Remembers your display and notification preferences</td>
                        <td className="border border-youngNight/20 px-4 py-3">Roompeer</td>
                        <td className="border border-youngNight/20 px-4 py-3">1 year</td>
                        <td className="border border-youngNight/20 px-4 py-3">Preference</td>
                      </tr>
                      <tr className="bg-youngNight/5">
                        <td className="border border-youngNight/20 px-4 py-3">_ga, _gid</td>
                        <td className="border border-youngNight/20 px-4 py-3">Google Analytics - tracks site usage and behavior</td>
                        <td className="border border-youngNight/20 px-4 py-3">Google</td>
                        <td className="border border-youngNight/20 px-4 py-3">2 years / 24 hours</td>
                        <td className="border border-youngNight/20 px-4 py-3">Analytics</td>
                      </tr>
                      <tr>
                        <td className="border border-youngNight/20 px-4 py-3">_fbp</td>
                        <td className="border border-youngNight/20 px-4 py-3">Facebook Pixel - used for targeted advertising</td>
                        <td className="border border-youngNight/20 px-4 py-3">Facebook</td>
                        <td className="border border-youngNight/20 px-4 py-3">3 months</td>
                        <td className="border border-youngNight/20 px-4 py-3">Marketing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Cookie Categories */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Cookie Categories Explained
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-azulBlue/5 p-4 rounded-lg">
                    <h3 className="font-heading text-lg font-semibold text-youngNight mb-2">
                      Necessary Cookies
                    </h3>
                    <p>
                      These cookies are essential for the website to function properly. They enable core functionality such as security, authentication, and accessibility. You cannot opt out of these cookies as the site would not work correctly without them.
                    </p>
                  </div>
                  
                  <div className="bg-blueHeathButterfly/5 p-4 rounded-lg">
                    <h3 className="font-heading text-lg font-semibold text-youngNight mb-2">
                      Preference Cookies
                    </h3>
                    <p>
                      These cookies remember your settings and preferences to provide a more personalized experience. For example, they may remember your language preference or notification settings.
                    </p>
                  </div>
                  
                  <div className="bg-azulBlue/5 p-4 rounded-lg">
                    <h3 className="font-heading text-lg font-semibold text-youngNight mb-2">
                      Analytics Cookies
                    </h3>
                    <p>
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our platform and user experience.
                    </p>
                  </div>
                  
                  <div className="bg-blueHeathButterfly/5 p-4 rounded-lg">
                    <h3 className="font-heading text-lg font-semibold text-youngNight mb-2">
                      Marketing Cookies
                    </h3>
                    <p>
                      These cookies are used to deliver personalized advertisements that are relevant to you. They may also limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.
                    </p>
                  </div>
                </div>
              </section>

              {/* Managing Cookies */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Managing Your Cookie Preferences
                </h2>
                <p className="mb-4">
                  You can manage your cookie preferences at any time by clicking on the "Cookie Preferences" link in the website footer or by using the cookie consent banner that appears when you first visit our site.
                </p>
                <p className="mb-4">
                  Additionally, you can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>View what cookies are stored and delete them individually</li>
                  <li>Block third-party cookies</li>
                  <li>Block all cookies from specific sites</li>
                  <li>Block all cookies from being set</li>
                  <li>Delete all cookies when you close your browser</li>
                </ul>
                <p className="mb-4">
                  Please note that if you choose to block or delete cookies, some features of our website may not function properly.
                </p>
              </section>

              {/* Third-Party Cookies */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Third-Party Cookies
                </h2>
                <p className="mb-4">
                  Some cookies on our site are set by third-party services. We use these services to enhance your experience:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <strong>Google Analytics:</strong> Helps us understand how visitors use our site
                  </li>
                  <li>
                    <strong>Facebook Pixel:</strong> Allows us to measure the effectiveness of our advertising
                  </li>
                </ul>
                <p>
                  These third parties may use cookies to collect information about your online activities across different websites.
                </p>
              </section>

              {/* Updates to This Policy */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Updates to This Policy
                </h2>
                <p className="mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please check back periodically to stay informed about how we use cookies.
                </p>
              </section>

              {/* Contact Us */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Contact Us
                </h2>
                <p className="mb-4">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:roompeer@gmail.com"
                    className="text-azulBlue hover:underline"
                  >
                    roompeer@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <RoompeerFooter />
    </div>
  );
};

export default CookiePolicy;
