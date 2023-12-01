import { requireAuthentication } from '@middleware/auth.middleware'
import Post from '@models/post.model'
import endpoint from '@utils/endpoint'
import { handleError, sendResponse } from '@utils/index'
import express, { Request, Response } from 'express'

const postController = express.Router()

postController.post(
  endpoint.post.create,
  requireAuthentication,
  async (req: Request, res: Response) => {
    const { title, body, photo } = req.body

    if (!title || !body) {
      return sendResponse(res, 400, { error: 'Required fields are missing!' })
    }

    try {
      const result = await new Post({
        title,
        body,
        photo,
        postedBy: req.body.user?.id
      }).save()

      return sendResponse(res, 200, {
        message: 'Post created successfully...',
        data: result
      })
    } catch (err) {
      return handleError(res, 500, `Error during creation of post - ${err}`)
    }
  }
)

postController.get(
  endpoint.post.list,
  requireAuthentication,
  async (req: Request, res: Response) => {
    try {
      const result = await Post.find()
      return sendResponse(res, 200, { post: result })
    } catch (err) {
      return handleError(res, 500, 'Internal server error!')
    }
  }
)

export default postController
