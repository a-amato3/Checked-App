import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard: React.FC = () => {
  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error: any) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Your tasks will be displayed here.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Dashboard;
