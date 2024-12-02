import { CreateTaskDTO, UpdateTaskDTO } from "../types/task.types";
import { Task, ITaskDocument } from "../models/task.model";
import { AppError } from "../utils/errors";

export class TaskService {
  async createTask(taskData: CreateTaskDTO): Promise<ITaskDocument> {
    const task = await Task.create({
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return task;
  }

  async getAllTasks(): Promise<ITaskDocument[]> {
    const tasks = await Task.find();
    return tasks;
  }

  async getTaskById(taskId: string): Promise<ITaskDocument | null> {
    const task = await Task.findById(taskId);
    return task;
  }

  async updateTask(
    taskId: string,
    updateData: UpdateTaskDTO
  ): Promise<ITaskDocument> {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    return task;
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await Task.findByIdAndDelete(taskId);

    if (!result) {
      throw new AppError(404, "Task not found");
    }
  }

  async toggleTaskStatus(taskId: string): Promise<ITaskDocument> {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    task.isDone = !task.isDone;
    task.updatedAt = new Date();
    await task.save();

    return task;
  }

  async addNoteToTask(taskId: string, note: string): Promise<ITaskDocument> {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    // Add the note to the task's notes array
    task.notes.push(note);
    task.updatedAt = new Date();

    await task.save();

    return task;
  }

  async removeNoteFromTask(taskId: string, noteIndex: number): Promise<ITaskDocument> {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    if (noteIndex < 0 || noteIndex >= task.notes.length) {
      throw new Error('Note index out of bounds');
    }

    task.notes.splice(noteIndex, 1);
    task.updatedAt = new Date();

    await task.save();

    return task;
  }
  
}
