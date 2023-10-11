import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { isAuth } from '../utils'
import { Order, OrderModel } from '../models/orderModel'
import { Product } from '../models/productModel'

export const orderRouter = express.Router()

orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty.' })
    } else {
      const createdOrder = await OrderModel.create({
        orderItems: req.body.orderItems.map((product: Product) => ({
          ...product,
          product: product._id,
        })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        subtotal: req.body.subtotal,
        shippingCost: req.body.shippingCost,
        tax: req.body.tax,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      } as Order)
      res.status(201).json({ message: 'Order Created', order: createdOrder })
    }
  })
)

orderRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      res.send(order)
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)

orderRouter.get(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ user: req.user._id })
    res.json(orders)
  })
)

orderRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id).populate('user')

    if (order) {
      order.isPaid = true
      order.paidOn = new Date(Date.now())
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }
      const updatedOrder = await order.save()

      res.send({ order: updatedOrder, message: 'Order Paid Successfully' })
    } else {
      res.status(404).send({ message: 'Order Not Found' })
    }
  })
)
