import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { reference, amount, userId } = await request.json()

    // In a production environment, you would verify the payment with Paystack
    // using their API and your secret key
    // const verificationResponse = await fetch(
    //   `https://api.paystack.co/transaction/verify/${reference}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    //     },
    //   }
    // )
    // const verificationData = await verificationResponse.json()

    // For this example, we'll assume the payment was successful
    const supabase = getSupabaseServer()

    // Get current wallet balance
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", userId)
      .single()

    if (profileError) {
      return NextResponse.json({ message: "Failed to retrieve user profile" }, { status: 400 })
    }

    // Update wallet balance
    const newBalance = (profileData.wallet_balance || 0) + amount

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ wallet_balance: newBalance })
      .eq("id", userId)

    if (updateError) {
      return NextResponse.json({ message: "Failed to update wallet balance" }, { status: 400 })
    }

    // Record transaction
    const { error: transactionError } = await supabase.from("transactions").insert({
      user_id: userId,
      amount,
      transaction_type: "deposit",
      description: "Wallet deposit via Paystack",
      reference_id: reference,
    })

    if (transactionError) {
      return NextResponse.json({ message: "Failed to record transaction" }, { status: 400 })
    }

    return NextResponse.json({ success: true, newBalance })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
