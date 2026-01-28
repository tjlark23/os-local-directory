import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Phone, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with WilCo Guide. Contact us about business listings, advertising, or general inquiries.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about the WilCo Guide? Want to get your business listed or upgrade your listing?
            We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Email Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-foreground">General Inquiries</p>
                <a href="mailto:hello@leanderscoop.com" className="text-primary hover:underline">
                  hello@leanderscoop.com
                </a>
              </div>
              <div>
                <p className="font-medium text-foreground">Business Listings</p>
                <a href="mailto:listings@leanderscoop.com" className="text-primary hover:underline">
                  listings@leanderscoop.com
                </a>
              </div>
              <div>
                <p className="font-medium text-foreground">Advertising</p>
                <a href="mailto:ads@leanderscoop.com" className="text-primary hover:underline">
                  ads@leanderscoop.com
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-foreground">Service Area</p>
                <p className="text-muted-foreground">
                  Leander, Cedar Park, and Liberty Hill, Texas
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Part of WilCo Guide</p>
                <p className="text-muted-foreground">
                  The local newsletter for the Leander area community
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>For Business Owners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Want to get your business listed in our directory? Here&apos;s how it works:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>
                  <strong className="text-foreground">Free Listings:</strong> All local businesses are included in our directory with basic information sourced from public data.
                </li>
                <li>
                  <strong className="text-foreground">Update Your Info:</strong> Contact us to update or correct your business information at no cost.
                </li>
                <li>
                  <strong className="text-foreground">Enhanced Listings:</strong> Upgrade your listing with photos, videos, and featured placement to stand out to potential customers.
                </li>
                <li>
                  <strong className="text-foreground">Advertising:</strong> Reach thousands of local readers through the WilCo Guide newsletter and directory.
                </li>
              </ul>
              <p className="text-muted-foreground pt-4">
                Email us at{" "}
                <a href="mailto:listings@leanderscoop.com" className="text-primary hover:underline">
                  listings@leanderscoop.com
                </a>{" "}
                to get started.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
