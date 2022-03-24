import mongoose, { Document } from 'mongoose';

export interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  username: string;
  password: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  is_verified?: boolean;
}


export interface UserDoc extends Document {
  firstName?: string;
  lastName?: string;
  email: string;
  username: string;
  password: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  is_verified?: boolean;
}

export const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  is_active: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  is_verified: {
    type: Boolean,
    default: false
  }
})

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
}

const User = mongoose.model<UserDoc>('User', userSchema);

export { User }