import React, { useEffect } from 'react';
import { Task } from '../types/task.types';
import { TaskAPI } from '../services/api.service';
import { useAsync } from '../hooks/useAsync';
import { Loading } from './Loading';
import { ErrorBoundary } from './ErrorBoundary';

const TaskListContent: React.FC = () => {
  const { data: tasks, loading, error, execute } = useAsync<Task[]>();

  useEffect(() => {
    execute(() => TaskAPI.getAllTasks());
  }, [execute]);

  const handleToggleStatus = async (taskId: string) => {
    try {
      const updatedTask = await TaskAPI.toggleTaskStatus(taskId);
      // Re-fetch tasks to ensure we are using the latest state
      execute(() => TaskAPI.getAllTasks());
    } catch (err) {
      console.error('Failed to toggle task status:', err);
    }
  };

  if (loading) return <Loading message="Loading tasks..." />;
  if (error) throw new Error(error);
  if (!tasks) return null;

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task._id} className="task-item">
          <input
            type="checkbox"
            checked={task.isDone}
            onChange={() => handleToggleStatus(task._id)}
          />
          <span className={task.isDone ? 'completed' : ''}>
            {task.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export const TaskList: React.FC = () => (
  <ErrorBoundary>
    <TaskListContent />
  </ErrorBoundary>
);