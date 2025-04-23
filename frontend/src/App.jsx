import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:8000/api/v1/tasks';

const App = () => {
  const[tasks, setTasks]=useState([]);
  const[taskName, setTaskName]=useState('');
  const[editingTaskId, setEditingTaskId] = useState(null);
  const [editedName, setEditingName] = useState('');

  const fetchTasks = async()=>{
    try {
      const res = await axios.get(baseURL);
      setTasks(res.data.tasks);
    } catch (error) {
      console.error('Fetch Error: ', error.message);
    }
  };
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!taskName.trim())return;
    try {
      await axios.post(baseURL, {name:taskName});
      setTaskName('');
      fetchTasks()
    } catch (error) {
      console.error(`Create Error:`, error.response?.data||error.message);
    }
  }

  const startEditing = (task)=>{
    setEditingTaskId(task._id);
    setEditingName(task.name);
  }

  const saveEditingTask = async(task)=>{
    try {
      await axios.patch(`${baseURL}/${task._id}`, {name:editedName});
      setEditingTaskId(null);
      setEditingName('');
      fetchTasks();
    } catch (error) {
      console.error('Edit Error: ', error.message);
    }
  }

  const toggleComplete = async(task)=>{
    try {
      const updatedTask = {...task, completed: !task.completed};
      await axios.patch(`${baseURL}/${task._id}`,{
        completed:updatedTask.completed,
      })
      setTasks((prevTasks)=>
        prevTasks.map((t)=>
        t._id === task._id ? {...t, completed: updatedTask.completed}:t
    )
  );
    } catch (error) {
      console.error('Toggle Completed Error:', error.message);
    }
  }

  const deleteTask = async(id)=>{
    try {
      await axios.delete(`${baseURL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Delete Error: ', error.message);
    }
  };
  useEffect(()=>{
    fetchTasks();
  },[]);

  return(
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className='flex justify-center text-2xl mb-6'>Task Manager</h1>
        <form onSubmit={handleSubmit} className='flex justify-center'>
          <input type="text" value={taskName} onChange={(e)=>setTaskName(e.target.value)}  placeholder='Enter the task' className='border-2 w-[300px] p-2 focus:outline-none focus:ring-2 focus:ring-blue-600'/>
          <button type="submit" className='ml-10 bg-blue-600 p-2 px-4 text-white rounded-md hover:bg-blue-900 transition'>
            Add
          </button>
        </form>
        {tasks.length===0?(
          <p className='flex justify-center text-gray-400 mt-4'>No tasks found.</p>
        ):(
          <ul className='space-y-3 mt-6'>
            {tasks.map((task)=>
              <li key={task._id} className='flex justify-between items-center px-4 py-2 bg-gray-50 rounded border'>
                <div>
                  {editingTaskId === task._id ? (
                    <input
                    type='text'
                    value={editedName}
                    onChange={(e)=>setEditingName(e.target.value)}
                    className="w-full px-2 py-1 border border-blue-400 rounded"/>
                  ):(
                    <span onClick={()=>toggleComplete(task)} className={`cursor-pointer ${task.completed?'line-through text-gray-400':''}`}>
                    {task.name}
                    </span>
                  )}
                </div>
                <div className='space-x-3 text-sm'>
                  {editingTaskId===task._id?(
                    <button onClick={()=>saveEditingTask(task)} className='text-green-500'>
                      Save
                    </button>
                  ):(
                    <button onClick={()=>startEditing(task)} className='text-blue-600'>
                      Edit
                    </button>
                  )}
                <button onClick={()=>deleteTask(task._id)} className='text-red-500 hover:text-red-700 '>
                  Delete
                </button>
                </div>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
};

export default App;
