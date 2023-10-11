import { Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useGetProducts } from '../hooks/productHooks'
import { getError } from '../utils'
import { APIError } from '../types/APIErorr'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import ProductListing from '../components/ProductListing'

export default function SearchPage() {
  const tags = { "Today's Deal": 'deal', 'On Sale': 'sale', Gifts: 'gift' }
  const { data: products, isLoading, error } = useGetProducts()
  const urlParams = new URLSearchParams(window.location.search)
  const tag = tags[urlParams.get('tag') as keyof typeof tags]
  const queryKey = urlParams.get('query')
  const category = urlParams.get('category')
  let filteredProducts = products
  if (tag) {
    filteredProducts = products?.filter((product) => product.tags.includes(tag))
  } else if (queryKey) {
    filteredProducts = products?.filter((product) =>
      product.name.toLowerCase().includes(queryKey.toLowerCase())
    )
  } else if (category) {
    filteredProducts = products?.filter((product) =>
      product.category.toLowerCase().includes(category.toLowerCase())
    )
  }

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as APIError)}</MessageBox>
  ) : (
    <Row>
      <Helmet>
        <title>The Sweet Tooth's Swale</title>
      </Helmet>
      {filteredProducts!.map((product) => (
        <Col key={product.slug} sm={6} md={4} lg={3}>
          <ProductListing product={product} />
        </Col>
      ))}
    </Row>
  )
}
