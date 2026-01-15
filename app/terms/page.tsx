import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Leander Scoop Directory - rules and guidelines for using our local business directory.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using the Leander Scoop Directory website at directory.leanderscoop.com
              ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree
              with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Description of Service</h2>
            <p className="text-muted-foreground">
              Leander Scoop Directory is a local business directory serving the Leander, Cedar Park,
              and Liberty Hill, Texas communities. We provide business listings, reviews, and
              information to help residents discover local businesses.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">User Accounts</h2>
            <p className="text-muted-foreground">
              Some features of our Service may require you to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">User Content</h2>
            <p className="text-muted-foreground">
              When you submit content to our Service (such as reviews or business information), you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Grant us a non-exclusive, royalty-free license to use, display, and distribute that content</li>
              <li>Represent that you own or have the right to submit the content</li>
              <li>Agree not to submit content that is false, misleading, defamatory, or illegal</li>
              <li>Acknowledge that we may remove content that violates these Terms</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Business Listings</h2>
            <p className="text-muted-foreground">
              Business information displayed on our Service is provided for informational purposes only.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>We strive for accuracy but do not guarantee the completeness or accuracy of listings</li>
              <li>Business hours, contact information, and services may change without notice</li>
              <li>We are not responsible for the quality of goods or services provided by listed businesses</li>
              <li>Business owners may claim and update their listings by contacting us</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Prohibited Uses</h2>
            <p className="text-muted-foreground">You agree not to use our Service to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Harass, abuse, or harm other users or businesses</li>
              <li>Scrape, harvest, or collect data without permission</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use the Service for any commercial purpose without our consent</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Service and its original content (excluding user-submitted content) are and will
              remain the exclusive property of Leander Scoop. Our trademarks, logos, and service
              marks may not be used without prior written permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LEANDER SCOOP SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF
              OR RELATED TO YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Leander Scoop and its affiliates from any
              claims, damages, or expenses arising from your use of the Service or violation of
              these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users of
              material changes by updating the "Last updated" date. Your continued use of the
              Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the
              State of Texas, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground">
              <strong>Leander Scoop</strong><br />
              Email: legal@leanderscoop.com<br />
              Website: leanderscoop.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
