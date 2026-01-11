import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Store, Users, TrendingUp, Sparkles } from "lucide-react"

export function BusinessCTASection() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full mb-6">
            <Store className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">For Business Owners</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 text-balance">
            Grow Your Business with Leander Scoop
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Join hundreds of local businesses reaching thousands of customers in the Leander area every day
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Users, text: "Reach 10K+ local users" },
              { icon: TrendingUp, text: "Increase visibility" },
              { icon: Sparkles, text: "Premium listing options" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4"
              >
                <benefit.icon className="w-5 h-5 text-primary-foreground" />
                <span className="text-primary-foreground font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/business/add">
              <Button
                size="lg"
                className="bg-card text-primary hover:bg-card/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 px-8 h-14 text-lg font-semibold"
              >
                List Your Business
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/advertise">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 h-14 text-lg font-semibold bg-transparent"
              >
                Learn About Advertising
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DiscoverCTASection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground text-balance">
            Ready to Discover Your Next Favorite Place?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of locals who trust Leander Scoop to find the best businesses in their area
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/search">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 px-8 h-14 text-lg font-semibold"
              >
                Start Exploring
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary px-8 h-14 text-lg font-semibold bg-transparent"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
