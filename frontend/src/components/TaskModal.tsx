import React, { useState } from 'react';
import DatePicker from 'react-date-picker';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [tag, setTag] = useState('low');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = {
      title,
      isDone: false,
      description: tag,
      notes: note ? [note] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate
    };
    onSubmit(newTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
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
            {/* <DatePicker
              selected={dueDate}
              onChange={(date: Date) => setDueDate(date)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00C495]"
            /> */}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#00C495]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#00C495] text-white rounded hover:bg-[#00B485]"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal; 