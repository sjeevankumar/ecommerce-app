import { Request, NextFunction, Response } from 'express'

export interface NewUserRequestBody {
  _id: string
  name: string
  email: string
  photo: string
  gender: 'male' | 'female'
  dob: Date
}

export interface NewProductRequestBody {
  name: string
  category: string
  price: number
  stock: number
}

export type ControllerType = (
  req: Request<any>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>

export type SearchRequestQuery = {
  search?: string
  price?: string
  category?: string
  sort?: string
  page?: string
}

export interface BaseQuery {
  name?: {
    $regex: string
    $options: string
  }
  price?: {
    $lte: number
  }
  category?: string
}
