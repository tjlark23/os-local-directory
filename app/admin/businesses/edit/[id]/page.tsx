"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminLayout } from "@/components/admin-layout"
import { ArrowLeft, Save, Trash2, Plus, X, ExternalLink } from "lucide-react"
import { getBusinessById } from "@/lib/data"
import { Business, ListingTier, CATEGORIES } from "@/lib/types"

export default function EditBusinessPage() {
  const params = useParams()
  const router = useRouter()
  const businessId = params.id as string

  const [business, setBusiness] = useState<Business | null>(null)
  const [formData, setFormData] = useState<Partial<Business>>({})
  const [newPhoto, setNewPhoto] = useState("")
  const [newVideo, setNewVideo] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    const found = getBusinessById(businessId)
    if (found) {
      setBusiness(found)
      setFormData(found)
    }
  }, [businessId])

  const handleSave = async () => {
    setIsSaving(true)
    // In production, this would save to a database
    // For now, we'll just show a success message
    console.log("Saving business:", formData)

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSaveMessage("Changes saved! Note: In production, this would persist to a database.")
    setIsSaving(false)

    setTimeout(() => setSaveMessage(""), 5000)
  }

  const addPhoto = () => {
    if (newPhoto.trim()) {
      setFormData({
        ...formData,
        photos: [...(formData.photos || []), newPhoto.trim()]
      })
      setNewPhoto("")
    }
  }

  const removePhoto = (index: number) => {
    const photos = [...(formData.photos || [])]
    photos.splice(index, 1)
    setFormData({ ...formData, photos })
  }

  const addVideo = () => {
    if (newVideo.trim()) {
      setFormData({
        ...formData,
        videos: [...(formData.videos || []), newVideo.trim()]
      })
      setNewVideo("")
    }
  }

  const removeVideo = (index: number) => {
    const videos = [...(formData.videos || [])]
    videos.splice(index, 1)
    setFormData({ ...formData, videos })
  }

  if (!business) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Business not found</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{business.name}</h1>
              <p className="text-muted-foreground">Edit business listing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <a href={`/business/${business.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live
              </a>
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {saveMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {saveMessage}
          </div>
        )}

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Photos & Videos</TabsTrigger>
            <TabsTrigger value="premium">Premium Settings</TabsTrigger>
            <TabsTrigger value="seo">SEO & Description</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.filterCategory}
                      onValueChange={(value) => setFormData({ ...formData, filterCategory: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Input
                      value={formData.subcategory || ""}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <Select
                      value={formData.priceRange}
                      onValueChange={(value) => setFormData({ ...formData, priceRange: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$">$ - Budget Friendly</SelectItem>
                        <SelectItem value="$$">$$ - Moderate</SelectItem>
                        <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                        <SelectItem value="$$$$">$$$$ - Fine Dining/Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={formData.website || ""}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Full Address</Label>
                    <Input
                      value={formData.address?.full || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address!, full: e.target.value }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                  <CardDescription>Add photos to showcase the business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter photo URL..."
                      value={newPhoto}
                      onChange={(e) => setNewPhoto(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addPhoto()}
                    />
                    <Button onClick={addPhoto} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.photos?.map((photo, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <img src={photo} alt="" className="w-16 h-16 object-cover rounded" />
                        <span className="flex-1 text-sm truncate">{photo}</span>
                        <Button variant="ghost" size="icon" onClick={() => removePhoto(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(!formData.photos || formData.photos.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No photos added yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Videos</CardTitle>
                  <CardDescription>Add video URLs (YouTube, Vimeo, etc.)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter video URL..."
                      value={newVideo}
                      onChange={(e) => setNewVideo(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addVideo()}
                    />
                    <Button onClick={addVideo} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.videos?.map((video, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <span className="flex-1 text-sm truncate">{video}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeVideo(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {(!formData.videos || formData.videos.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No videos added yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Premium Settings Tab */}
          <TabsContent value="premium">
            <Card>
              <CardHeader>
                <CardTitle>Premium Listing Settings</CardTitle>
                <CardDescription>
                  Control the listing tier and premium features for this business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Listing Tier</Label>
                    <p className="text-sm text-muted-foreground">
                      Premium and Featured listings get better placement and more features
                    </p>
                  </div>
                  <Select
                    value={formData.listingTier || "free"}
                    onValueChange={(value) => setFormData({ ...formData, listingTier: value as ListingTier })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show as Featured</Label>
                    <p className="text-sm text-muted-foreground">
                      Display on homepage featured section
                    </p>
                  </div>
                  <Switch
                    checked={formData.featured || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Backlink</Label>
                    <p className="text-sm text-muted-foreground">
                      Add dofollow backlink to their website (SEO value)
                    </p>
                  </div>
                  <Switch
                    checked={formData.backlinkEnabled || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, backlinkEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Verified/Claimed</Label>
                    <p className="text-sm text-muted-foreground">
                      Show verified badge on listing
                    </p>
                  </div>
                  <Switch
                    checked={formData.claimed || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, claimed: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Premium Since</Label>
                  <Input
                    type="date"
                    value={formData.premiumSince?.split("T")[0] || ""}
                    onChange={(e) => setFormData({ ...formData, premiumSince: e.target.value })}
                  />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Social Links</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Facebook</Label>
                      <Input
                        value={formData.socialLinks?.facebook || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                        })}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instagram</Label>
                      <Input
                        value={formData.socialLinks?.instagram || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                        })}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>YouTube</Label>
                      <Input
                        value={formData.socialLinks?.youtube || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                        })}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>TikTok</Label>
                      <Input
                        value={formData.socialLinks?.tiktok || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, tiktok: e.target.value }
                        })}
                        placeholder="https://tiktok.com/..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Description</CardTitle>
                <CardDescription>
                  Optimize the business description for search engines and AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Used in search results and cards (max 150 characters)
                  </p>
                  <Textarea
                    value={formData.shortDescription || ""}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    rows={2}
                    maxLength={150}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {(formData.shortDescription || "").length}/150
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Full Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Detailed description shown on the business page
                  </p>
                  <Textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Custom AI-Optimized Description</Label>
                  <p className="text-sm text-muted-foreground">
                    Override for premium listings - write a rich, keyword-optimized description
                  </p>
                  <Textarea
                    value={formData.customDescription || ""}
                    onChange={(e) => setFormData({ ...formData, customDescription: e.target.value })}
                    rows={6}
                    placeholder="Enter a custom description optimized for AI search..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Specialties/Tags</Label>
                  <p className="text-sm text-muted-foreground">
                    Comma-separated list of specialties
                  </p>
                  <Input
                    value={formData.specialties?.join(", ") || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      specialties: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    })}
                    placeholder="Brisket, Ribs, BBQ Catering, ..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
