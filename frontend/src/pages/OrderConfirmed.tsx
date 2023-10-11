import { useContext, useEffect } from 'react'
import { Store } from '../Store'
import { Link, useParams } from 'react-router-dom'
import {
  useGetOrderQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from '../hooks/orderHooks'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { APIError } from '../types/APIErorr'
import { Helmet } from 'react-helmet-async'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
  PayPalButtonsComponentProps,
  PayPalButtons,
} from '@paypal/react-paypal-js'

export default function OrderConfirmedPage() {
  const { state } = useContext(Store)
  const { userInfo } = state

  const params = useParams()
  const { id: orderId } = params

  const { data: order, isLoading, error, refetch } = useGetOrderQuery(orderId!)

  const { mutateAsync: payOrder, isLoading: loadingPayment } =
    usePayOrderMutation()
  const testPayHandler = async () => {
    await payOrder({ orderId: orderId! })
    refetch()
    toast.success('Order was paid successfully.')
  }

  const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer()
  const { data: paypalConfig } = useGetPayPalClientIdQuery()

  useEffect(() => {
    if (paypalConfig && paypalConfig.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            clientId: paypalConfig!.clientId,
            currency: 'CAD',
          },
        })
        paypalDispatch({
          type: 'setLoadingStatus',
          value: SCRIPT_LOADING_STATE.PENDING,
        })
      }
      loadPayPalScript()
    }
  }, [paypalConfig, paypalDispatch])

  console.log(userInfo!.email + loadingPayment)

  const payPalButtonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: 'vertical' },
    createOrder(data, actions) {
      console.log(data.paymentSource)
      return actions.order
        .create({
          purchase_units: [
            {
              amount: {
                value: order!.totalPrice.toString(),
              },
            },
          ],
        })
        .then((orderID: string) => {
          return orderID
        })
    },
    onApprove(data, actions) {
      console.log(data.orderID)
      return actions.order!.capture().then(async (details) => {
        try {
          payOrder({ orderId: orderId!, ...details })
          refetch()
          toast.success('The order was paid successfully!')
        } catch (err) {
          toast.error(getError(err as APIError))
        }
      })
    },
    onError: (err) => {
      toast.error(getError(err as APIError))
    },
  }
  return isLoading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{getError(error as APIError)}</MessageBox>
  ) : !order ? (
    <MessageBox variant="danger">Order Not Found</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order Confirmation</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping Information</Card.Title>
              <Card.Text>
                <strong>Name: </strong>
                {order.shippingAddress.fullName}
                <br />
                <strong>Address: </strong>
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.province},{' '}
                {order.shippingAddress.country},{' '}
                {order.shippingAddress.postalCode}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered on {order.deliveredOn}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">Delivery Pending</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment Information</Card.Title>
              <Card.Text>
                <strong>Payment Method: </strong>
                {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid on {order.paidOn}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">Payment Incomplete</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Cart</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
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
                    <Col>${order.subtotal.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping Cost</Col>
                    <Col>${order.shippingCost.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.tax.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total Price</Col>
                    <Col>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : isRejected ? (
                      <MessageBox variant="danger">
                        Error connecting to payment service.
                      </MessageBox>
                    ) : order.paymentMethod === 'PayPal' ? (
                      <div>
                        <PayPalButtons
                          {...payPalButtonTransactionProps}
                        ></PayPalButtons>
                      </div>
                    ) : (
                      <div>
                        <Button onClick={testPayHandler}>Test Payment</Button>
                      </div>
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
