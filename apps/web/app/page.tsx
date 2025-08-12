"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuth } from "@convex-dev/auth/react";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, signOut } = useAuth();
  const tasks = useQuery(api.tasks.getTasks) || { current: [], completed: [] };
  const addTask = useMutation(api.tasks.addTask);
  const markComplete = useMutation(api.tasks.markComplete);
  const [newTask, setNewTask] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">To-Do App</h1>
          <Link href="/login" className="text-blue-500">Log In</Link>
          <span className="mx-2">|</span>
          <Link href="/signup" className="text-blue-500">Sign Up</Link>
        </div>
      </div>
    );
  }

  const handleAdd = async () => {
    if (newTask) {
      await addTask({ title: newTask });
      setNewTask("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <button onClick={signOut} className="text-red-500">Logout</button>
      </div>
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">To-Do List</h1>
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a new task"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Current Tasks</h2>
            <div className="space-y-2">
              {tasks.current.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                >
                  <span>{task.title}</span>
                  <button
                    onClick={() => markComplete({ id: task._id })}
                    className="text-green-500 hover:text-green-600"
                  >
                    Mark Done
                  </button>
                </div>
              ))}
            </div>
            <h2 className="text-xl font-semibold mt-6">Completed Tasks</h2>
            <div className="space-y-2">
              {tasks.completed.map((task) => (
                <div
                  key={task._id}
                  className="bg-gray-200 p-4 rounded-lg shadow"
                >
                  <span className="text-gray-600 line-through">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}