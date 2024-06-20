import { NextFunction, Request, Response } from 'express'
import { User } from '../models/user.js'
import { NewUserRequestBody } from '../types/types.js'

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, dob, email, gender, name, photo } = req.body

    const user = await User.create({
      _id,
      name,
      email,
      gender,
      photo,
      dob:new Date(dob),
    })

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    })
  }
}
