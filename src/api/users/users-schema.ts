import mongoose, { Schema } from 'mongoose';

export interface User {
  name: string;
  email: string;
  password: string;
  profileURL: string;
  friends: User[];
  enemies: User[];
}

const userSchema = new Schema<User>({
  name: String,
  email: String,
  password: String,
  profileURL: String,
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  enemies: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export const UserModel = mongoose.model<User>('User', userSchema, 'users');
