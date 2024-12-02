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
} from "@heroicons/react/24/outline";
import { TaskAPI } from "../services/api.service";
import { Task } from "../types/task.types";

const Dashboard: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

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
        const fetchedTasks = await TaskAPI.getAllTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // CRUD Operations
  const handleAddTask = async (newTask: Omit<Task, "_id">) => {
    try {
      const taskToCreate = {
        title: newTaskTitle,
        isDone: false,
        description: "",
        notes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdTask = await TaskAPI.createTask(taskToCreate);
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setNewTaskTitle("");
    } catch (error: any) {
      console.error("Error creating task:", error);
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

      {/* Main Content */}
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
            onClick={() => {
              if (!newTaskTitle.trim()) return;

              const newTask = {
                _id: "",
                title: newTaskTitle,
                isDone: false,
                description: "",
                notes: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              handleAddTask(newTask);
              setNewTaskTitle("");
            }}
            className="bg-[#00C495] text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2"
          >
            <span>+</span>
            Add task
          </button>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00C495]"
          />
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-lg">
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
            {tasks.map((task) => (
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
                  {new Date(task.createdAt).toLocaleDateString()}
                </div>
                <div className="col-span-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {task.description || "No tag"}
                  </span>
                </div>
                <div className="col-span-2">{task.notes.join(", ")}</div>
                <div className="col-span-1 flex gap-2">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      // setCurrentTask(task);
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
      </div>
    </div>
  );
};

export default Dashboard;
