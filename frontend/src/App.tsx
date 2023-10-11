import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import {
  Button,
  Container,
  ListGroup,
  Nav,
  NavDropdown,
  Navbar,
} from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { Store } from './Store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faCartShopping,
  faMoon,
} from '@fortawesome/free-solid-svg-icons'
import { faSun } from '@fortawesome/free-regular-svg-icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SearchBox from './components/SearchBox'
import { useGetCategoriesQuery } from './hooks/productHooks'
import LoadingBox from './components/LoadingBox'
import MessageBox from './components/MessageBox'
import { APIError } from './types/APIErorr'
import { getError } from './utils'
function App() {
  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store)
  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode)
  }, [mode])

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

  const { data: categories, isLoading, error } = useGetCategoriesQuery()

  const switchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' })
  }

  const signOutHandler = () => {
    dispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }

  return (
    <div className="d-flex flex-column vh-100">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar
          className="d-flex-flex-column justify-content-center align-items-stretch p-2 pb-0"
          expand="lg"
        >
          <div className="d-flex justify-content-between align-items-center">
            <Navbar.Brand href="/">The Sweet Tooths' Swale</Navbar.Brand>
            <SearchBox />
            <Navbar.Collapse>
              <Nav className="w-100 justify-content-end">
                <Link
                  to="#"
                  className="nav-link header-link"
                  onClick={switchModeHandler}
                >
                  {' '}
                  <FontAwesomeIcon
                    icon={mode === 'light' ? faSun : faMoon}
                    className={mode === 'light' ? 'sun' : 'moon'}
                  />{' '}
                </Link>
                {userInfo ? (
                  <NavDropdown
                    title={`Hello, ${userInfo.name}`}
                    className="header-link"
                  >
                    <Link to="/profile" className="dropdown-item">
                      User Profile
                    </Link>
                    <Link to="/orderhistory" className="dropdown-item">
                      Order History
                    </Link>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signOutHandler}
                    >
                      Sign-Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link header-link" to="/signin">
                    Sign-In/Sign-Up
                  </Link>
                )}
                <Link to="/cart" className="nav-link header-link">
                  {cart.cartItems.length > 0 && (
                    <span className="cart-badge">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                  <FontAwesomeIcon icon={faCartShopping} />
                </Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
        <Navbar
          className="d-flex-flex-column justify-content-center align-items-stretch p-2 pb-0 mb-3"
          expand="lg"
        >
          <div className="sub-header">
            <div className="d-flex">
              <FontAwesomeIcon
                className="nav-link header-link p-2 px-3"
                icon={faBars}
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              />
              {["Today's Deal", 'Gifts', 'On Sale'].map((x) => (
                <Link
                  reloadDocument
                  key={x}
                  className="nav-link header-link p-1 px-3"
                  to={`/search?tag=${x}`}
                >
                  {x}
                </Link>
              ))}
            </div>
          </div>
        </Navbar>
      </header>
      {sidebarIsOpen && (
        <div
          onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          className="side-navbar-backdrop"
        ></div>
      )}

      <div
        className={
          sidebarIsOpen
            ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
            : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
        }
      >
        <ListGroup variant="flush">
          <ListGroup.Item action className="side-navbar-user">
            <Link
              to={userInfo ? `/profile` : `/signin`}
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <span>
                {userInfo ? `Hello, ${userInfo.name}` : `Hello, sign in`}
              </span>
            </Link>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Categories</strong>
              <Button
                variant={mode}
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fa fa-times" />
              </Button>
            </div>
          </ListGroup.Item>
          {isLoading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">
              {getError(error as APIError)}
            </MessageBox>
          ) : (
            categories!.map((category) => (
              <ListGroup.Item action key={category}>
                <Link
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                  reloadDocument
                >
                  {category}
                </Link>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </div>
      <main>
        <Container className="mt-3">
          <Outlet />
        </Container>
      </main>

      <footer className="footer">
        <div className="text-center">
          Written by Adrien Dinzey.{' '}
          <a href="https://github.com/adriendinzey">@GitHub</a>
          <a
            href="https://www.flaticon.com/free-icons/candy"
            title="candy icons"
          >
            Candy icon created by Freepik - Flaticon
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
