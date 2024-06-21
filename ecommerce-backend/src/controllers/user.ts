import { NextFunction, Request, Response } from 'express'
import { User } from '../models/user.js'
import { NewUserRequestBody } from '../types/types.js'
import ErrorHandler from '../utils/utility-class.js'
import { TryCatch } from '../middlewares/error.js'

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, dob, email, gender, name, photo } = req.body

    // check user exist
    let user = await User.findById(_id)
    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
      })
    }

    // check all fields exist
    if (!_id || !name || !email || !photo || !gender || !dob) {
      return next(new ErrorHandler('Please add all fields', 400))
    }

    user = await User.create({
      _id,
      name,
      email,
      gender,
      photo,
      dob: new Date(dob),
    })

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    })
  }
)

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({})

  return res.status(200).json({
    success: true,
    users,
  })
})

export const getUser = TryCatch(async (req, res, next) => {
  const { id } = req.params

  //check user exist
  const user = await User.findById(id)
  console.log(user)
  if (!user) return next(new ErrorHandler('Invalid Id', 400))

  return res.status(200).json({
    success: true,
    user,
  })
})

export const deleteUser = TryCatch(
  async(req,res,next)=>{
    // get id from the params
    const {id}= req.params

    // check user exist
    const user = await User.findById(id)
    if(!user) return next(new ErrorHandler("Invalid Id",400))

    // if exist delete user
    await user.deleteOne()

    // return response
    return res.status(204).json({
      success:true,
      message:"user deleted successfully"
    })
  }
)
