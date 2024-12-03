import axios from 'axios';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
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