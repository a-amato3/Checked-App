import React from "react";
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
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
        <div className="flex justify-between items-center  py-6">
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
              <span className="text-[14px] font-medium leading-[21px]">Logout</span>
            </button>
          </div>
        </div>

        {/* Add Task Button */}
        <button className="bg-[#00C495] text-white px-4 py-2 rounded-md font-semibold mb-8 flex items-center gap-2">
          <span>+</span>
          Add task
        </button>

        {/* Tasks Section */}
        <h2 className="text-xl font-semibold mb-4">Tasks to do</h2>
        <div className="bg-white rounded-lg shadow-lg">
          <div>
            <div className="space-y-4">
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

              {/* Task Items will be mapped here */}
              <div className="bg-white border border-gray-200 rounded-md">
                {/* Sample Task Item */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-gray-50">
                  <div className="col-span-1">
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="col-span-4">
                    Prepare meals for myself for the whole week
                  </div>
                  <div className="col-span-2">24/07/24</div>
                  <div className="col-span-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      Not urgent
                    </span>
                  </div>
                  <div className="col-span-2"></div>
                  <div className="col-span-1 flex gap-2">
                    <button className="text-gray-500 hover:text-gray-700">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
