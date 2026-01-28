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
            Get your business listed in the WilCo Guide and connect with customers in your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center text-white">
              <Store className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Listing</h3>
              <p className="opacity-90">Every local business gets a free listing with basic information</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center text-white">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect with Customers</h3>
              <p className="opacity-90">Be discovered by locals searching for businesses like yours</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6 text-center text-white">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upgrade Your Listing</h3>
              <p className="opacity-90">Add photos, videos, and more to stand out from the crowd</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Contact Us to Get Listed
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
