import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'
import { keyRouter } from './routers/keyRouter'

dotenv.config()
const MONGODB_URI = process.env.MONGODB_URI!

mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB.')
  })
  .catch(() => {
    console.log('Error connecting to MongoDB.')
  })

const app = express()
app.use(
  cors({
    credentials: true,
    origin: '*',
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use('/api/products', productRouter)
app.use('/api/seed', seedRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/keys', keyRouter)

app.use(express.static(path.join(__dirname, '../../../frontend/dist')))
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../frontend/dist/index.html'))
})

const PORT = parseInt((process.env.PORT || '4041') as string, 10)

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
