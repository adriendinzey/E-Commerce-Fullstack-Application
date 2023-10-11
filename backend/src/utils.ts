import { User } from './models/userModel'
import { NextFunction, Response, Request } from 'express'
import jwt from 'jsonwebtoken'
export const generateToken = (user: User) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'secretpassword',
    {
      expiresIn: '30d',
    }
  )
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.split(' ')[1]
    const decode = jwt.verify(token, process.env.JWT_SECRET || 'secretpassword')
    req.user = decode as {
      _id: string
      name: string
      email: string
      isAdmin: boolean
      token: string
    }
    next()
  } else {
    res.status(401).json({ message: 'User not authenticated.' })
  }
}
