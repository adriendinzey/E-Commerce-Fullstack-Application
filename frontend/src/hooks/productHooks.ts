import { useQuery } from '@tanstack/react-query'
import { Product } from '../types/Product'
import APIClient from '../APIClient'

export const useGetProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => (await APIClient.get<Product[]>(`api/products`)).data,
  })

export const useGetProductBySlug = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: async () =>
      (await APIClient.get<Product>(`api/products/slug/${slug}`)).data,
  })

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () =>
      (await APIClient.get<[]>(`/api/products/categories`)).data,
  })
