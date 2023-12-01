import appControllers from '@controllers/index'
import { handleNotFound } from '@utils/index'
import { config } from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

config()

const app = express()
const PORT: number | string = process.env.PORT || 3001

app.use(express.json())

const allControllers: [string, express.Router][] =
  Object.entries(appControllers)

allControllers.forEach(([moduleName, controller]) => {
  const route = `/api/${moduleName.toLowerCase().replace('controller', '')}`
  app.use(route, controller)
})

app.use((req, res) => {
  handleNotFound(res)
})

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('Database connected successfully...')

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`)
    })
  } catch (error) {
    console.error('Error connecting to the database:', (error as Error).message)
  }
}

startServer()
