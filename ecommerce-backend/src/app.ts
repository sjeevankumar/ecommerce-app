import { config } from 'dotenv'
import express from 'express'
import { connectDB } from './utils/features.js'
import { errorMiddleware } from './middlewares/error.js'
import NodeCache from 'node-cache'
import morgan from 'morgan'

// importing routes
import userRoute from './routes/user.js'
import productRoute from './routes/product.js'
import orderRoute from './routes/order.js'

config()
const port = process.env.PORT || 4000
const mongoURI = process.env.MONGO_URI || ''

export const myCache = new NodeCache()

const app = express()

//middlewares
app.use(express.json())
app.use(morgan("dev"))

connectDB(mongoURI)

// using routes
app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/order', orderRoute)

app.use('/uploads', express.static('uploads'))
app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`)
})
