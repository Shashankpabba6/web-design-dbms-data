"use client"

import Navigation from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search,
  Store,
  ShoppingBag,
  Utensils,
  Zap,
  Smartphone,
  TrendingUp,
  Award,
  MapPin,
  Phone,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function Merchants() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [allMerchants, setAllMerchants] = useState<any[]>([])

  // Check authentication
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  // Fetch merchants from API
  useEffect(() => {
    if (!session?.user) return

    const fetchMerchants = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("bearer_token")
        
        // Build query params
        const params = new URLSearchParams({
          limit: "100"
        })

        if (filterCategory !== "all" && filterCategory !== "All Categories") {
          params.append("category", filterCategory)
        }

        if (searchQuery) {
          params.append("search", searchQuery)
        }

        const res = await fetch(`/api/merchants?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setAllMerchants(data)
        } else {
          toast.error("Failed to load merchants")
        }
      } catch (error) {
        console.error("Error fetching merchants:", error)
        toast.error("Failed to load merchants")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMerchants()
  }, [filterCategory, searchQuery, session])

  const categories = [
    "All Categories",
    "E-Commerce",
    "Food Delivery",
    "Food & Dining",
    "Entertainment",
    "Telecom",
    "Utilities",
    "Transportation"
  ]

  const filteredMerchants = allMerchants

  const topMerchants = [...allMerchants]
    .sort((a, b) => b.totalTransactions - a.totalTransactions)
    .slice(0, 3)

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navigation />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading merchants...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Merchant Directory</h1>
            <p className="text-muted-foreground">Discover and pay at millions of merchants</p>
          </div>

          {/* Top Merchants Banner */}
          {topMerchants.length > 0 && (
            <Card className="mb-8 bg-gradient-to-r from-primary/10 to-purple-100/50 border-primary/20">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Top Merchants</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {topMerchants.map((merchant, index) => (
                    <Card key={merchant.merchantId} className="p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                          {merchant.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary text-white border-primary">
                              #{index + 1}
                            </Badge>
                            <h3 className="font-semibold">{merchant.name}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {merchant.totalTransactions.toLocaleString()} transactions
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Search and Filters */}
          <Card className="p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search merchants by name or code..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category === "All Categories" ? "all" : category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Showing {filteredMerchants.length} merchants
            </p>
          </Card>

          {/* Merchants Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMerchants.map((merchant) => (
              <Card key={merchant.merchantId} className="p-6 hover:shadow-lg transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {merchant.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{merchant.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {merchant.merchantCode}
                      </p>
                    </div>
                  </div>
                  {merchant.featured && (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>

                {merchant.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {merchant.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <Badge variant="outline" className="font-normal">
                    {merchant.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{merchant.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>{merchant.totalTransactions.toLocaleString()} txns</span>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Zap className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                </div>

                {merchant.contactPhone && (
                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {merchant.contactPhone}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredMerchants.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground">
                <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No merchants found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            </Card>
          )}

          {/* Categories Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(1).map((category) => {
                const count = allMerchants.filter(m => m.category === category).length
                const icons: Record<string, any> = {
                  "E-Commerce": ShoppingBag,
                  "Food Delivery": Utensils,
                  "Food & Dining": Utensils,
                  "Entertainment": Store,
                  "Telecom": Smartphone,
                  "Utilities": Zap,
                  "Transportation": MapPin
                }
                const Icon = icons[category] || Store
                
                return (
                  <Card 
                    key={category}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => setFilterCategory(category)}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{category}</p>
                        <p className="text-xs text-muted-foreground">{count} merchants</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}