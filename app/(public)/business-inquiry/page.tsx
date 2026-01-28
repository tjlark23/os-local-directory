import { Metadata } from "next"
import { BusinessInquiryForm } from "./inquiry-form"

export const metadata: Metadata = {
  title: "Upgrade Your Business Listing",
  description: "Get more visibility for your business in Leander, Cedar Park, and Liberty Hill. Upgrade to a featured listing with premium placement, photos, videos, and enhanced SEO. Contact us today!",
  keywords: [
    "business listing upgrade",
    "featured business listing",
    "Leander business advertising",
    "Cedar Park business promotion",
    "Liberty Hill business directory",
    "local business marketing",
    "premium business listing",
    "Texas business directory",
  ],
  openGraph: {
    title: "Upgrade Your Business Listing | WilCo Guide",
    description: "Get more visibility for your business with a featured listing. Premium placement, photos, videos, and enhanced SEO for businesses in Leander, Cedar Park, and Liberty Hill.",
    type: "website",
    url: "https://wilcoguide.com/business-inquiry",
    siteName: "WilCo Guide",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upgrade Your Business Listing | WilCo Guide",
    description: "Get more visibility for your business with a featured listing. Premium placement, photos, videos, and enhanced SEO.",
  },
  alternates: {
    canonical: "https://wilcoguide.com/business-inquiry",
  },
}

export default function BusinessInquiryPage() {
  return <BusinessInquiryForm />
}
