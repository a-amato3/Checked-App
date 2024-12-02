import React, { useState } from 'react';
import { TaskAPI } from '../services/api.service';
import { useAsync } from '../hooks/useAsync';

interface TaskFormProps {
  onTaskCreated: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { loading, error, execute } = useAsync();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await execute(() => 
        TaskAPI.createTask({
          title: title.trim(),
          description: description.trim(),
          isDone: false,
          notes: [],
        })
      );
      setTitle('');
      setDescription('');
      onTaskCreated();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          disabled={loading}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          disabled={loading}
          className="form-input"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading || !title.trim()} 
        className="btn btn-primary"
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
}; 