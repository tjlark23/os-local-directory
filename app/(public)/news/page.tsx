import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Newspaper, Bell, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `Local News Coming Soon | ${siteConfig.name}`,
  description: 'Stay informed with local news from Leander, Round Rock, and throughout Williamson County. Coming soon to WilCo Guide.',
  openGraph: {
    title: `Local News Coming Soon | ${siteConfig.name}`,
    description: 'Stay informed with local news from Williamson County.',
    type: 'website',
    url: `${siteConfig.url}/news`,
  },
  alternates: {
    canonical: `${siteConfig.url}/news`,
  },
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Newspaper className="w-10 h-10 text-primary" />
              </div>
            </div>
            <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
              Coming Soon
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Local News Coming Soon
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're bringing you the latest news from Leander, Round Rock, and
              throughout Williamson County. Stay tuned for local stories that matter to you.
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
              Be the first to know when local news launches on {siteConfig.name}.
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
              { title: 'Local Stories', desc: 'News that matters to Williamson County residents' },
              { title: 'Community Events', desc: 'Stay updated on happenings in your city' },
              { title: 'Business Updates', desc: 'New openings, closings, and local business news' },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
