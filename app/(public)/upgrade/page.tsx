"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Star,
  TrendingUp,
  Zap,
  Award,
  Link as LinkIcon,
  Tag,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Crown,
  Building2,
  CreditCard
} from "lucide-react"

function UpgradePageContent() {
  const searchParams = useSearchParams()
  const businessId = searchParams.get('business')
  const canceled = searchParams.get('canceled')

  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessingStripe, setIsProcessingStripe] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Could fetch business name from businessId here
  }, [businessId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plan: 'featured',
          businessId: businessId || null,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('Failed to submit. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStripeCheckout = async () => {
    if (!formData.businessName || !formData.email) {
      alert('Please fill in Business Name and Email to continue.')
      return
    }

    setIsProcessingStripe(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          email: formData.email,
          businessId: businessId || null,
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to process. Please try again.')
    } finally {
      setIsProcessingStripe(false)
    }
  }

  const features = [
    { icon: Star, text: "Priority placement in search results" },
    { icon: Crown, text: "Featured badge on your listing" },
    { icon: TrendingUp, text: "Appear on homepage featured section" },
    { icon: Tag, text: "Promotional deals banner" },
    { icon: LinkIcon, text: "DoFollow backlink for SEO" },
    { icon: MessageSquare, text: "Custom AI-optimized description" },
    { icon: Award, text: "Homepage hero carousel placement" },
    { icon: BarChart3, text: "Analytics dashboard (coming soon)" },
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/30 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-green-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Thank you for your interest!</h2>
              <p className="text-muted-foreground mb-6">
                We've received your upgrade request. A member of our team will contact you within 24 hours to complete your Featured Listing setup.
              </p>
              <Button asChild>
                <a href="/">Return to Homepage</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Crown className="w-3 h-3 mr-1" />
            Featured Listing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Get More Customers with a Featured Listing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stand out from the competition with priority placement, promotional features, and powerful SEO benefits.
          </p>
        </div>
      </div>

      {/* Canceled notice */}
      {canceled && (
        <div className="container mx-auto px-4 pt-6">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-center">
            Your checkout was canceled. Feel free to try again when you're ready!
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pricing & Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Listing Card */}
            <Card className="border-primary shadow-lg ring-2 ring-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Crown className="w-6 h-6 text-primary" />
                    Featured Listing
                  </CardTitle>
                  <Badge className="bg-green-600 text-lg px-3 py-1">$49/mo</Badge>
                </div>
                <CardDescription className="text-base">
                  Maximum visibility for your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-5xl font-bold">$49</span>
                  <span className="text-muted-foreground text-xl">/month</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature, i) => {
                    const Icon = feature.icon
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span>{feature.text}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Benefits Section */}
            <Card>
              <CardHeader>
                <CardTitle>Why Upgrade to Featured?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">5x More Views</h3>
                    <p className="text-sm text-muted-foreground">
                      Featured listings get 5x more visibility than free listings
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <LinkIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">SEO Boost</h3>
                    <p className="text-sm text-muted-foreground">
                      DoFollow backlinks help improve your website's search rankings
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">More Leads</h3>
                    <p className="text-sm text-muted-foreground">
                      Promotional banners and featured placement drive more inquiries
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Get Started Today
                </CardTitle>
                <CardDescription>
                  Upgrade your listing in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      required
                      placeholder="Your business name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">Your Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      required
                      placeholder="John Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="you@business.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(512) 555-0123"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium flex items-center gap-2">
                        <Crown className="w-4 h-4 text-primary" />
                        Featured Listing
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-2xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary">$49/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Cancel anytime</p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="button"
                      className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-lg h-12"
                      size="lg"
                      disabled={isProcessingStripe}
                      onClick={handleStripeCheckout}
                    >
                      {isProcessingStripe ? (
                        "Processing..."
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Subscribe Now - $49/mo
                        </>
                      )}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">or</span>
                      </div>
                    </div>

                    <Button type="submit" variant="outline" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          Contact Us First
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Secure payment powered by Stripe. Cancel anytime.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <UpgradePageContent />
    </Suspense>
  )
}
