"use client"

import Navigation from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  CreditCard, 
  Zap,
  Search,
  Filter,
  Download,
  Calendar,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function Transactions() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [allTransactions, setAllTransactions] = useState<any[]>([])

  // Check authentication
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  // Fetch transactions from API
  useEffect(() => {
    if (!session?.user) return

    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const userId = "2E3BCE0423" // Default user for demo
        const token = localStorage.getItem("bearer_token")
        
        // Build query params
        const params = new URLSearchParams({
          user_id: userId,
          limit: "100"
        })

        if (filterType !== "all") {
          params.append("type", filterType)
        }

        if (filterStatus !== "all") {
          params.append("status", filterStatus)
        }

        const res = await fetch(`/api/transactions?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setAllTransactions(data)
        } else {
          toast.error("Failed to load transactions")
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
        toast.error("Failed to load transactions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [filterType, filterStatus, session])

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navigation />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading transactions...</p>
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
            <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
            <p className="text-muted-foreground">View and manage all your transactions</p>
          </div>

          {/* Filters Section */}
          <Card className="p-6 mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by recipient or transaction ID..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="P2P">Peer to Peer</SelectItem>
                  <SelectItem value="PAYMENT">Payment</SelectItem>
                  <SelectItem value="TOPUP">Top Up</SelectItem>
                  <SelectItem value="BILL">Bill Payment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                  <SelectItem value="INITIATED">Initiated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {allTransactions.filter(txn => {
                  const matchesSearch = txn.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                       txn.txnRef.toLowerCase().includes(searchQuery.toLowerCase())
                  return matchesSearch
                }).length} of {allTransactions.length} transactions
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Card>

          {/* Transactions List */}
          <div className="space-y-4">
            {allTransactions.filter(txn => {
              const matchesSearch = txn.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   txn.txnRef.toLowerCase().includes(searchQuery.toLowerCase())
              return matchesSearch
            }).map((txn) => (
              <Card key={txn.transactionId} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className={`${txn.amount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                      <AvatarFallback className={txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {txn.amount >= 0 ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{txn.recipientName}</h3>
                          <p className="text-sm text-muted-foreground">{txn.description || "No description"}</p>
                        </div>
                        <p className={`text-2xl font-bold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(() => {
                            const sign = txn.amount >= 0 ? "+" : ""
                            return `${sign}₹${Math.abs(txn.amount).toLocaleString("en-IN")}`
                          })()}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {(() => {
                            const date = new Date(txn.createdAt)
                            return date.toLocaleDateString("en-IN", { 
                              day: "numeric", 
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          })()}
                        </span>
                        <span>•</span>
                        <Badge variant="outline" className="font-normal">
                          {(() => {
                            switch(txn.type) {
                              case "P2P": return "Peer to Peer"
                              case "PAYMENT": return "Payment"
                              case "TOPUP": return "Top Up"
                              case "BILL": return "Bill Payment"
                              case "WITHDRAW": return "Withdrawal"
                              default: return txn.type
                            }
                          })()}
                        </Badge>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          {txn.channel === "UPI" && <Zap className="w-3 h-3" />}
                          {txn.channel === "WALLET" && <Wallet className="w-3 h-3" />}
                          {txn.channel === "BANK" && <CreditCard className="w-3 h-3" />}
                          {txn.channel}
                        </span>
                        <span>•</span>
                        <Badge className={(() => {
                          switch(txn.status) {
                            case "SUCCESS": return "bg-green-100 text-green-700"
                            case "FAILED": return "bg-red-100 text-red-700"
                            case "REFUNDED": return "bg-blue-100 text-blue-700"
                            case "INITIATED": return "bg-yellow-100 text-yellow-700"
                            default: return "bg-gray-100 text-gray-700"
                          }
                        })()}>
                          {txn.status}
                        </Badge>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Transaction ID: <span className="font-mono">{txn.txnRef}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {allTransactions.filter(txn => {
            const matchesSearch = txn.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 txn.txnRef.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesSearch
          }).length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No transactions found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}