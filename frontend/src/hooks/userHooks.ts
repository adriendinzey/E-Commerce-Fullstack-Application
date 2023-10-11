import { useMutation } from '@tanstack/react-query'
import APIClient from '../APIClient'
import { UserInfo } from '../types/UserInfo'

export const useSignInMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) =>
      (
        await APIClient.post<UserInfo>(`api/users/signin`, {
          email,
          password,
        })
      ).data,
  })

export const useSignUpMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) =>
      (
        await APIClient.post<UserInfo>(`api/users/signup`, {
          name,
          email,
          password,
        })
      ).data,
  })

export const useUpdateProfileMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) =>
      (
        await APIClient.put<UserInfo>(`api/users/profile`, {
          name,
          email,
          password,
        })
      ).data,
  })
