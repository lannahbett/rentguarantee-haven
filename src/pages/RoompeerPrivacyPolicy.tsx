import React from "react";
import RoompeerNavbar from "@/components/roompeer/RoompeerNavbar";
import RoompeerFooter from "@/components/roompeer/RoompeerFooter";
import SEOHelmet from "@/components/seo/SEOHelmet";

const RoompeerPrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHelmet
        title="Privacy Policy - Roompeer | Your Data, Your Rights"
        description="Learn how Roompeer collects, uses, and protects your personal data. Understand your GDPR and CCPA rights."
      />
      <RoompeerNavbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-10">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-youngNight">
              Privacy Policy
            </h1>
            <p className="font-body text-youngNight/70 mb-8">
              Last Updated: December 6, 2024
            </p>

            <div className="prose max-w-none font-body text-youngNight/80 space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Introduction
                </h2>
                <p className="mb-4">
                  Welcome to Roompeer. We are committed to protecting your privacy and ensuring you have control over your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our flatmate matching platform.
                </p>
                <p className="mb-4">
                  Roompeer is operated by Roompeer Ltd. ("we", "us", or "our"). By using our services, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              {/* What Data We Collect */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  What Data We Collect
                </h2>
                
                <h3 className="font-heading text-xl font-semibold mb-3 text-youngNight">
                  Profile Data
                </h3>
                <p className="mb-4">
                  When you create an account and complete your profile, we collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Full name and email address</li>
                  <li>Age and occupation</li>
                  <li>Profile photos</li>
                  <li>Bio and personal description</li>
                  <li>Hobbies and interests</li>
                </ul>

                <h3 className="font-heading text-xl font-semibold mb-3 text-youngNight">
                  Matching Preferences
                </h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Budget range and desired location</li>
                  <li>Move-in date preferences</li>
                  <li>Accommodation type preferences</li>
                  <li>Lifestyle preferences (sleep schedule, smoking, cleanliness, guests, pets)</li>
                  <li>Ideal flatmate description</li>
                </ul>

                <h3 className="font-heading text-xl font-semibold mb-3 text-youngNight">
                  Messages and Communications
                </h3>
                <p className="mb-4">
                  We store messages exchanged between you and your matches to facilitate communication and for safety purposes.
                </p>

                <h3 className="font-heading text-xl font-semibold mb-3 text-youngNight">
                  Location Data
                </h3>
                <p className="mb-4">
                  We collect your preferred location for flatmate matching. We do not track your real-time location.
                </p>

                <h3 className="font-heading text-xl font-semibold mb-3 text-youngNight">
                  Technical Data
                </h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Usage data (pages visited, time spent, interactions)</li>
                </ul>
              </section>

              {/* How We Use Your Data */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  How We Use Your Data
                </h2>
                <p className="mb-4">We use your personal data to:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <strong>Power our matching algorithm:</strong> Your profile and preferences are used to find compatible flatmates
                  </li>
                  <li>
                    <strong>Operate the platform:</strong> Enable account creation, messaging, and core features
                  </li>
                  <li>
                    <strong>Communicate with you:</strong> Send notifications about matches, messages, and important updates
                  </li>
                  <li>
                    <strong>Improve our services:</strong> Analyze usage patterns to enhance user experience
                  </li>
                  <li>
                    <strong>Ensure safety:</strong> Detect and prevent fraud, abuse, and policy violations
                  </li>
                  <li>
                    <strong>Legal compliance:</strong> Meet our legal and regulatory obligations
                  </li>
                </ul>
              </section>

              {/* Legal Basis for Processing */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Legal Basis for Processing (GDPR)
                </h2>
                <p className="mb-4">We process your personal data under the following legal bases:</p>
                
                <div className="bg-azulBlue/5 p-4 rounded-lg mb-4">
                  <h3 className="font-heading text-lg font-semibold text-youngNight mb-2">
                    Performance of Contract
                  </h3>
                  <p>
                    Processing your profile data and preferences is necessary to provide the flatmate matching service you have signed up for.
                  </p>
                </div>
                
                <div className="bg-blueHeathButterfly/5 p-4 rounded-lg mb-4">
                  <h3 className="font-heading text-lg font-semibold text-youngNight mb-2">
                    Consent
                  </h3>
                  <p>
                    We obtain your explicit consent for marketing communications and non-essential cookies. You can withdraw consent at any time.
                  </p>
                </div>
                
                <div className="bg-azulBlue/5 p-4 rounded-lg mb-4">
                  <h3 className="font-heading text-lg font-semibold text-youngNight mb-2">
                    Legitimate Interests
                  </h3>
                  <p>
                    We may process data based on our legitimate interests, such as improving our services and ensuring platform security, where these do not override your rights.
                  </p>
                </div>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Data Sharing
                </h2>
                <p className="mb-4 font-semibold text-youngNight">
                  We do not sell your personal data to third parties.
                </p>
                <p className="mb-4">We may share your data with:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <strong>Other users:</strong> Your profile information is visible to potential matches
                  </li>
                  <li>
                    <strong>Service providers:</strong> Trusted third parties who help us operate our platform (hosting, analytics, email services)
                  </li>
                  <li>
                    <strong>Legal authorities:</strong> When required by law or to protect our rights and the safety of users
                  </li>
                </ul>
                <p>
                  All service providers are bound by data processing agreements and may only use your data for specified purposes.
                </p>
              </section>

              {/* User Rights */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Your Rights (GDPR & CCPA)
                </h2>
                <p className="mb-4">You have the following rights regarding your personal data:</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-youngNight/5 p-4 rounded-lg">
                    <h3 className="font-heading font-semibold text-youngNight mb-2">Right to Access</h3>
                    <p className="text-sm">Request a copy of the personal data we hold about you.</p>
                  </div>
                  <div className="bg-youngNight/5 p-4 rounded-lg">
                    <h3 className="font-heading font-semibold text-youngNight mb-2">Right to Rectification</h3>
                    <p className="text-sm">Request correction of inaccurate or incomplete data.</p>
                  </div>
                  <div className="bg-youngNight/5 p-4 rounded-lg">
                    <h3 className="font-heading font-semibold text-youngNight mb-2">Right to Erasure</h3>
                    <p className="text-sm">Request deletion of your personal data ("right to be forgotten").</p>
                  </div>
                  <div className="bg-youngNight/5 p-4 rounded-lg">
                    <h3 className="font-heading font-semibold text-youngNight mb-2">Right to Restriction</h3>
                    <p className="text-sm">Request limitation of processing in certain circumstances.</p>
                  </div>
                  <div className="bg-youngNight/5 p-4 rounded-lg">
                    <h3 className="font-heading font-semibold text-youngNight mb-2">Right to Portability</h3>
                    <p className="text-sm">Receive your data in a structured, machine-readable format.</p>
                  </div>
                  <div className="bg-youngNight/5 p-4 rounded-lg">
                    <h3 className="font-heading font-semibold text-youngNight mb-2">Right to Object</h3>
                    <p className="text-sm">Object to processing based on legitimate interests or for marketing.</p>
                  </div>
                </div>
                
                <p className="mb-4">
                  To exercise any of these rights, please contact us at{" "}
                  <a href="mailto:roompeer@gmail.com" className="text-azulBlue hover:underline">
                    roompeer@gmail.com
                  </a>. We will respond to your request within 30 days.
                </p>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Data Retention
                </h2>
                <p className="mb-4">We retain your personal data for as long as:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Your account remains active</li>
                  <li>Necessary to provide our services</li>
                  <li>Required by law or for legal claims</li>
                </ul>
                <p className="mb-4">
                  If you delete your account, we will delete or anonymize your personal data within 30 days, except where retention is required by law.
                </p>
              </section>

              {/* International Transfers */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  International Data Transfers
                </h2>
                <p className="mb-4">
                  Your data may be transferred to and processed in countries outside your country of residence. When we transfer data internationally, we ensure appropriate safeguards are in place, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Adequacy decisions for countries with equivalent data protection</li>
                </ul>
              </section>

              {/* Security */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Data Security
                </h2>
                <p className="mb-4">
                  We implement appropriate technical and organizational measures to protect your personal data, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p>
                  While we take all reasonable precautions, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Children's Privacy
                </h2>
                <p className="mb-4">
                  Roompeer is not intended for users under 18 years of age. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately.
                </p>
              </section>

              {/* Changes to Policy */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Changes to This Privacy Policy
                </h2>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-4 text-youngNight">
                  Contact Information
                </h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                </p>
                <div className="bg-youngNight/5 p-4 rounded-lg">
                  <p className="mb-2">
                    <strong>Email:</strong>{" "}
                    <a href="mailto:roompeer@gmail.com" className="text-azulBlue hover:underline">
                      roompeer@gmail.com
                    </a>
                  </p>
                  <p className="mb-2">
                    <strong>Data Protection Officer:</strong> roompeer@gmail.com
                  </p>
                  <p>
                    <strong>Address:</strong> Roompeer Ltd, Budapest, Hungary
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <RoompeerFooter />
    </div>
  );
};

export default RoompeerPrivacyPolicy;
