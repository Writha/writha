"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PaystackButton } from "react-paystack"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

interface NigerianPaymentMethodsProps {
  email: string
  userId: string
  onSuccess: (amount: number) => void
}

export function NigerianPaymentMethods({ email, userId, onSuccess }: NigerianPaymentMethodsProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()
  const supabase = getSupabaseClient()

  // Convert amount to kobo (Paystack uses the smallest currency unit)
  const amountInKobo = Number.parseFloat(amount) * 100

  const handlePaystackSuccess = async (reference: any) => {
    setIsLoading(true)
    try {
      // Verify the transaction on your server
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reference: reference.reference,
          amount: Number.parseFloat(amount),
          userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Payment verification failed")
      }

      toast({
        title: "Payment successful",
        description: `₦${amount} has been added to your wallet`,
      })

      onSuccess(Number.parseFloat(amount))
      setAmount("")
    } catch (error: any) {
      toast({
        title: "Payment error",
        description: error.message || "Something went wrong with your payment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUSSDPayment = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would integrate with a USSD payment API
      // This is a simplified example
      toast({
        title: "USSD Code Generated",
        description: "Dial *123*456*789# to complete your payment",
      })

      // Simulate a successful payment after 5 seconds
      setTimeout(() => {
        onSuccess(Number.parseFloat(amount))
        setAmount("")
        setIsLoading(false)
      }, 5000)
    } catch (error: any) {
      toast({
        title: "USSD error",
        description: error.message || "Failed to generate USSD code",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleBankTransferPayment = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would integrate with a bank transfer API
      // This is a simplified example
      toast({
        title: "Bank Transfer Details",
        description:
          "Transfer to: Bank Name: Writha Bank, Account: 1234567890, Reference: WR-" + userId.substring(0, 8),
      })

      // In a real app, you would wait for webhook confirmation
      setIsLoading(false)
    } catch (error: any) {
      toast({
        title: "Bank transfer error",
        description: error.message || "Failed to generate bank transfer details",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleMobileMoneyPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real app, you would integrate with a mobile money API
      // This is a simplified example
      toast({
        title: "Mobile Money Request Sent",
        description: `A payment request has been sent to ${phoneNumber}. Please check your phone to authorize.`,
      })

      // Simulate a successful payment after 5 seconds
      setTimeout(() => {
        onSuccess(Number.parseFloat(amount))
        setAmount("")
        setPhoneNumber("")
        setIsLoading(false)
      }, 5000)
    } catch (error: any) {
      toast({
        title: "Mobile money error",
        description: error.message || "Failed to process mobile money payment",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amountInKobo,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_yourtestkeyhere",
    label: "Fund Writha Wallet",
    onSuccess: handlePaystackSuccess,
    onClose: () => {
      toast({
        title: "Payment cancelled",
        description: "You have cancelled the payment",
      })
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund Your Wallet</CardTitle>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount in Naira"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="100"
            step="100"
            className="mt-1"
          />
        </div>

        <Tabs defaultValue="card">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="ussd">USSD</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Pay securely with your debit or credit card via Paystack
            </p>
            <PaystackButton
              {...paystackConfig}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
              text={isLoading ? "Processing..." : "Pay with Card"}
              disabled={!amount || Number.parseFloat(amount) < 100 || isLoading}
            />
          </TabsContent>

          <TabsContent value="ussd" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Generate a USSD code to complete payment with your bank
            </p>
            <Button
              onClick={handleUSSDPayment}
              className="w-full"
              disabled={!amount || Number.parseFloat(amount) < 100 || isLoading}
            >
              {isLoading ? "Generating..." : "Generate USSD Code"}
            </Button>
          </TabsContent>

          <TabsContent value="transfer" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">Make a direct bank transfer to fund your wallet</p>
            <Button
              onClick={handleBankTransferPayment}
              className="w-full"
              disabled={!amount || Number.parseFloat(amount) < 100 || isLoading}
            >
              {isLoading ? "Generating..." : "Get Transfer Details"}
            </Button>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">Pay using mobile money services</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleMobileMoneyPayment}
                className="w-full"
                disabled={!amount || Number.parseFloat(amount) < 100 || !phoneNumber || isLoading}
              >
                {isLoading ? "Processing..." : "Pay with Mobile Money"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground">
          All transactions are secure and encrypted. By proceeding, you agree to our Terms of Service.
        </p>
      </CardFooter>
    </Card>
  )
}
