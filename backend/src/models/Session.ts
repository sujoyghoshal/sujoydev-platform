import { Schema, model, Document, Types } from 'mongoose';

export interface ISession extends Document {
  subjectId: Types.ObjectId;
  subjectType: 'User' | 'Admin';
  refreshTokenHash: string;
  family: string;
  userAgent?: string;
  ip?: string;
  revokedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    subjectId: { type: Schema.Types.ObjectId, required: true, refPath: 'subjectType' },
    subjectType: { type: String, enum: ['User', 'Admin'], required: true },
    refreshTokenHash: { type: String, required: true },
    family: { type: String, required: true },
    userAgent: { type: String },
    ip: { type: String },
    revokedAt: { type: Date },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

sessionSchema.index({ refreshTokenHash: 1 });
sessionSchema.index({ subjectId: 1, family: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = model<ISession>('Session', sessionSchema);
