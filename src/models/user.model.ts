import mongoose, { Document, Schema } from 'mongoose'

interface IUser extends Document {
  name: string
  email: string
  password: string
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const UserModel = mongoose.model<IUser>('User', userSchema)

export default UserModel
