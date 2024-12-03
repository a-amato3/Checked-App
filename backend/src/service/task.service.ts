import { CreateTaskDTO, UpdateTaskDTO } from "../types/task.types";
import { Task, ITaskDocument } from "../models/task.model";
import { AppError } from "../utils/errors";
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

interface WeatherResponse {
  current: {
    temp_c: number;
    condition: {
      text: string;
    };
  };
}

export class TaskService {
  private readonly WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  
  /**
   * Fetches weather information for a specified city using the WeatherAPI service.
   * Returns a formatted string with temperature and weather emoji, or null if the fetch fails.
   */
  private async getWeatherForCity(city: string): Promise<string | null> {
    try {
      const response = await axios.get<WeatherResponse>(
        `http://api.weatherapi.com/v1/current.json?key=${this.WEATHER_API_KEY}&q=${city}&aqi=no`
      );
      
      let weatherEmoji = '';
      const condition = response.data.current.condition.text.toLowerCase();
      
      if (condition.includes('sunny')) {
        weatherEmoji = '☀️ ';
      } else if (condition.includes('cloud')) {
        weatherEmoji = '☁️ ';
      }
      
      return `${weatherEmoji}${response.data.current.temp_c}°C`;
    } catch (error) {
      console.error(`Failed to fetch weather for ${city}:`, error);
      return null;
    }
  }

  /**
   * Analyses the task title for a city name and appends current weather information
   * to the task's notes if a valid city is found.
   */
  private async addWeatherInfoToTask(task: ITaskDocument): Promise<void> {
    const cityMatch = task.title.match(/(?:in|at)\s+([A-Z][a-z]+)/);
    if (cityMatch) {
      const city = cityMatch[1];
      const weatherInfo = await this.getWeatherForCity(city);
      if (weatherInfo && !task.notes.includes(weatherInfo)) {
        task.notes.push(weatherInfo);
      }
    }
  }

  /**
   * Creates a new task in the database with the provided data.
   * If the task title contains a city name, weather information will be added to the notes.
   */
  async createTask(taskData: CreateTaskDTO): Promise<ITaskDocument> {
    const task = await Task.create({
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : new Date()
    });
    
    await this.addWeatherInfoToTask(task);
    
    if (task.isModified()) {
      await task.save();
    }
        
    return task;
  }

  /**
   * Retrieves all tasks from the database.
   */
  async getAllTasks(): Promise<ITaskDocument[]> {
    const tasks = await Task.find();
    return tasks;
  }

  /**
   * Fetches a specific task by its unique identifier.
   */
  async getTaskById(taskId: string): Promise<ITaskDocument | null> {
    const task = await Task.findById(taskId);
    return task;
  }

  /**
   * Updates an existing task with new data and refreshes weather information
   * if the task contains a city name.
   */
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

    await this.addWeatherInfoToTask(task);
    if (task.isModified()) {
      await task.save();
    }

    return task;
  }

  /**
   * Removes a task from the database. Throws an error if the task doesn't exist.
   */
  async deleteTask(taskId: string): Promise<void> {
    const result = await Task.findByIdAndDelete(taskId);

    if (!result) {
      throw new AppError(404, "Task not found");
    }
  }

  /**
   * Toggles the completion status of a task between done and not done.
   */
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

  /**
   * Appends a new note to the task's existing notes array.
   */
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

  /**
   * Removes a note from the task's notes array at the specified index.
   * Throws an error if the index is invalid.
   */
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
