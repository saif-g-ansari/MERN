import mongoose, { Document, Schema, Types } from 'mongoose'

interface IPost extends Document {
  title: string
  body: string
  photo?: string
  postedBy: Types.ObjectId
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

const PostModel = mongoose.model<IPost>('Post', postSchema)

export default PostModel
