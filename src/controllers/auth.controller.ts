import User from '@models/user.model'
import endpoint from '@utils/endpoint'
import { handleError, sendResponse } from '@utils/index'
import bcrypt from 'bcrypt'
import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const authController = express.Router()

const generateJwtToken = (user: { id: string }, expiresIn: string): string => {
  return jwt.sign(
    { user: { id: user.id } },
    process.env.JWT_SECRATE_KEY || '',
    { expiresIn }
  )
}

authController.post(
  endpoint.auth.signup,
  async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return sendResponse(res, 400, { message: 'Fields are missing!' })
      }

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return sendResponse(res, 409, { message: 'User already exists!' })
      }

      const encryptedPassword = await bcrypt.hash(password, 12)

      const user = new User({
        email,
        name,
        password: encryptedPassword
      })

      await user.save()
      return sendResponse(res, 200, { message: 'User created successfully.' })
    } catch (error) {
      return handleError(res, 500, `Error during user creation - ${error}`)
    }
  }
)

authController.post(
  endpoint.auth.signin,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return sendResponse(res, 400, { message: 'Fields are missing!' })
      }

      const user = await User.findOne({ email })
      if (!user) {
        return sendResponse(res, 401, { message: 'User not found!' })
      }

      const passwordMatched = await bcrypt.compare(password, user.password)
      if (!passwordMatched) {
        return sendResponse(res, 401, { message: 'Authentication failed!' })
      }

      const secretKey = process.env.JWT_SECRATE_KEY
      if (!secretKey) {
        throw new Error('JWT secret key not provided.')
      }

      const accessToken = generateJwtToken({ id: user.id }, '1h')
      const refreshToken = generateJwtToken({ id: user.id }, '1d')

      return sendResponse(res, 200, { accessToken, refreshToken })
    } catch (error) {
      return handleError(res, 500, `Error during authentication - ${error}`)
    }
  }
)

authController.post(endpoint.auth.refresh, (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return handleError(res, 401, 'Refresh token is required')
  }

  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET_KEY || '',
    (err: any, decoded: any) => {
      if (err) {
        return handleError(res, 401, 'Refresh token is not valid')
      }

      const accessToken = generateJwtToken({ id: decoded.user.id }, '1h')
      return sendResponse(res, 200, { accessToken })
    }
  )
})

export default authController
