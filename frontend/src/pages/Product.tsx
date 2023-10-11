import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { useGetProductBySlug } from '../hooks/productHooks'
import { useContext } from 'react'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { APIError } from '../types/APIErorr'
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import Rating from '../components/Rating'
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { convertProductToCartItem } from '../utils'

export default function ProductPage() {
  //const navigate = useNavigate()
  const params = useParams()
  const { slug } = params
  const { data: product, isLoading, error } = useGetProductBySlug(slug!)

  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const addToCartHandler = () => {
    const existingItem = cart.cartItems.find((x) => x._id === product!._id)
    const quantity = existingItem ? existingItem.quantity + 1 : 1
    if (product!.countInStock < quantity) {
      toast.warn('There is not enough stock for this product.')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...convertProductToCartItem(product!), quantity },
    })
    toast.success('Product was added to the cart.')
  }

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as APIError)}</MessageBox>
  ) : !product ? (
    <MessageBox variant="danger">Product Not Found</MessageBox>
  ) : (
    <div>
      <Row>
        <Col>
          <img className="large" src={product.image} alt={product.name}></img>
        </Col>
        <Col>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>Product Page</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>Brand: {product.brand}</ListGroup.Item>
            <ListGroup.Item>Category: {product.category}</ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 ? (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button variant="primary" onClick={addToCartHandler}>
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button variant="gray" disabled={true}>
                        Out of Stock
                      </Button>
                    </div>
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
