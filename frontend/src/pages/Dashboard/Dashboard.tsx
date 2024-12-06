import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { DragDropContext, DropResult} from "react-beautiful-dnd";
import { TaskAPI } from "../../services/api.service";
import { Task } from "../../types/task.types";
import TaskModal from "../../components/TaskModal";
import { Loading } from "../../components/Loading";
import { SortDirection, SortField } from "./types";
import { TaskLists } from './TaskLists';
import { Snackbar } from '../../components/Snackbar';

// Interface for managing Snackbar notifications state
interface SnackbarState {
  isOpen: boolean;
  message: string;
  type: 'success' | 'error';
}

const Dashboard: React.FC = (): JSX.Element => {
  // Navigation and Authentication
  const navigate = useNavigate();
  const auth = getAuth();

  // Core State Management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
  // UI State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveTasksOpen, setIsActiveTasksOpen] = useState(true);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Sorting State
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Notification State
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  // Authentication handler for user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await TaskAPI.getAllTasks();
        // Artificial delay for better UX
        setTimeout(() => {
          setTasks(fetchedTasks);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // CRUD Operations with error handling and notifications
  const handleAddTask = async (taskData: Omit<Task, "_id">) => {
    try {
      const createdTask = await TaskAPI.createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error details:", error.response?.data);
      alert("Failed to create task. Please check console for details.");
    }
  };

  // Updates existing task and refreshes the task list
  const handleEditTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      const updated = await TaskAPI.updateTask(taskId, updatedTask);
      setTasks((prev) =>
        prev.map((task: Task) => (task._id === taskId ? updated : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Deletes task and shows success/error notification
  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((task: Task) => task._id !== taskId));
      setSnackbar({
        isOpen: true,
        message: 'Task deleted successfully',
        type: 'success'
      });
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: 'Failed to delete task',
        type: 'error'
      });
    }
  };

  // Toggles task completion status with notification feedback
  const handleToggleComplete = async (taskId: string, isDone: boolean) => {
    try {
      const updated = await TaskAPI.toggleTaskStatus(taskId);
      setTasks(prev => prev.map(task => task._id === taskId ? updated : task));
      setSnackbar({
        isOpen: true,
        message: `Task ${isDone ? 'completed' : 'uncompleted'} successfully`,
        type: 'success'
      });
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: 'Failed to update task status',
        type: 'error'
      });
    }
  };

  // Sorting logic for task list
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If clicking same field, cycle through: asc -> desc -> no sort
      setSortDirection(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
      setSortField(prev => prev === field && sortDirection === 'desc' ? null : field);
    } else {
      // New field selected, start with ascending sort
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Applies current sort settings to task list
  const getSortedTasks = (tasksToSort: Task[]) => {
    if (!sortField || !sortDirection) return tasksToSort;

    return [...tasksToSort].sort((a, b) => {
      if (sortField === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortField === 'notes') {
        const aNote = a.notes.join(', ');
        const bNote = b.notes.join(', ');
        return sortDirection === 'asc'
          ? aNote.localeCompare(bNote)
          : bNote.localeCompare(aNote);
      }
      return 0;
    });
  };

  // Filter tasks based on search query
  const filteredTasks = getSortedTasks(tasks.filter(
    (task: Task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.notes.some((note) =>
        note.toLowerCase().includes(searchQuery.toLowerCase())
      )
  ));

  // Separate tasks into active and completed lists
  const activeTasks = filteredTasks.filter((task) => !task.isDone);
  const completedTasks = filteredTasks.filter((task) => task.isDone);

  // Handle drag and drop between task lists
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Validate drop operation
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    // Only process if moving between lists (active <-> completed)
    if (source.droppableId === destination.droppableId) {
      return;
    }

    // Update task status based on destination list
    const newIsDone = destination.droppableId === "done";
    await handleToggleComplete(draggableId, newIsDone);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="min-h-screen bg-gray-100">
        {/* Banner with burger menu */}
        <div className="bg-black text-white p-4">
          <div className="max-w-screen-xl flex justify-between items-center">
            <div className="text-[20px] font-semibold leading-[30px] font-poppins">
              Checked
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              <Bars3CenterLeftIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg p-4">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-[4px]"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-[4px] flex items-center gap-2"
              >
                <LockClosedIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          {/* Desktop header */}
          <div className="hidden md:flex justify-between items-center py-6">
            <h1 className="font-poppins text-[28px] font-bold text-start">
              My Tasks for the next month
            </h1>
            <div className="flex items-center gap-6 ml-auto">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-[240px] border border-gray-300 rounded-[4px]"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-[4px] flex items-center gap-2"
              >
                <LockClosedIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile header */}
          <div className="md:hidden py-6">
            <h1 className="font-poppins text-[24px] font-bold text-start">
              My Tasks for the next month
            </h1>
          </div>

          {/* Add Task Section */}
          <div className="my-4 flex gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#00C495] text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2"
            >
              <span>+</span>
              Add task
            </button>
          </div>

          {/* Task Tables */}
          {isLoading ? (
            <Loading />
          ) : (
            <TaskLists
              activeTasks={activeTasks}
              completedTasks={completedTasks}
              isActiveTasksOpen={isActiveTasksOpen}
              isCompletedTasksOpen={isCompletedTasksOpen}
              setIsActiveTasksOpen={setIsActiveTasksOpen}
              setIsCompletedTasksOpen={setIsCompletedTasksOpen}
              handleToggleComplete={handleToggleComplete}
              handleDeleteTask={handleDeleteTask}
              setCurrentTask={setCurrentTask}
              setIsModalOpen={setIsModalOpen}
              handleSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          )}
        </div>
        {/* Add Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentTask(null);
          }}
          onSubmit={(taskData) => {
            if (currentTask) {
              handleEditTask(currentTask._id, taskData);
            } else {
              handleAddTask(taskData);
            }
          }}
          existingTask={currentTask}
        />
        <Snackbar
          isOpen={snackbar.isOpen}
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(prev => ({ ...prev, isOpen: false }))}
        />
      </div>
    </DragDropContext>
  );
};

export default Dashboard;
