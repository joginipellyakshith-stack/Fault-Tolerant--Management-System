import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckCircle, Circle, Activity, AlertCircle, Moon, Sun, RefreshCw, AlertTriangle } from 'lucide-react';

const API_URL = '/api'; // Proxied via Nginx

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [systemStatus, setSystemStatus] = useState('healthy');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTasks();
    const statusInterval = setInterval(checkSystemStatus, 5000);
    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/health`, { timeout: 2000 });
      if (res.status === 200) {
        setSystemStatus('healthy');
      }
    } catch (error) {
      setSystemStatus('down');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/tasks`, { title: newTask });
      setTasks([...tasks, res.data]);
      setNewTask('');
      showToast('Task added successfully');
    } catch (error) {
      showToast('Failed to add task', 'error');
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const res = await axios.put(`${API_URL}/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === id ? res.data : t));
    } catch (error) {
      showToast('Failed to update task', 'error');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      showToast('Task deleted');
    } catch (error) {
      showToast('Failed to delete task', 'error');
    }
  };

  const simulateCrash = async () => {
    try {
      await axios.get(`${API_URL}/crash`);
    } catch (error) {
      // Expected to fail as server crashes
      showToast('Crash signal sent!', 'error');
      setSystemStatus('down');
    }
  };

  const filteredTasks = tasks
    .filter(t => filter === 'all' ? true : t.status === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  if (systemStatus === 'down') {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 font-sans text-center transition-colors duration-300">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white font-semibold transition-all duration-300 transform ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {toast.message}
          </div>
        )}
        
        <AlertTriangle className="w-24 h-24 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 dark:text-red-500 mb-4">
          Website Crashed
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-lg">
          The backend system is currently offline or has crashed. The user interface cannot function without the API.
        </p>
        <div className="flex items-center justify-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Waiting for Docker to restart the system...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans transition-colors duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white font-semibold transition-all duration-300 transform ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              DevOps TaskManager
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium shadow-sm transition-colors ${systemStatus === 'healthy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
              {systemStatus === 'healthy' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4 animate-pulse" />}
              {systemStatus === 'healthy' ? 'System Healthy' : 'System Down'}
            </div>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Total Tasks</span>
            <span className="text-3xl font-bold">{tasks.length}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Completed</span>
            <span className="text-3xl font-bold text-green-500">{completedCount}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Pending</span>
            <span className="text-3xl font-bold text-blue-500">{tasks.length - completedCount}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 font-medium mb-2 block">Progress</span>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 mt-4">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-sm font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Add Task & Crash Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={addTask} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" /> Add
            </button>
          </form>

          <button 
            onClick={simulateCrash}
            className="bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all border border-red-200 dark:border-red-800"
          >
            <AlertTriangle className="w-5 h-5" /> Simulate Crash
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-gray-700">
            {['all', 'pending', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md font-medium capitalize transition-all ${filter === f ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full md:w-64"
          />
        </div>

        {/* Task List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p>No tasks found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTasks.map(task => (
                <li key={task.id} className={`p-4 flex items-center justify-between group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${task.status === 'completed' ? 'opacity-75' : ''}`}>
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => toggleTask(task.id, task.status)}
                      className={`transition-colors ${task.status === 'completed' ? 'text-green-500' : 'text-gray-400 hover:text-blue-500'}`}
                    >
                      {task.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </button>
                    <div className="flex flex-col">
                      <span className={`font-medium text-lg transition-all ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                      </span>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded uppercase font-semibold ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 uppercase font-semibold">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
