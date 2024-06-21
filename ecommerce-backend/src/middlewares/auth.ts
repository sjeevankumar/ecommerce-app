import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// middleware to make sure only admin is allowed
export const adminOnly = TryCatch(
    async(req,res,next)=>{
        // get id from query
        const {id} = req.query
        if(!id) return next(new ErrorHandler("please login",401))

        // check user exist
        const user = await User.findById(id)
        if(!user) return next(new ErrorHandler("Invalid Id",400))

        // if exist, check he is an admin
        if(user.role !== "admin") return next(new ErrorHandler("permission denied",403))

        next()
    }
)