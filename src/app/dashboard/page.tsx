"use client"

import Navigation from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone, 
  CreditCard, 
  Zap,
  Eye,
  EyeOff,
  Send,
  Download,
  Receipt,
  Gift,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import { AddMoneyDialog } from "@/components/AddMoneyDialog"
import { WithdrawDialog } from "@/components/WithdrawDialog"

export default function Dashboard() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [showBalance, setShowBalance] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [walletData, setWalletData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [addMoneyOpen, setAddMoneyOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  // Check authentication
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  // Fetch user, wallet, and transactions data
  const fetchData = async () => {
    if (!session?.user) return

    try {
      setIsLoading(true)
      const userId = "2E3BCE0423" // Default user for demo

      const token = localStorage.getItem("bearer_token")

      // Fetch user data
      const userRes = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      })
      if (userRes.ok) {
        const user = await userRes.json()
        setUserData(user)
      }

      // Fetch wallet data
      const walletRes = await fetch(`/api/wallets/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      })
      if (walletRes.ok) {
        const wallet = await walletRes.json()
        setWalletData(wallet)
      }

      // Fetch recent transactions
      const txnRes = await fetch(`/api/transactions/user/${userId}?limit=5&t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
      })
      if (txnRes.ok) {
        const txns = await txnRes.json()
        setRecentTransactions(txns)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [session])

  const quickActions = [
    { icon: Send, label: "Send Money", color: "bg-blue-500" },
    { icon: Download, label: "Request", color: "bg-green-500" },
    { icon: Smartphone, label: "Recharge", color: "bg-orange-500" },
    { icon: Receipt, label: "Pay Bills", color: "bg-purple-500" },
    { icon: CreditCard, label: "Add Money", color: "bg-pink-500" },
    { icon: Gift, label: "Offers", color: "bg-yellow-500" }
  ]

  const formatAmount = (amount: number) => {
    const sign = amount >= 0 ? "+" : ""
    return `${sign}₹${Math.abs(amount).toLocaleString("en-IN")}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { 
      day: "numeric", 
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navigation />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
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
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session.user.name}
            </h1>
            <p className="text-muted-foreground">Manage your wallet and transactions</p>
          </div>

          {/* Wallet Balance Card */}
          <Card className="mb-8 bg-gradient-to-br from-primary to-purple-600 text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-100">PhonePe Wallet</p>
                    <p className="text-xs text-purple-200">User ID: {userData?.userId || "N/A"}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </Button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-purple-100 mb-2">Available Balance</p>
                <h2 className="text-4xl font-bold">
                  {showBalance 
                    ? `₹${(walletData?.balance || 0).toLocaleString("en-IN")}` 
                    : "₹ •••••"
                  }
                </h2>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-white text-primary hover:bg-white/90"
                  onClick={() => setAddMoneyOpen(true)}
                >
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 bg-transparent border-white text-white hover:bg-white/20"
                  onClick={() => setWithdrawOpen(true)}
                >
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-center">{action.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <Button 
                variant="link" 
                className="text-primary"
                onClick={() => router.push("/transactions")}
              >
                View All
              </Button>
            </div>

            {recentTransactions.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No transactions yet</p>
              </Card>
            ) : (
              <Card className="divide-y">
                {recentTransactions.map((txn) => (
                  <div key={txn.transactionId} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className={`${txn.amount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                          <AvatarFallback className={txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {txn.amount >= 0 ? (
                              <ArrowDownLeft className="w-5 h-5" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{txn.recipientName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatDate(txn.createdAt)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {txn.channel === "UPI" && <Zap className="w-3 h-3" />}
                              {txn.channel === "WALLET" && <Wallet className="w-3 h-3" />}
                              {txn.channel === "BANK" && <CreditCard className="w-3 h-3" />}
                              {txn.channel}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatAmount(txn.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            txn.status === 'SUCCESS' ? 'bg-green-500' : 
                            txn.status === 'FAILED' ? 'bg-red-500' : 
                            txn.status === 'REFUNDED' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}></span>
                          {txn.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Add Money Dialog */}
      <AddMoneyDialog
        open={addMoneyOpen}
        onOpenChange={setAddMoneyOpen}
        userId={userData?.userId || "2E3BCE0423"}
        onSuccess={fetchData}
      />

      {/* Withdraw Dialog */}
      <WithdrawDialog
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        userId={userData?.userId || "2E3BCE0423"}
        currentBalance={walletData?.balance || 0}
        onSuccess={fetchData}
      />
    </div>
  )
}