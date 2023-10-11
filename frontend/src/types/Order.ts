import { CartItem, ShippingAddress } from './CartTypes'
import { User } from './UserInfo'

export type Order = {
  _id: string
  orderItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  totalPrice: number
  user: User
  createdAt: string
  isPaid: boolean
  paidOn: string
  isDelivered: boolean
  deliveredOn: string
}
