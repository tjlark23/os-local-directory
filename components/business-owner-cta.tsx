import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Store, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export function BusinessOwnerCTA() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Own a Business?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of local businesses connecting with customers in your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center text-white">
              <Store className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Claim Your Listing</h3>
              <p className="opacity-90">Take control of your business profile and keep information up to date</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center text-white">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect with Customers</h3>
              <p className="opacity-90">Respond to reviews and engage with your local community</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center text-white">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Grow Your Business</h3>
              <p className="opacity-90">Get discovered by more local customers and increase visibility</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/business/claim">
            <Button size="lg" variant="secondary" className="mr-4">
              Claim Your Business
            </Button>
          </Link>
          <Link href="/business/add">
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary bg-transparent"
            >
              Add Your Business
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
