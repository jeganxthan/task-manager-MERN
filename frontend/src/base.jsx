import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:8000/api/v1/tasks';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(baseURL);
      setTasks(res.data.tasks);
    } catch (error) {
      console.error('Fetch Error:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    try {
      await axios.post(baseURL, { name: taskName });
      setTaskName('');
      fetchTasks();
    } catch (error) {
      console.error('Create Error:', error.response?.data || error.message);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await axios.patch(`${baseURL}/${task._id}`, {
        completed: updatedTask.completed,
      });
      // Optimistically update the state
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, completed: updatedTask.completed } : t
        )
      ); 
    } catch (error) {
      console.error('Toggle Complete Error:', error.message);
    }
  };
  

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Delete Error:', error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Task Manager ✅
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter a new task"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
        </form>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center bg-gray-50 border px-4 py-2 rounded"
              >
                <span
                  onClick={() => toggleComplete(task)}
                  className={`cursor-pointer select-none ${
                    task.completed ? 'line-through text-gray-400' : ''
                  }`}
                  title="Click to toggle complete"
                >
                  {task.completed ? '✅ ' : '⬜ '} {task.name}
                </span>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-sm text-red-500 hover:text-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
