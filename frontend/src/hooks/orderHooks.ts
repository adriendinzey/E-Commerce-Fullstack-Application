import { useMutation, useQuery } from '@tanstack/react-query'
import { CartItem, ShippingAddress } from '../types/CartTypes'
import APIClient from '../APIClient'
import { Order } from '../types/Order'

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[]
      shippingAddress: ShippingAddress
      paymentMethod: string
      subtotal: number
      shippingCost: number
      tax: number
      totalPrice: number
    }) =>
      (
        await APIClient.post<{ message: string; order: Order }>(
          `api/orders`,
          order
        )
      ).data,
  })

export const useGetOrderQuery = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: async () => (await APIClient.get<Order>(`api/orders/${id}`)).data,
  })

export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ['order-history'],
    queryFn: async () => (await APIClient.get<Order[]>(`api/orders/`)).data,
  })

export const useGetPayPalClientIdQuery = () =>
  useQuery({
    queryKey: ['paypal-clientId'],
    queryFn: async () =>
      (await APIClient.get<{ clientId: string }>(`api/keys/paypal`)).data,
  })

export const useGetStripeClientIdQuery = () =>
  useQuery({
    queryKey: ['stripe-clientId'],
    queryFn: async () =>
      (await APIClient.get<{ clientId: string }>(`api/keys/stripe`)).data,
  })

export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) =>
      (
        await APIClient.put<{ message: string; order: Order }>(
          `api/orders/${details.orderId}/pay`,
          details
        )
      ).data,
  })
