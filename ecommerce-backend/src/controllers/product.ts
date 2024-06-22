import { Request } from 'express'
import { TryCatch } from '../middlewares/error.js'
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from '../types/types.js'
import { Product } from '../models/product.js'
import ErrorHandler from '../utils/utility-class.js'
import { rm } from 'fs'
// import { faker } from '@faker-js/faker'

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, category, stock } = req.body
    const photo = req.file

    if (!photo) return next(new ErrorHandler('Please add Photo', 400))

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => console.log('deleted'))
      return next(new ErrorHandler('Please enter all fields', 400))
    }

    await Product.create({
      name,
      price,
      category: category.toLowerCase(),
      stock,
      photo: photo?.path,
    })

    return res.status(201).json({
      success: true,
      message: 'Product Created Successfully',
    })
  }
)

export const getlatestProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(5)

  return res.status(200).json({
    success: true,
    products,
  })
})

export const getAllCategories = TryCatch(async (req, res, next) => {
  const categories = await Product.distinct('category')

  return res.status(200).json({
    success: true,
    categories,
  })
})

export const getAdminProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find({})

  return res.status(200).json({
    success: true,
    products,
  })
})

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params
  const product = await Product.findById(id)

  return res.status(200).json({
    success: true,
    product,
  })
})

export const updateProduct = TryCatch(async (req, res, next) => {
  debugger
  const { id } = req.params

  const { name, price, category, stock } = req.body
  const photo = req.file
  console.log(name, price, category, stock)

  // check product exist
  let product = await Product.findById(id)
  if (!product) return next(new ErrorHandler('Product Not Found', 404))

  //update photo
  if (photo) {
    rm(product.photo, () => console.log('Old Photo Deleted'))
    product.photo = photo.path
  }

  // update remaining
  if (name) product.name = name
  if (price) product.price = price
  if (stock) product.stock = stock
  if (category) product.category = category
  console.log('before', product)

  //sace the updated product
  product = await product.save()

  console.log(product)

  return res.status(200).json({
    success: true,
    message: 'Product Updated Successfully',
    product,
  })
})

export const deleteProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params

  // check product exist
  const product = await Product.findById(id)
  if (!product) return next(new ErrorHandler('Product Not Found', 404))

  // delete photo file in server before deleting product
  rm(product.photo, () => console.log('Product Photo Deleted'))

  await product.deleteOne()

  return res.status(204).json({
    success: true,
    message: 'Product Deleted Successfully',
  })
})

export const searchAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query

    const page = Number(req.query.page) || 1

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8
    const skip = (page - 1) * limit

    const baseQuery: BaseQuery = {}
    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: 'i',
      }
    }
    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      }
    }
    if (category) baseQuery.category = category

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)

    const [filterProducts, totalSearchProducts] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ])

    const totalPage = Math.ceil(totalSearchProducts.length / limit)

    return res.status(200).json({
      success: true,
      filterProducts,
      totalPage,
    })
  }
)
// const generateRandomProducts = async (count: number = 10) => {
//   const products = []

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: 'uploads\\88135fb4-3cd3-4377-a2cf-78477638592c.jpg',
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     }

//     products.push(product)
//   }

//   await Product.create(products)

//   console.log({ succecss: true })
// }

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2)

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i]
//     await product.deleteOne()
//   }

//   console.log({ succecss: true })
// }