import { Schema, model, Document } from 'mongoose';

/** Atomic monthly sequences used for ticket numbers (PRQ-YYYYMM-XXXX). */
interface ICounter extends Document {
  key: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  key: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = model<ICounter>('Counter', counterSchema);

export async function nextTicket(prefix: 'PRQ' | 'BUG'): Promise<string> {
  const now = new Date();
  const yyyymm = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const counter = await Counter.findOneAndUpdate(
    { key: `${prefix}-${yyyymm}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return `${prefix}-${yyyymm}-${String(counter.seq).padStart(4, '0')}`;
}
