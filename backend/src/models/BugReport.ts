import { Schema, model, Document, Types } from 'mongoose';

export interface IBugReport extends Document {
  ticket: string;
  userId?: Types.ObjectId;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  deviceInfo?: string;
  osVersion?: string;
  appVersion?: string;
  screenshots: string[];
  logs?: string;
  status: 'Open' | 'In Progress' | 'Fixed' | 'Closed';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bugReportSchema = new Schema<IBugReport>(
  {
    ticket: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    deviceInfo: { type: String, maxlength: 200 },
    osVersion: { type: String, maxlength: 50 },
    appVersion: { type: String, maxlength: 50 },
    screenshots: { type: [String], default: [] },
    logs: { type: String, maxlength: 20000 },
    status: { type: String, enum: ['Open', 'In Progress', 'Fixed', 'Closed'], default: 'Open' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

bugReportSchema.index({ status: 1, priority: 1, createdAt: -1 });

export const BugReport = model<IBugReport>('BugReport', bugReportSchema);
