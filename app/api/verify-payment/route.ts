import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const { reference, userId } = await request.json()

    // For testing purposes, we'll simulate a successful payment verification
    const simulatedPaymentData = {
      status: "success",
      amount: 1000, // ₦1000
      reference,
      transaction_date: new Date().toISOString(),
      payment_method: "card",
    }

    // Record the transaction in the database
    const { error } = await supabase.from("transactions").insert({
      user_id: userId,
      amount: simulatedPaymentData.amount / 100, // Convert from kobo to naira
      reference: simulatedPaymentData.reference,
      status: simulatedPaymentData.status,
      payment_method: simulatedPaymentData.payment_method,
      transaction_date: simulatedPaymentData.transaction_date,
    })

    if (error) {
      console.error("Error recording transaction:", error)
      return NextResponse.json({ success: false, message: "Failed to record transaction" }, { status: 500 })
    }

    // Update user's wallet balance
    const { error: walletError } = await supabase.rpc("update_wallet_balance", {
      p_user_id: userId,
      p_amount: simulatedPaymentData.amount / 100,
    })

    if (walletError) {
      console.error("Error updating wallet balance:", walletError)
      return NextResponse.json({ success: false, message: "Failed to update wallet balance" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: simulatedPaymentData,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 500 })
  }
}
