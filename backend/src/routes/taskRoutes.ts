import express from "express";
import { TaskController } from "src/controllers/task.controller";

const router = express.Router();
const taskController = new TaskController();

// Task CRUD operations
router.post("/tasks", taskController.createTask);
router.get("/tasks", taskController.getTasks);
router.get("/tasks/:id", taskController.getTask);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);

// Task completion toggle
router.patch("/tasks/:id/toggle", taskController.toggleTaskStatus);

// Task notes operations
router.post("/tasks/:id/notes", taskController.addNote);
router.delete("/tasks/:id/notes/:noteIndex", taskController.removeNote);

export default router;
