import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  actorId: Types.ObjectId;
  actorType: 'Admin' | 'User';
  action: string;
  targetType?: string;
  targetId?: string;
  diff?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, required: true },
    actorType: { type: String, enum: ['Admin', 'User'], required: true },
    action: { type: String, required: true },
    targetType: { type: String },
    targetId: { type: String },
    diff: { type: Schema.Types.Mixed },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ actorId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
