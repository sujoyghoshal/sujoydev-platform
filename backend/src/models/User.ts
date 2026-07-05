import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  photoUrl?: string;
  phone?: string;
  provider: 'google' | 'guest';
  googleId?: string;
  role: 'user';
  fcmTokens: string[];
  isBanned: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    photoUrl: { type: String },
    phone: { type: String, trim: true },
    provider: { type: String, enum: ['google', 'guest'], required: true },
    googleId: { type: String },
    role: { type: String, enum: ['user'], default: 'user' },
    fcmTokens: { type: [String], default: [] },
    isBanned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ isDeleted: 1, createdAt: -1 });

export const User = model<IUser>('User', userSchema);
