import mongoose from 'mongoose'
import { InvalidateCacheProps } from '../types/types.js'
import { Product } from '../models/product.js'
import { myCache } from '../app.js'

export const connectDB = (uri:string) => {
  mongoose
    .connect(uri, {
      dbName: 'Ecommerce_24',
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e))
}

export const invalidateCahce = async ({
  product,
  order,
  admin,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      'latest-products',
      'categories',
      'all-products',
    ]
    const products = await Product.find({}).select('_id')
    products.forEach((product) => {
      const { _id: id } = product
      productKeys.push(`product-${id}`)
    })
    myCache.del(productKeys)
  }
  if (order) {
  }
  if (admin) {
  }
}
