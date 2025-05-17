"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function NigerianPaymentMethods() {
  const [amount, setAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Payment Simulation",
        description: `Simulated payment of ₦${amount} using ${paymentMethod}. Paystack integration is disabled for testing.`,
      })
    } catch (err) {
      setError("Payment processing is currently disabled for testing.")
      console.error("Payment error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Paystack integration is currently disabled for testing purposes.</AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="100"
            step="100"
          />
          <p className="text-sm text-muted-foreground">Minimum amount: ₦100</p>
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="cursor-pointer">
                Card Payment
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="cursor-pointer">
                Bank Transfer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ussd" id="ussd" />
              <Label htmlFor="ussd" className="cursor-pointer">
                USSD
              </Label>
            </div>
          </RadioGroup>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading || !amount}>
          {isLoading ? "Processing..." : "Make Payment (Simulation)"}
        </Button>
      </form>
    </div>
  )
}
