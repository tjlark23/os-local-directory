import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  TrendingUp,
  Star,
  Image as ImageIcon,
  MessageSquare,
  Shield,
  Zap,
  Users,
  Clock,
  Award,
  Check,
  X,
  Bot,
  Phone,
  Video,
  Calendar,
  Gift,
  ChevronDown,
  ArrowRight,
  Building2,
  MapPin,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Businesses | Partner With Leander Scoop Directory",
  description: "Join Leander Scoop Directory and get discovered by local customers. Free listing available. Premium partnerships include AI-optimized content, priority placement, and dedicated support.",
  keywords: [
    "Leander business directory",
    "Cedar Park business listing",
    "Liberty Hill local business",
    "Texas business advertising",
    "local business marketing",
    "business directory partnership",
  ],
  openGraph: {
    title: "For Businesses | Partner With Leander Scoop Directory",
    description: "Get discovered by local customers. Free listing or premium partnership options available.",
    type: "website",
    url: "https://directory.leanderscoop.com/for-businesses",
  },
}

const benefits = [
  {
    icon: Search,
    title: "Local SEO Boost",
    description: "Rank higher when locals search for your services",
  },
  {
    icon: TrendingUp,
    title: "Increased Visibility",
    description: "Get seen by thousands of local customers monthly",
  },
  {
    icon: Star,
    title: "Review Management",
    description: "Showcase your best reviews and build trust",
  },
  {
    icon: ImageIcon,
    title: "Photo Gallery",
    description: "Display your work with high-quality images",
  },
  {
    icon: MessageSquare,
    title: "Direct Inquiries",
    description: "Customers can contact you directly",
  },
  {
    icon: Shield,
    title: "Verified Badge",
    description: "Stand out with a verified business badge",
  },
  {
    icon: Zap,
    title: "Priority Placement",
    description: "Appear at the top of search results",
  },
  {
    icon: Users,
    title: "Community Trust",
    description: "Be part of the trusted local business network",
  },
  {
    icon: Clock,
    title: "24/7 Presence",
    description: "Your business works for you around the clock",
  },
  {
    icon: Award,
    title: "Featured Listings",
    description: "Get highlighted in category showcases",
  },
]

const freeFeatures = [
  { text: "Basic business listing", included: true },
  { text: "Business name & address", included: true },
  { text: "Phone number display", included: true },
  { text: "Category placement", included: true },
  { text: "1 business photo", included: true },
  { text: "Priority placement", included: false },
  { text: "Photo gallery (10+ photos)", included: false },
  { text: "AI-optimized description", included: false },
  { text: "Verified badge", included: false },
  { text: "Featured on homepage", included: false },
  { text: "Dedicated support", included: false },
]

const partnerFeatures = [
  { text: "Everything in Free, plus:", included: true },
  { text: "Priority search placement", included: true },
  { text: "Photo gallery (10+ photos)", included: true },
  { text: "AI-optimized description", included: true },
  { text: "Verified business badge", included: true },
  { text: "Featured on homepage rotation", included: true },
  { text: "Monthly performance reports", included: true },
  { text: "Dedicated account manager", included: true },
  { text: "Review response assistance", included: true },
  { text: "Social media cross-promotion", included: true },
  { text: "Founding partner rate locked in", included: true },
]

const faqs = [
  {
    question: "How do I get my business listed?",
    answer: "Getting listed is easy! You can claim your free listing right now, or schedule a call with us to discuss partnership options. We'll guide you through the entire process.",
  },
  {
    question: "What's included in a free listing?",
    answer: "Free listings include your business name, address, phone number, category placement, and one photo. It's a great way to establish your online presence in the local directory.",
  },
  {
    question: "What makes a partnership different?",
    answer: "Partners get priority placement in search results, AI-optimized business descriptions, verified badges, homepage features, photo galleries, and dedicated support. It's designed for businesses serious about local growth.",
  },
  {
    question: "How does the founding rate work?",
    answer: "As a founding partner, you lock in today's rate forever. As our directory grows and rates increase, your monthly cost stays the same. It's our way of thanking early supporters.",
  },
  {
    question: "Can I upgrade from free to partner later?",
    answer: "Absolutely! You can start with a free listing and upgrade anytime. However, the founding partner rate is only available for a limited time, so upgrading sooner locks in better pricing.",
  },
  {
    question: "What areas do you cover?",
    answer: "We focus on Leander, Cedar Park, and Liberty Hill, Texas. If your business serves customers in these areas, you're a perfect fit for our directory.",
  },
]

export default function ForBusinessesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-28 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 mb-6">
              <MapPin className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-300">Leander • Cedar Park • Liberty Hill</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get Discovered by
              <span className="text-red-500"> Local Customers</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join the directory that locals trust. Whether you want a free listing or premium partnership, we'll help your business grow.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6" asChild>
                <Link href="/business-inquiry">
                  <Building2 className="w-5 h-5 mr-2" />
                  Claim Free Listing
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6" asChild>
                <Link href="#partner">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Partner Call
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why List Your Business With Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to attract and convert local customers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-white">
                <CardContent className="pt-6 pb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{benefit.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Partner Comparison */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free or unlock premium benefits with a partnership
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Listing */}
            <Card className="border-2 border-gray-200 relative overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Listing</h3>
                  <div className="text-4xl font-bold text-gray-900">$0</div>
                  <p className="text-gray-500">Forever free</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-gray-900 hover:bg-gray-800" size="lg" asChild>
                  <Link href="/business-inquiry">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Partner Listing */}
            <Card className="border-2 border-red-500 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                RECOMMENDED
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Founding Partner</h3>
                  <div className="text-4xl font-bold text-red-600">$49<span className="text-lg text-gray-500">/mo</span></div>
                  <p className="text-gray-500">Rate locked forever</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {partnerFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg" asChild>
                  <Link href="#partner">
                    Become a Partner
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI 2026 Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">The Future of Local Search</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI Is Changing How Customers Find You
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              In 2026, customers don't just Google—they ask AI assistants for recommendations. Is your business ready?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Old Way */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                    <X className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-300">The Old Way</h3>
                </div>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Outdated Google listing with wrong hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Generic description that doesn't stand out</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>AI assistants can't find or recommend you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Lost customers go to competitors</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* New Way */}
            <Card className="bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">The Leander Scoop Way</h3>
                </div>
                <ul className="space-y-4 text-gray-200">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>AI-optimized content that assistants love</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Structured data for perfect search results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Always accurate, always up-to-date</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Get recommended when locals ask AI for help</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Zoom Call Section */}
      <section id="partner" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Let's Talk About Your Business
              </h2>
              <p className="text-lg text-gray-600">
                Schedule a free 15-minute Zoom call. No pressure, just a conversation about how we can help.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Call Details */}
              <Card className="border-2 border-gray-200">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">What to Expect</h3>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">15-Minute Zoom Call</h4>
                        <p className="text-sm text-gray-500">Quick, focused, and valuable</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Meet the Team</h4>
                        <p className="text-sm text-gray-500">Talk to real people who care about local business</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Custom Strategy</h4>
                        <p className="text-sm text-gray-500">We'll share specific ideas for your business</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">No Obligation</h4>
                        <p className="text-sm text-gray-500">Walk away with value even if you don't partner</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Value Card */}
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">On the Call, You'll Get:</h3>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Free audit of your current online presence</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Competitor analysis in your category</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Specific recommendations (free or paid)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Answers to all your questions</span>
                    </li>
                  </ul>

                  <Button className="w-full bg-red-600 hover:bg-red-700" size="lg" asChild>
                    <Link href="/business-inquiry">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Your Call
                    </Link>
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Or call us directly: <a href="tel:+15125551234" className="text-red-600 font-medium">(512) 555-1234</a>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Rate Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-600/20 rounded-full px-4 py-2 mb-6">
              <Award className="w-5 h-5 text-amber-800" />
              <span className="text-sm font-semibold text-amber-800">LIMITED TIME OFFER</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lock In Your Founding Partner Rate
            </h2>

            <p className="text-lg text-gray-800 mb-8">
              The first 50 partners get our founding rate of <strong>$49/month</strong>—locked in forever.
              As we grow, rates will increase to $79/month and beyond. But not for founders.
            </p>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 md:p-8 max-w-md mx-auto mb-8">
              <div className="text-5xl md:text-6xl font-bold text-red-600 mb-2">23</div>
              <div className="text-gray-600">Founding Partner Spots Remaining</div>
              <div className="text-sm text-gray-500 mt-2">Out of 50 total spots</div>
            </div>

            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 py-6" asChild>
              <Link href="/business-inquiry">
                Claim Your Spot Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about listing your business
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the path that works best for you. Either way, you're making a smart move.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Path */}
            <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Free</h3>
                <p className="text-gray-600 mb-6">
                  Get your business listed today at no cost. Upgrade anytime.
                </p>
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href="/business-inquiry">
                    Claim Free Listing
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Partner Path */}
            <Card className="border-2 border-red-500 hover:border-red-600 transition-colors shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Become a Partner</h3>
                <p className="text-gray-600 mb-6">
                  Lock in founding rates and get premium placement forever.
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg" asChild>
                  <Link href="/business-inquiry">
                    Schedule Partner Call
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-gray-500 mt-8">
            Questions? Email us at <a href="mailto:hello@leanderscoop.com" className="text-red-600 hover:underline">hello@leanderscoop.com</a>
          </p>
        </div>
      </section>
    </div>
  )
}
