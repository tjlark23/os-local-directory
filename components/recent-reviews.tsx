import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import Link from "next/link"

const recentReviews = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    business: {
      name: "Artisan Coffee Roasters",
      id: "1",
    },
    rating: 5,
    content: "Amazing coffee and friendly staff! The atmosphere is perfect for working or catching up with friends.",
    date: "2 days ago",
  },
  {
    id: "2",
    user: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    business: {
      name: "Green Garden Bistro",
      id: "2",
    },
    rating: 4,
    content: "Great food and service. The garden salad was fresh and the portions were generous.",
    date: "3 days ago",
  },
  {
    id: "3",
    user: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    business: {
      name: "Tech Repair Pro",
      id: "3",
    },
    rating: 5,
    content: "Fixed my laptop quickly and at a fair price. Highly recommend!",
    date: "1 week ago",
  },
]

export function RecentReviews() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentReviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar>
                <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{review.user.name}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>

            <div className="mb-3">
              <Link href={`/business/${review.business.id}`}>
                <h4 className="font-medium hover:text-primary cursor-pointer">{review.business.name}</h4>
              </Link>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-700">{review.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
