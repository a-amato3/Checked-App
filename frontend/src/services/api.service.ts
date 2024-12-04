import axios from 'axios';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task.types';

// Configure API endpoint based on environment
// - In production: Uses REACT_APP_PROD_API_URL from environment variables (set in Render dashboard)
// - In development: Uses localhost:3001 for local development
const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_PROD_API_URL // Production URL from environment variable
  : 'http://localhost:3001/api';       // Default development URL

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enables sending cookies in cross-origin requests
});

export const TaskAPI = {
  async getAllTasks(): Promise<Task[]> {
    const response = await axiosInstance.get('/tasks');
    return response.data.data;
  },

  async createTask(task: CreateTaskDTO): Promise<Task> {
    const response = await axiosInstance.post('/tasks', task);  
    return response.data.data;
  },

  async updateTask(id: string, task: UpdateTaskDTO): Promise<Task> {
    const response = await axiosInstance.put(`/tasks/${id}`, task);
    return response.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await axiosInstance.delete(`/tasks/${id}`);
  },

  async toggleTaskStatus(id: string): Promise<Task> {
    const response = await axiosInstance.patch(`/tasks/${id}/toggle`);
    return response.data.data;
  },

  async addNote(id: string, note: string): Promise<Task> {
    const response = await axiosInstance.post(`/tasks/${id}/notes`, { note });
    return response.data.data;
  },

  async removeNote(id: string, noteIndex: number): Promise<Task> {
    const response = await axiosInstance.delete(`/tasks/${id}/notes/${noteIndex}`);
    return response.data.data;
  },
};