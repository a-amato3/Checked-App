import React, { useState } from 'react';
import { Task } from '../../types/task.types';
import { SortField, SortDirection, tagColors } from './types';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon, Bars3CenterLeftIcon, CalendarIcon, TagIcon } from "@heroicons/react/24/outline";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Snackbar } from '../../components/Snackbar';

interface TaskListsProps {
  activeTasks: Task[];
  completedTasks: Task[];
  isActiveTasksOpen: boolean;
  isCompletedTasksOpen: boolean;
  setIsActiveTasksOpen: (isOpen: boolean) => void;
  setIsCompletedTasksOpen: (isOpen: boolean) => void;
  handleToggleComplete: (taskId: string, isDone: boolean) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  handleSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
}

interface SnackbarState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error';
}

export const TaskLists: React.FC<TaskListsProps> = ({
  activeTasks,
  completedTasks,
  isActiveTasksOpen,
  isCompletedTasksOpen,
  setIsActiveTasksOpen,
  setIsCompletedTasksOpen,
  handleToggleComplete,
  handleDeleteTask,
  setCurrentTask,
  setIsModalOpen,
  handleSort,
  sortField,
  sortDirection,
}) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  // Renders the column headers with sorting functionality
  // Note: Click on 'Task name' to sort alphabetically
  const renderHeaders = () => (
    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
      <div className="col-span-1"></div>
      <div 
        className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-gray-900"
        onClick={() => handleSort('title')}
      >
        <Bars3CenterLeftIcon className="w-5 h-5 text-gray-500" />
        Task name
        {/* Display sorting arrows when 'title' field is selected */}
        {sortField === 'title' && (
          <span className="ml-1">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-gray-500" />
        Due date
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <TagIcon className="w-5 h-5 text-gray-500" />
        Tag
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <Bars3CenterLeftIcon className="w-5 h-5 text-gray-500" />
        Note
      </div>
      <div className="col-span-1">Actions</div>
    </div>
  );

  // Renders a list of tasks with drag-and-drop functionality
  // Parameters:
  //   tasks: Array of tasks to display
  //   droppableId: Unique identifier for the droppable area
  //   showActions: Whether to show edit/delete buttons (defaults to true)
  const renderTaskList = (tasks: Task[], droppableId: string, showActions: boolean = true) => (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-white rounded-lg shadow-lg mb-8 font-inter"
        >
          {renderHeaders()}
          {/* Display a message when no tasks are found */}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks found. Perhaps add one?
            </div>
          )}
          {/* Map through tasks and render each one */}
          {tasks.map((task: Task, index) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-gray-200 ${
                    snapshot.isDragging ? "bg-gray-50" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Checkbox for task completion */}
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={task.isDone}
                      onChange={() => handleToggleComplete(task._id, !task.isDone)}
                      className="rounded text-[#00C495] focus:ring-[#00C495]"
                    />
                  </div>
                  <div className="col-span-4">{task.title}</div>
                  <div className="col-span-2">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                  </div>
                  {/* Tag with colour coding */}
                  <div className="col-span-2">
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: task.description
                          ? tagColors[task.description.replace(/\s/g, "")]
                          : "#DDDDDD",
                      }}
                    >
                      {task.description || "No tag"}
                    </span>
                  </div>
                  <div className="col-span-2">{task.notes.join(", ")}</div>
                  {/* Action buttons (edit/delete) */}
                  {showActions && (
                    <div className="col-span-1 flex gap-2">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          setCurrentTask(task);
                          setIsModalOpen(true);
                        }}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <>
      {/* Active Tasks Section */}
      <div className="flex justify-start">
        <h2 className="px-4 py-2 text-lg font-semibold text-gray-700">
          Tasks to do
        </h2>
        <button
          onClick={() => setIsActiveTasksOpen(!isActiveTasksOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isActiveTasksOpen ? (
            <ChevronDownIcon className="w-5 h-5" />
          ) : (
            <ChevronUpIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {isActiveTasksOpen && renderTaskList(activeTasks, "todo", true)}

      {/* Completed Tasks Section */}
      <div className="flex justify-start">
        <h2 className="px-4 py-2 text-lg font-semibold text-gray-700">
          Tasks done
        </h2>
        <button
          onClick={() => setIsCompletedTasksOpen(!isCompletedTasksOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isCompletedTasksOpen ? (
            <ChevronDownIcon className="w-5 h-5" />
          ) : (
            <ChevronUpIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {isCompletedTasksOpen && renderTaskList(completedTasks, "done", false)}

      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default TaskLists;