import { Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useGetProducts } from '../hooks/productHooks'
import { getError } from '../utils'
import { APIError } from '../types/APIErorr'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import ProductListing from '../components/ProductListing'

export default function HomePage() {
  const { data: products, isLoading, error } = useGetProducts()
  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as APIError)}</MessageBox>
  ) : (
    <Row>
      <Helmet>
        <title>The Sweet Tooth's Swale</title>
      </Helmet>
      {products &&
        products.length &&
        products.map((product) => (
          <Col key={product.slug} sm={6} md={4} lg={3}>
            <ProductListing product={product} />
          </Col>
        ))}
    </Row>
  )
}
