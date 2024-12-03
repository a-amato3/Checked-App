import { Schema, model, Document } from 'mongoose';

export interface ITaskDocument extends Document {
  title: string;
  description: string;
  isDone: boolean;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  notes: string[]; // Added this array to store notes
}

const TaskSchema = new Schema<ITaskDocument>({
  title: { type: String, required: true },
  description: { type: String },
  isDone: { type: Boolean, default: false },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: [{ type: String }], // Array of notes
});

export const Task = model<ITaskDocument>('Task', TaskSchema);
