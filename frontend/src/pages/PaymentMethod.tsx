import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import Checkout from '../components/Checkout'
import { Helmet } from 'react-helmet-async'
import { Button, Form } from 'react-bootstrap'

export default function PaymentMethodPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingAddress, paymentMethod },
  } = state

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'Credit Card'
  )

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping')
    }
  }, [shippingAddress, navigate])

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName })
    localStorage.setItem('paymentMethod', paymentMethodName)
    navigate('/order')
  }

  return (
    <div>
      <Checkout
        signInStepComplete
        shippingStepComplete
        paymentStepComplete
      ></Checkout>
      <Helmet>Payment Method</Helmet>
      <h1 className="my-3">Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="Credit Card"
            label="Credit Card"
            value="Credit Card"
            checked={paymentMethodName === 'Credit Card'}
            onChange={(e) => setPaymentMethodName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="PayPal"
            label="PayPal"
            value="PayPal"
            checked={paymentMethodName === 'PayPal'}
            onChange={(e) => setPaymentMethodName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="Stripe"
            label="Stripe"
            value="Stripe"
            checked={paymentMethodName === 'Stripe'}
            onChange={(e) => setPaymentMethodName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Button type="submit">Continue</Button>
        </div>
      </Form>
    </div>
  )
}
