import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Product } from '../types/Product'
import { Button } from 'react-bootstrap'
import Rating from './Rating'
import { useContext } from 'react'
import { CartItem } from '../types/CartTypes'
import { Store } from '../Store'
import { convertProductToCartItem } from '../utils'
function ProductListing({ product }: { product: Product }) {
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  const addToCartHandler = (item: CartItem) => {
    const existingItem = cartItems.find((x) => x._id === product._id)
    const quantity = existingItem ? existingItem.quantity + 1 : 1
    if (product.countInStock < quantity) {
      alert('Sorry, that product is out of stock.')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.name}
          </Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price.toFixed(2)}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Sold out
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(convertProductToCartItem(product))}
          >
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}

export default ProductListing
