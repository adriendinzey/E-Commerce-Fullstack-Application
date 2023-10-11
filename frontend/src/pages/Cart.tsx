import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import MessageBox from '../components/MessageBox'
import { CartItem } from '../types/CartTypes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function CartPage() {
  const navigate = useNavigate()

  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store)

  const updateCartHandler = (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn('Sorry, there is not enough stock for your order.')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              <span>The cart is empty. </span>
              <Link to="/">Add some items to your cart here!</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item: CartItem) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <Link to={`/product/${item.slug}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>
                      </Link>
                    </Col>
                    <Col>
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant={mode}
                        disabled={item.quantity === 1}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </Button>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        variant={mode}
                        disabled={item.countInStock === item.quantity}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                      <span> {item.quantity}</span>
                    </Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant={mode}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items):$
                    {cartItems
                      .reduce((a, c) => a + c.price * c.quantity, 0)
                      .toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
