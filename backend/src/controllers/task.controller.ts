import { Request, Response, NextFunction } from "express";
import { TaskService } from "../service/task.service";
import { AppError } from "../utils/errors";
import { CreateTaskDTO, UpdateTaskDTO } from "../types/task.types";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  // Create Task
  createTask = async (
    req: Request<{}, {}, CreateTaskDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const task = await this.taskService.createTask(req.body);
      res.status(201).json({
        status: "success",
        data: task,
      });
    } catch (error: any) {
      next(new AppError(400, "Failed to create task", error));
    }
  };

  // Get all tasks
  getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json({ status: "success", data: tasks });
    } catch (error: any) {
      next(new AppError(400, "Failed to get tasks", error));
    }
  };

  // Get a single task by ID
  getTask = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      if (!task) throw new AppError(404, "Task not found");
      res.json({ status: "success", data: task });
    } catch (error: any) {
      next(new AppError(404, "Failed to get task", error));
    }
  };

  // Update an existing task
  updateTask = async (
    req: Request<{ id: string }, {}, UpdateTaskDTO>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const task = await this.taskService.updateTask(req.params.id, req.body);
      res.json({
        status: "success",
        data: task,
      });
    } catch (error: any) {
      next(new AppError(400, "Failed to update task", error));
    }
  };

  // Delete Task
  deleteTask = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.taskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      next(new AppError(400, "Failed to delete task", error));
    }
  };

  // Toggle task completion status
  toggleTaskStatus = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const task = await this.taskService.toggleTaskStatus(req.params.id);
      res.json({
        status: "success",
        data: task,
      });
    } catch (error: any) {
      next(new AppError(400, "Failed to toggle task status", error));
    }
  };

  // Add a note to a task
  addNote = async (
    req: Request<{ id: string }, {}, { note: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { note } = req.body;

      if (!note) throw new AppError(400, "Note content is required");

      const updatedTask = await this.taskService.addNoteToTask(id, note);
      res.json({
        status: "success",
        data: updatedTask,
      });
    } catch (error: any) {
      next(new AppError(400, "Failed to add note", error));
    }
  };

  // Remove a note from a task by index
  removeNote = async (
    req: Request<{ id: string; noteIndex: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, noteIndex } = req.params;
      const index = parseInt(noteIndex, 10);

      if (isNaN(index))
        throw new AppError(400, "Note index must be a valid number");

      const updatedTask = await this.taskService.removeNoteFromTask(id, index);
      res.json({
        status: "success",
        data: updatedTask,
      });
    } catch (error: any) {
      next(new AppError(400, "Failed to remove note", error));
    }
  };
}
