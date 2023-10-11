import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { useCreateOrderMutation } from '../hooks/orderHooks'
import { getError } from '../utils'
import { APIError } from '../types/APIErorr'
import { toast } from 'react-toastify'
import Checkout from '../components/Checkout'
import { Helmet } from 'react-helmet-async'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import LoadingBox from '../components/LoadingBox'

export default function PlaceOrderPage() {
  const taxProvinces = {
    BC: 0.12,
    AB: 0.05,
    SK: 0.11,
    MB: 0.12,
    ON: 0.13,
    QC: 0.14975,
    NB: 0.15,
    PE: 0.15,
    NS: 0.15,
    NL: 0.15,
    YK: 0.05,
    NT: 0.05,
    NU: 0.05,
    'British Columbia': 0.12,
    Alberta: 0.05,
    Saskatchewan: 0.11,
    Manitoba: 0.12,
    Ontario: 0.13,
    Quebec: 0.14975,
    'New Brunswick': 0.15,
    'Prince Edward Island': 0.15,
    'Nova Scotia': 0.15,
    'Newfoundland & Labrador': 0.15,
    Yukon: 0.05,
    'Norhtwest Territories': 0.05,
    Nunavut: 0.05,
  }

  const navigate = useNavigate()

  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state
  console.log(userInfo)
  const round2Digits = (num: number) =>
    Math.round(num * 100 + Number.EPSILON) / 100

  const taxPercent =
    (cart.shippingAddress.province as keyof typeof taxProvinces) in taxProvinces
      ? taxProvinces[cart.shippingAddress.province as keyof typeof taxProvinces]
      : 0.15

  cart.subtotal = round2Digits(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )
  cart.shippingCost = cart.subtotal > 50 ? round2Digits(0) : 19.95
  cart.tax = round2Digits(taxPercent * cart.subtotal)
  cart.totalPrice = cart.subtotal + cart.tax + cart.shippingCost

  const { mutateAsync: createOrder, isLoading } = useCreateOrderMutation()

  const placeOrderHandler = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        subtotal: cart.subtotal,
        shippingCost: cart.shippingCost,
        tax: cart.tax,
        totalPrice: cart.totalPrice,
      })
      dispatch({ type: 'CART_CLEAR' })
      localStorage.removeItem('cartItems')
      navigate(`/order/${data.order._id}`)
    } catch (err) {
      toast.error(getError(err as APIError))
    }
  }

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment')
    }
  }, [cart, navigate])
  return (
    <div>
      <Checkout
        signInStepComplete
        shippingStepComplete
        paymentStepComplete
        placeOrderStepComplete
      />
      <Helmet>
        <title>Confirm Order</title>
      </Helmet>
      <h1 className="my-3">Confirm Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping Information</Card.Title>
              <Card.Text>
                <strong>Name: </strong>
                {cart.shippingAddress.fullName}
                <br />
                <strong>Address: </strong>
                {cart.shippingAddress.address}
                <br />
                {cart.shippingAddress.city}, {cart.shippingAddress.province},{' '}
                {cart.shippingAddress.country},{' '}
                {cart.shippingAddress.postalCode}
              </Card.Text>
              <Link to="/shipping">Edit Shipping Information</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment Information</Card.Title>
              <Card.Text>
                <strong>Payment Method: </strong>
                {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit Payment Information</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Cart</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <Link to={`/product/${item.slug}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded thumbnail"
                          ></img>{' '}
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Edit Cart</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Subtotal</Col>
                    <Col>${cart.subtotal.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping Cost</Col>
                    <Col>${cart.shippingCost.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.tax.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total Price</Col>
                    <Col>${cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    onClick={placeOrderHandler}
                    disabled={cart.cartItems.length === 0 || isLoading}
                  >
                    Place Order
                  </Button>
                  {isLoading && <LoadingBox></LoadingBox>}
                </div>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
