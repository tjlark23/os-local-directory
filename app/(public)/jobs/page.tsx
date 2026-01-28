import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Bell, ArrowRight, Building2, MapPin, Clock } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `Local Jobs Coming Soon | ${siteConfig.name}`,
  description: 'Find local job opportunities in Leander, Round Rock, and throughout Williamson County. Coming soon to WilCo Guide.',
  openGraph: {
    title: `Local Jobs Coming Soon | ${siteConfig.name}`,
    description: 'Find local job opportunities in Williamson County.',
    type: 'website',
    url: `${siteConfig.url}/jobs`,
  },
  alternates: {
    canonical: `${siteConfig.url}/jobs`,
  },
}

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Briefcase className="w-10 h-10 text-primary" />
              </div>
            </div>
            <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
              Coming Soon
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Local Jobs Coming Soon
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover job opportunities at local businesses in Leander, Round Rock,
              and throughout Williamson County. Work where you live.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Notify Section */}
        <Card className="max-w-lg mx-auto mb-12">
          <CardContent className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-4">Get Notified When We Launch</h2>
            <p className="text-muted-foreground mb-6">
              Be the first to find local jobs on {siteConfig.name}.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button className="px-6 py-3 bg-primary hover:bg-primary/90">
                Notify Me
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* What to Expect */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: 'Local Employers', desc: 'Jobs from businesses in your community' },
              { icon: MapPin, title: 'Close to Home', desc: 'Find opportunities in Williamson County' },
              { icon: Clock, title: 'All Types', desc: 'Full-time, part-time, and flexible positions' },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 text-center">
                  <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* For Employers CTA */}
        <div className="max-w-lg mx-auto mt-12">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Are You Hiring?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Local businesses will soon be able to post job listings for free.
              </p>
              <Button asChild variant="outline">
                <Link href="/for-businesses">
                  Learn About Business Listings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA to Directory */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            In the meantime, explore local businesses in Williamson County
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              Browse Directory
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
