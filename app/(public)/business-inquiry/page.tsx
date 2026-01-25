"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Star, Video, Image as ImageIcon, TrendingUp, Zap } from "lucide-react"

export default function BusinessInquiryPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    currentlyListed: "",
    interestedIn: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to your email or a database
    console.log("Form submitted:", formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                We&apos;ve received your inquiry and will be in touch within 1-2 business days.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Return to Directory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Upgrade Your Business Listing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stand out from the competition with an enhanced listing on Leander Scoop Directory.
            Get more visibility, more customers, and better SEO.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Featured Placement</h3>
              <p className="text-sm text-muted-foreground">
                Appear at the top of search results and on our homepage featured section.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Videos & Photos</h3>
              <p className="text-sm text-muted-foreground">
                Showcase your business with unlimited photos and promotional videos.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI-Ready SEO</h3>
              <p className="text-sm text-muted-foreground">
                Enhanced structured data optimized for AI search and Google visibility.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Benefits */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>What Premium Listings Include</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Priority placement in search results",
                "Unlimited photo uploads",
                "Video showcase capability",
                "Custom business description",
                "Weekly data refresh from Google",
                "Backlink to your website (SEO value)",
                "Post promotions and announcements",
                "\"Verified Premium\" badge",
                "Social media links display",
                "Priority support",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Request More Information</CardTitle>
            <CardDescription>
              Fill out the form below and we&apos;ll reach out to discuss how we can help your business grow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Your Business Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@business.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(512) 555-0123"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentlyListed">Is your business currently listed?</Label>
                  <Select
                    value={formData.currentlyListed}
                    onValueChange={(value) => setFormData({ ...formData, currentlyListed: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, it&apos;s already listed</SelectItem>
                      <SelectItem value="no">No, not yet</SelectItem>
                      <SelectItem value="unsure">I&apos;m not sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestedIn">What are you most interested in?</Label>
                  <Select
                    value={formData.interestedIn}
                    onValueChange={(value) => setFormData({ ...formData, interestedIn: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured placement</SelectItem>
                      <SelectItem value="media">Photos & videos</SelectItem>
                      <SelectItem value="seo">Better SEO/visibility</SelectItem>
                      <SelectItem value="all">All of the above</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your business and what you're looking to achieve..."
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full md:w-auto">
                <Zap className="w-4 h-4 mr-2" />
                Submit Inquiry
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Trust Section */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            Part of <strong>Leander Scoop</strong> - the trusted local newsletter serving
            Leander, Cedar Park, and Liberty Hill communities.
          </p>
        </div>
      </div>
    </div>
  )
}
