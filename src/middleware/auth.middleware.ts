import { handleError } from '@utils/index'
import { config } from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

config()

interface DecodedUser {
  user: any
}

const verifyJwtToken = (token: string): DecodedUser | null => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRATE_KEY as string
    ) as unknown as DecodedUser
    return decoded.user
  } catch (err) {
    return null
  }
}

const requireAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = req.headers

  if (!authorization) {
    handleError(res, 401, 'Authentication is required!')
    return
  }

  const token = authorization.replace('Bearer ', '')

  const userVerified = await verifyJwtToken(token)
  if (!userVerified) {
    handleError(res, 401, 'Token is not valid!')
    return
  }
  req.body.user = userVerified
  next()
}

export { requireAuthentication }
