import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Task } from '../types/task.types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  existingTask?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, existingTask }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [tag, setTag] = useState('low');
  const [note, setNote] = useState('');

  // Reset form function
  const resetForm = () => {
    setTitle('');
    setDueDate(new Date());
    setTag('low');
    setNote('');
  };

  // Handle close with reset
  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDueDate(existingTask.createdAt ? new Date(existingTask.createdAt) : new Date());
      setTag(existingTask.description!);
      setNote(existingTask.notes[0] || '');
    } else {
      resetForm();
    }
  }, [existingTask, isOpen]); // Added isOpen dependency

  // Update form submission to use handleClose
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title,
      isDone: false,
      description: tag,
      notes: note ? [note] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: dueDate ? dueDate : new Date()
    };
    onSubmit(taskData);
    handleClose();
  };

  // Add check for visibility
  if (!isOpen) return null;

  // Update close button to use handleClose
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">{existingTask ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00C495]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              dateFormat="MMMM d, yyyy"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00C495]"
              minDate={new Date()}
              placeholderText="Select a due date"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00C495]"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
              <option value="Not urgent">Not urgent</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00C495]"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#00C495] text-white rounded hover:bg-[#00B485]"
            >
              {existingTask ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal; 