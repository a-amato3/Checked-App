import axios from 'axios';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const TaskAPI = {
  async getAllTasks(): Promise<Task[]> {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data.data;
  },

  async createTask(task: CreateTaskDTO): Promise<Task> {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data.data;
  },

  async updateTask(id: string, task: UpdateTaskDTO): Promise<Task> {
    const response = await axios.put(`${API_URL}/tasks/${id}`, task);
    return response.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await axios.delete(`${API_URL}/tasks/${id}`);
  },

  async toggleTaskStatus(id: string): Promise<Task> {
    const response = await axios.patch(`${API_URL}/tasks/${id}/toggle`);
    return response.data.data;
  },

  async addNote(id: string, note: string): Promise<Task> {
    const response = await axios.post(`${API_URL}/tasks/${id}/notes`, { note });
    return response.data.data;
  },

  async removeNote(id: string, noteIndex: number): Promise<Task> {
    const response = await axios.delete(`${API_URL}/tasks/${id}/notes/${noteIndex}`);
    return response.data.data;
  }
};