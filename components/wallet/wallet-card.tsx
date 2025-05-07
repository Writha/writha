"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { NigerianPaymentMethods } from "./nigerian-payment-methods"

interface Transaction {
  id: string
  amount: number
  transaction_type: "purchase" | "sale" | "refund" | "payout" | "deposit"
  description: string | null
  created_at: string
}

export function WalletCard() {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const supabase = getSupabaseClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    setIsLoading(true)
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setUserEmail(user.email)
      setCurrentUserId(user.id)

      // Get wallet balance
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single()

      if (profileError) throw profileError
      setBalance(profileData.wallet_balance)

      // Get recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (transactionsError) throw transactionsError
      setTransactions(transactionsData)
    } catch (error) {
      console.error("Error fetching wallet data:", error)
      toast({
        title: "Error",
        description: "Could not load wallet data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeposit = async () => {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to deposit",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in")

      const amount = Number.parseFloat(depositAmount)

      // In a real app, you would integrate with a payment processor here
      // For this demo, we'll simulate a successful payment

      // Update wallet balance
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single()

      if (profileError) throw profileError

      const newBalance = (profileData.wallet_balance || 0) + amount

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ wallet_balance: newBalance })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Record transaction
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount,
        transaction_type: "deposit",
        description: "Wallet deposit",
      })

      if (transactionError) throw transactionError

      setBalance(newBalance)
      setDepositAmount("")

      toast({
        title: "Deposit successful",
        description: `$${amount.toFixed(2)} has been added to your wallet`,
      })

      // Refresh transactions
      fetchWalletData()
    } catch (error: any) {
      toast({
        title: "Deposit failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "purchase":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "sale":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "refund":
        return <ArrowDownLeft className="h-4 w-4 text-amber-500" />
      case "payout":
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handlePaymentSuccess = (amount: number) => {
    if (balance !== null) {
      setBalance(balance + amount)
    }
    fetchWalletData()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="mr-2 h-5 w-5" />
          My Wallet
        </CardTitle>
        <CardDescription>Manage your funds for purchases and earnings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-6 rounded-lg mb-6 text-center">
          <div className="text-sm font-medium mb-2">Current Balance</div>
          <div className="text-3xl font-bold">${balance !== null ? balance.toFixed(2) : "0.00"}</div>
        </div>

        <Tabs defaultValue="deposit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="deposit" className="space-y-4 py-4">
            {userEmail && currentUserId ? (
              <NigerianPaymentMethods email={userEmail} userId={currentUserId} onSuccess={handlePaymentSuccess} />
            ) : (
              <div className="text-center py-6 text-muted-foreground">Loading payment options...</div>
            )}
          </TabsContent>
          <TabsContent value="transactions" className="py-4">
            <div className="space-y-4">
              <div className="text-sm font-medium">Recent Transactions</div>
              {transactions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No transactions yet</div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center">
                        <div className="mr-3">{getTransactionIcon(transaction.transaction_type)}</div>
                        <div>
                          <div className="text-sm font-medium capitalize">{transaction.transaction_type}</div>
                          <div className="text-xs text-muted-foreground">{transaction.description || "-"}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {transaction.transaction_type === "purchase" ? "-" : "+"}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground">
          Funds in your wallet can be used to purchase books or withdrawn if you're a writer
        </p>
      </CardFooter>
    </Card>
  )
}
