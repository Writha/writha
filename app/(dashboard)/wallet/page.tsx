import { redirect } from "next/navigation"
import { getSupabaseServer } from "@/lib/supabase/server"
import { WalletCard } from "@/components/wallet/wallet-card"

export default async function WalletPage() {
  const supabase = getSupabaseServer()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
        <p className="text-muted-foreground">Manage your funds for purchases and earnings.</p>
      </div>

      <WalletCard />
    </div>
  )
}
