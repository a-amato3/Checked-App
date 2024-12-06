import { TaskService } from '../task.service';
import { Task } from '../../models/task.model';
import axios from 'axios';
import {describe, expect, beforeEach, it, jest} from '@jest/globals';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TaskService - Weather Integration', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  it('should add weather info to task when city is mentioned', async () => {
    // Add Task.create mock
    const mockTask: any = {
      _id: '123',
      title: 'Check weather in Paris',
      notes: ['Meeting in Paris'],
      isDone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: jest.fn(),
      isModified: jest.fn().mockReturnValue(false)
    };
    jest.spyOn(Task, 'create').mockResolvedValueOnce(mockTask);

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        current: {
          temp_c: 20,
          condition: { text: 'Sunny' }
        }
      }
    });

    const result = await taskService.createTask({
      title: 'Check weather in Paris',
      notes: ['Meeting in Paris']
    });

    expect(result.notes).toContain('☀️ 20°C');
  });

  it('should not add weather info when no city is mentioned', async () => {
    // Mock the Task.create method
    const mockTask:any = {
      _id: '123',
      title: 'Regular task',
      description: 'No city mentioned',
      notes: [],
      isDone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: jest.fn(),
      isModified: jest.fn().mockReturnValue(false)
    };

    jest.spyOn(Task, 'create').mockResolvedValueOnce(mockTask);

    // Create a task without a city in the title
    await taskService.createTask({
      title: 'Regular task',
      description: 'No city mentioned'
    });

    // Verify the weather API was not called
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(mockTask.save).not.toHaveBeenCalled();
  });

  it('should handle weather API errors gracefully', async () => {
    // Mock the weather API to throw an error
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    // Mock the Task.create method
    const mockTask: any = {
      _id: '123',
      title: 'Meeting in Paris',
      description: 'Business meeting',
      notes: [],
      isDone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: jest.fn(),
      isModified: jest.fn().mockReturnValue(false)
    };

    jest.spyOn(Task, 'create').mockResolvedValueOnce(mockTask);

    // Create a task with a city in the title
    const result = await taskService.createTask({
      title: 'Meeting in Paris',
      description: 'Business meeting'
    });

    // Verify task was created despite weather API error
    expect(result).toBeDefined();
  });

  it('should add London weather info with correct temperature', async () => {
    // Add Task.create mock
    const mockTask: any = {
      _id: '123',
      title: 'Meeting in London',
      notes: ['Check London weather'],
      isDone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: jest.fn(),
      isModified: jest.fn().mockReturnValue(false)
    };
    jest.spyOn(Task, 'create').mockResolvedValueOnce(mockTask);

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        current: {
          temp_c: 8.1,
          condition: { text: 'Partly cloudy' }
        }
      }
    });

    const result = await taskService.createTask({
      title: 'Meeting in London',
      notes: ['Check London weather']
    });

    expect(result.notes).toContain('☁️ 8.1°C');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('London')
    );
  });
}); 