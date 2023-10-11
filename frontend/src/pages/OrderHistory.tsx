import { useNavigate } from 'react-router-dom'
import { useGetOrderHistoryQuery } from '../hooks/orderHooks'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { getError } from '../utils'
import { APIError } from '../types/APIErorr'
import { Button } from 'react-bootstrap'

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery()
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as APIError)}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>ORDER DATE</th>
              <th>ORDER TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
            </tr>
          </thead>
          {orders!.length > 0 && (
            <tbody>
              {orders!.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid
                      ? order.paidOn.substring(0, 10)
                      : 'Payment not yet recieved.'}
                  </td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredOn.substring(0, 10)
                      : 'Order not yet delivered.'}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/order/${order._id}`)
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      )}
    </div>
  )
}
