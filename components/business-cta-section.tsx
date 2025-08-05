import { Button } from "@/components/ui/button"
import Link from "next/link"

export function BusinessCTASection() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Own a Business? Get More Customers</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            List your business on Leander Scoop and reach thousands of local customers
          </p>
          <Link href="/business/add">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              List Your Business
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function DiscoverCTASection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Ready to Discover Your Next Favorite Place?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of locals who trust Leander Scoop to find the best businesses in their area
        </p>
        <Link href="/search">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Exploring
          </Button>
        </Link>
      </div>
    </section>
  )
}
