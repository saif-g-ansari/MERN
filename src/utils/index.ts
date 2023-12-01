import { Response } from 'express'

const sendResponse = (
  res: Response,
  statusCode: number,
  content: unknown
): Response => {
  return res.status(statusCode).json(content)
}

const handleError = (
  res: Response,
  statusCode: number,
  errorMessage: string
) => {
  return sendResponse(res, statusCode, { error: errorMessage })
}

const handleNotFound = (res: Response): void => {
  handleError(res, 404, 'The requested resource does not exist.')
}

export { handleError, handleNotFound, sendResponse }
