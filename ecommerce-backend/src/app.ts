import { config } from 'dotenv'
config()
import express from 'express'
import { connectDB } from './utils/features.js'
import { errorMiddleware } from './middlewares/error.js'
import NodeCache from 'node-cache'

// importing routes
import userRoute from './routes/user.js'
import productRoute from './routes/product.js'


const port = 4000

export const myCache = new NodeCache()

const app = express()

//middlewares
app.use(express.json())

connectDB()

// using routes
app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)

app.use("/uploads",express.static("uploads"))
app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`)
})
