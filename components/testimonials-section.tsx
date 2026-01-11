"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    content:
      "Leander Scoop has become my go-to resource for finding hidden gems in our area. The reviews are authentic and the business information is always up-to-date.",
    author: "Sarah Johnson",
    title: "Local Food Blogger",
    rating: 5,
    avatar: "/professional-woman-headshot.png",
  },
  {
    id: 2,
    content:
      "Since listing my restaurant on Leander Scoop, we've seen a 40% increase in new customers. The platform really helps local businesses connect with their community.",
    author: "Mike Chen",
    title: "Small Business Owner",
    rating: 5,
    avatar: "/man-chef-restaurant-owner-friendly.jpg",
  },
  {
    id: 3,
    content:
      "I love how easy it is to find exactly what I need. Whether it's a new dentist or the best tacos in town, Leander Scoop always delivers reliable recommendations.",
    author: "Emily Rodriguez",
    title: "Leander Resident",
    rating: 5,
    avatar: "/woman-casual-portrait-happy.jpg",
  },
]

const stats = [
  { value: "500+", label: "Local Businesses" },
  { value: "10K+", label: "Happy Users" },
  { value: "25K+", label: "Reviews Written" },
  { value: "99%", label: "Satisfaction Rate" },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Community Says</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from real people who discovered their favorite local spots
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <blockquote className="text-card-foreground mb-6 leading-relaxed">"{testimonial.content}"</blockquote>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-card-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
