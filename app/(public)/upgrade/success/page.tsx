"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Could verify session with Stripe here
    setTimeout(() => setLoading(false), 1000)
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-green-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Premium!</h1>
            <p className="text-green-100">Your listing has been upgraded successfully</p>
          </div>

          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  What's Next?
                </h3>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>Your listing is now prioritized in search results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>You can now add a promotional deals banner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>Your website gets a dofollow backlink for SEO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>We'll reach out within 24 hours to optimize your listing</span>
                  </li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  A confirmation email has been sent to your email address.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="/">
                      Browse Directory
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/search">
                      View Listings
                    </Link>
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Questions? Contact us at support@leanderscoop.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function UpgradeSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
