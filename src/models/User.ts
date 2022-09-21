import mongoose, { Schema, model } from 'mongoose';
// import { IUser } from '../interfaces/user';

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    currentChallenge: { type: String, required: true },
    devices: [{ type: String }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || model('User', userSchema);

export default User;
