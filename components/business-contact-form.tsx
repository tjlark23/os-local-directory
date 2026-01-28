"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageSquare, Send, CheckCircle, Loader2, X } from "lucide-react"

interface BusinessContactFormProps {
  businessName: string
  businessId: string
  autoOpen?: boolean
}

export function BusinessContactForm({ businessName, businessId, autoOpen }: BusinessContactFormProps) {
  const [isOpen, setIsOpen] = useState(autoOpen || false)

  // Handle autoOpen prop changes
  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true)
    }
  }, [autoOpen])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Build the mailto link with pre-filled data
    const subject = encodeURIComponent(`Lead from ${businessName} - Leander Scoop Directory`)
    const body = encodeURIComponent(
      `New inquiry from Leander Scoop Directory\n\n` +
      `Business: ${businessName}\n` +
      `Business ID: ${businessId}\n\n` +
      `--- Contact Information ---\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone || "Not provided"}\n\n` +
      `--- Message ---\n` +
      `${formData.message}\n\n` +
      `---\n` +
      `Sent via Leander Scoop Directory\n` +
      `https://directory.leanderscoop.com/business/${businessId}`
    )

    // Open mail client
    window.location.href = `mailto:hello@leanderscoop.com?subject=${subject}&body=${body}`

    // Show success state
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 500)
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reset form after closing
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", phone: "", message: "" })
    }, 300)
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full bg-primary hover:bg-primary/90">
        <MessageSquare className="w-4 h-4 mr-2" />
        Contact Business
      </Button>
    )
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Contact {businessName}</CardTitle>
            <CardDescription>
              Send a message and we'll help connect you.
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="-mr-2 -mt-2">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="py-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Message Ready!</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your email client should open. Just hit send!
            </p>
            <Button onClick={handleClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Your Name *</Label>
              <Input
                id="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Your Email *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(512) 555-0123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-sm">Message *</Label>
              <Textarea
                id="message"
                required
                placeholder={`Hi, I'm interested in learning more about ${businessName}...`}
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Message sent to Leander Scoop, who will forward to the business.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
