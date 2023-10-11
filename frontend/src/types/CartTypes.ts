export type CartItem = {
  _id: string
  name: string
  slug: string
  image: string | undefined
  quantity: number
  countInStock: number
  price: number
}

export type ShippingAddress = {
  fullName: string
  address: string
  city: string
  province: string
  country: string
  postalCode: string
}

export type Cart = {
  subtotal: number
  shippingCost: number
  tax: number
  totalPrice: number
  cartItems: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
}
