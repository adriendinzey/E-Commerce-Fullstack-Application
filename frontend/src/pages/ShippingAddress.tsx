import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { Helmet } from 'react-helmet-async'
import Checkout from '../components/Checkout'
import { Button, Form } from 'react-bootstrap'

export default function ShippingAddressPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const {
    userInfo,
    cart: { shippingAddress },
  } = state

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping')
    }
  }, [userInfo, navigate])

  const [fullName, setFullName] = useState(shippingAddress.fullName || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [province, setProvince] = useState(shippingAddress.province || '')
  const [country, setCountry] = useState(shippingAddress.country || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        province,
        country,
        postalCode,
      },
    })
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        province,
        country,
        postalCode,
      })
    )
    navigate('/payment')
  }

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <Checkout signInStepComplete shippingStepComplete></Checkout>
      <div className="container small-container">
        <h1 className="my-3">Shipping Address</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="province">
            <Form.Label>Province</Form.Label>
            <Form.Control
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
