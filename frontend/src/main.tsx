import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import App from './App.tsx'
import HomePage from './pages/Home'
import ProductPage from './pages/Product'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StoreProvider } from './Store.tsx'
import CartPage from './pages/Cart.tsx'
import SignInPage from './pages/SignIn.tsx'
import SignUpPage from './pages/SignUp.tsx'
import ShippingAddressPage from './pages/ShippingAddress.tsx'
import PaymentMethodPage from './pages/PaymentMethod.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import PlaceOrderPage from './pages/PlaceOrder.tsx'
import OrderConfirmedPage from './pages/OrderConfirmed.tsx'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import OrderHistoryPage from './pages/OrderHistory.tsx'
import SearchPage from './pages/Search.tsx'
import ProfilePage from './pages/Profile.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="signin" element={<SignInPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="order" element={<PlaceOrderPage />} />
        <Route path="order/:id" element={<OrderConfirmedPage />} />
        <Route path="orderhistory" element={<OrderHistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>
  )
)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <PayPalScriptProvider options={{ clientId: 'sb' }} deferLoading={true}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </HelmetProvider>
      </PayPalScriptProvider>
    </StoreProvider>
  </React.StrictMode>
)
