import type React from "react"
declare module "react-paystack" {
  export interface PaystackButtonProps {
    text?: string
    className?: string
    disabled?: boolean
    embed?: boolean
    reference: string
    email: string
    amount: number
    publicKey: string
    metadata?: any
    currency?: string
    channels?: string[]
    label?: string
    onSuccess: (reference: any) => void
    onClose: () => void
  }

  export const PaystackButton: React.FC<PaystackButtonProps>
}
