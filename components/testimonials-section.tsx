import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    content:
      "Leander Scoop has become my go-to resource for finding hidden gems in our area. The reviews are authentic and the business information is always up-to-date.",
    author: "Sarah Johnson",
    title: "Local Food Blogger",
    rating: 5,
  },
  {
    id: 2,
    content:
      "Since listing my restaurant on Leander Scoop, we've seen a 40% increase in new customers. The platform really helps local businesses connect with their community.",
    author: "Mike Chen",
    title: "Small Business Owner",
    rating: 5,
  },
  {
    id: 3,
    content:
      "I love how easy it is to find exactly what I need. Whether it's a new dentist or the best tacos in town, Leander Scoop always delivers reliable recommendations.",
    author: "Emily Rodriguez",
    title: "Leander Resident",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-6xl font-bold text-blue-600 mb-2">99+</div>
          <p className="text-xl text-gray-600">businesses through Leander Scoop</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-4 italic">"{testimonial.content}"</blockquote>

                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
