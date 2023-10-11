import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { useSignUpMutation } from '../hooks/userHooks'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { APIError } from '../types/APIErorr'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInURL = new URLSearchParams(search).get('redirect')
  const redirect = redirectInURL ? redirectInURL : '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')

  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  const { mutateAsync: signUp, isLoading } = useSignUpMutation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password !== confirmedPassword) {
      toast.error('Passwords do not match.')
      return
    }
    try {
      const data = await signUp({
        name,
        email,
        password,
      })
      dispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate(redirect)
    } catch (err) {
      toast.error(getError(err as APIError))
    }
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign-Up</title>
      </Helmet>
      <h1 className="my-3">Sign-Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="name"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmedPassword">
          <Form.Label>Confirm your password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button disabled={isLoading} type="submit">
            Sign-Up
          </Button>
          {isLoading && <LoadingBox />}
        </div>
        <div className="mb-3">
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In here!</Link>
        </div>
      </Form>
    </Container>
  )
}
