import mongoose from 'mongoose'

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI || '', {
      dbName: 'Ecommerce_24',
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e))
}
