"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Send, CheckCircle, Loader2 } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

interface ContactModalProps {
  businessName: string
  businessId: string
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ businessName, businessId, isOpen, onClose }: ContactModalProps) {
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
    const subject = encodeURIComponent(`Lead from ${businessName} - ${siteConfig.name}`)
    const body = encodeURIComponent(
      `New inquiry from ${siteConfig.name}\n\n` +
      `Business: ${businessName}\n` +
      `Business ID: ${businessId}\n\n` +
      `--- Contact Information ---\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone || "Not provided"}\n\n` +
      `--- Message ---\n` +
      `${formData.message}\n\n` +
      `---\n` +
      `Sent via ${siteConfig.name}\n` +
      `${siteConfig.url}/business/${businessId}`
    )

    // Open mail client
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`

    // Show success state
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 500)
  }

  const handleClose = () => {
    onClose()
    // Reset form after closing
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", phone: "", message: "" })
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {businessName}</DialogTitle>
          <DialogDescription>
            Send a message and we'll help connect you with this business.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Message Ready!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your email client should open. Just hit send!
            </p>
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-name">Your Name *</Label>
              <Input
                id="modal-name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-email">Your Email *</Label>
              <Input
                id="modal-email"
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-phone">Phone (optional)</Label>
              <Input
                id="modal-phone"
                type="tel"
                placeholder="(512) 555-0123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-message">Message *</Label>
              <Textarea
                id="modal-message"
                required
                placeholder={`Hi, I'm interested in learning more about ${businessName}...`}
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#eb7b1c] hover:bg-[#d66a10]" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Your message will be sent to {siteConfig.name}, who will forward it to the business.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
