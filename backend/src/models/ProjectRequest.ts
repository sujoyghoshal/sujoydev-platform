import { Schema, model, Document, Types } from 'mongoose';

export type RequestStatus =
  | 'Pending'
  | 'In Review'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Rejected';

export interface IProjectRequest extends Document {
  ticket: string;
  userId?: Types.ObjectId;
  name: string;
  company?: string;
  email: string;
  phone: string;
  budget: string;
  timeline: string;
  projectType: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  description: string;
  attachments: string[];
  status: RequestStatus;
  adminNotes?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectRequestSchema = new Schema<IProjectRequest>(
  {
    ticket: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    company: { type: String, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    budget: { type: String, required: true, trim: true, maxlength: 100 },
    timeline: { type: String, required: true, trim: true, maxlength: 100 },
    projectType: {
      type: String,
      required: true,
      enum: ['Website', 'Android App', 'Backend / API', 'Full Stack', 'Bug Fixing', 'Other'],
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    attachments: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Accepted', 'In Progress', 'Completed', 'Rejected'],
      default: 'Pending',
    },
    adminNotes: { type: String, maxlength: 2000 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

projectRequestSchema.index({ status: 1, createdAt: -1 });
projectRequestSchema.index({ email: 1, createdAt: -1 });

export const ProjectRequest = model<IProjectRequest>('ProjectRequest', projectRequestSchema);
