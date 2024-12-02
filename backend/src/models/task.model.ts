import { Schema, model, Document } from 'mongoose';

export interface ITaskDocument extends Document {
  title: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes: string[]; // Add this field to store notes
}

const TaskSchema = new Schema<ITaskDocument>({
  title: { type: String, required: true },
  description: { type: String },
  isDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: [{ type: String }], // Array of notes
});

export const Task = model<ITaskDocument>('Task', TaskSchema);
