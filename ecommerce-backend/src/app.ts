import {config} from "dotenv"
config()
import express from 'express'


// importing routes
import userRoute from "./routes/user.js"
import { connectDB } from './utils/features.js'

const port = 4000

const app = express()

//middlewares
app.use(express.json())

connectDB()


// using routes
app.use("/api/v1/user",userRoute)



app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`)
    
})