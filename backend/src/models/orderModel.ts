import {
  modelOptions,
  prop,
  getModelForClass,
  Ref,
  Severity,
} from '@typegoose/typegoose'
import { Product } from './productModel'
import { User } from './userModel'
import { StringLengthExpectedError } from '@typegoose/typegoose/lib/internal/errors'

class ShippingAddress {
  @prop()
  public fullName?: string

  @prop()
  public address?: string

  @prop()
  public city?: string

  @prop()
  public province?: string

  @prop()
  public country?: string

  @prop()
  public postalCode?: string

  @prop()
  public long?: number

  @prop()
  public lat?: number
}

class Item {
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public quantity!: number

  @prop({ required: true })
  public image!: string

  @prop({ required: true })
  public price!: number

  @prop({ required: true })
  public product!: Ref<Product>
}

class PaymentResult {
  @prop()
  public paymentId!: string

  @prop()
  public status!: string

  @prop()
  public update_time!: string

  @prop()
  public email_address!: StringLengthExpectedError
}

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class Order {
  public _id!: string

  @prop()
  public orderItems!: Item[]

  @prop()
  public shippingAddress?: ShippingAddress

  @prop({ ref: User })
  public user?: Ref<User>

  @prop({ required: true })
  public paymentMethod!: string

  @prop()
  public paymentResult?: PaymentResult

  @prop({ required: true, default: 0 })
  public subtotal!: number

  @prop({ required: true, default: 0 })
  public shippingCost!: number

  @prop({ required: true, default: 0 })
  public tax!: number

  @prop({ required: true, default: 0 })
  public totalPrice!: number

  @prop({ required: true, default: false })
  public isPaid!: boolean

  @prop()
  public paidOn!: Date

  @prop({ required: true, default: false })
  public isDelivered!: boolean

  @prop()
  public deliveredOn!: Date
}

export const OrderModel = getModelForClass(Order)
