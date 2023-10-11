import { Col, Row } from 'react-bootstrap'

export default function Checkout(props: {
  signInStepComplete?: boolean
  shippingStepComplete?: boolean
  paymentStepComplete?: boolean
  placeOrderStepComplete?: boolean
}) {
  return (
    <Row className="checkout-steps">
      <Col className={props.signInStepComplete ? 'active' : ''}>Sign-In</Col>
      <Col className={props.shippingStepComplete ? 'active' : ''}>Shipping</Col>
      <Col className={props.paymentStepComplete ? 'active' : ''}>Payment</Col>
      <Col className={props.placeOrderStepComplete ? 'active' : ''}>
        Place Order
      </Col>
    </Row>
  )
}
