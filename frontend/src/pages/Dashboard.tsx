import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {
  TrashIcon,
  PencilIcon,
  CalendarIcon,
  TagIcon,
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { TaskAPI } from "../services/api.service";
import { Task } from "../types/task.types";
import TaskModal from "../components/TaskModal";
import { Loading } from "../components/Loading";

const tagColors: { [key: string]: string } = {
  Low: "#DDDDDD",
  Medium: "#FFEEB4",
  High: "#FFB4DC",
  Urgent: "#FFEEB4",
  Noturgent: "#DDDDDD",
};

const Dashboard: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isActiveTasksOpen, setIsActiveTasksOpen] = useState(true);
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await TaskAPI.getAllTasks();
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

  // CRUD Operations
  const handleAddTask = async (taskData: Omit<Task, "_id">) => {
    try {
      console.log("Sending task data:", taskData);

      const createdTask = await TaskAPI.createTask(taskData);
      console.log("Response from server:", createdTask);

      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error details:", error.response?.data);
      console.error("Full error:", error);
      alert("Failed to create task. Please check console for details.");
    }
  };

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

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((task: Task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const updated = await TaskAPI.toggleTaskStatus(taskId);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updated : task))
      );
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  const filteredTasks = tasks.filter(
    (task: Task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.notes.some((note) =>
        note.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const activeTasks = filteredTasks.filter((task) => !task.isDone);
  const completedTasks = filteredTasks.filter((task) => task.isDone);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="bg-black text-white p-4">
        <div className="max-w-screen-xl">
          <div className="text-[20px] font-semibold leading-[30px] font-poppins">
            Checked
          </div>
        </div>
      </div>

      {/* Main Tasks Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Header with Title, Search, and Logout */}
        <div className="flex justify-between items-center py-6">
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
                className="pl-10 pr-4 py-2 w-[240px] border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#00C495]"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-[4px] hover:bg-gray-50 flex items-center gap-2"
            >
              <LockClosedIcon className="w-5 h-5" />
              <span className="text-[14px] font-medium leading-[21px]">
                Logout
              </span>
            </button>
          </div>
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

            {isActiveTasksOpen && (
              <div className="bg-white rounded-lg shadow-lg mb-8">
                <div>
                  {/* Task Headers */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-gray-700">
                    <div className="col-span-1"></div>
                    <div className="col-span-4 flex items-center gap-2">
                      <Bars3CenterLeftIcon className="w-5 h-5 text-gray-500" />
                      Task name
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

                  {/* Task Items */}
                  {activeTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {searchQuery
                        ? "No active tasks found matching your search."
                        : "No active tasks found. Add a task to get started!"}
                    </div>
                  )}

                  {activeTasks.map((task: Task) => (
                    <div
                      key={task._id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50"
                    >
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={task.isDone}
                          onChange={() =>
                            handleToggleComplete(task._id, !task.isDone)
                          }
                          className="rounded"
                        />
                      </div>
                      <div className="col-span-4">{task.title}</div>
                      <div className="col-span-2">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </div>
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
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {isCompletedTasksOpen && (
              <div className="bg-white rounded-lg shadow-lg">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No completed tasks found.
                  </div>
                ) : (
                  completedTasks.map((task: Task) => (
                    <div
                      key={task._id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 items-center bg-gray-50"
                    >
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          checked={task.isDone}
                          onChange={() =>
                            handleToggleComplete(task._id, !task.isDone)
                          }
                          className="rounded"
                        />
                      </div>
                      <div className="col-span-4">{task.title}</div>
                      <div className="col-span-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</div>
                      <div className="col-span-2">
                        <span
                          className="px-3 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: task.description
                              ? tagColors[task.description]
                              : "#DDDDDD",
                          }}
                        >
                          {task.description || "No tag"}
                        </span>
                      </div>
                      <div className="col-span-2">{task.notes.join(", ")}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
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
    </div>
  );
};

export default Dashboard;
