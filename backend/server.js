const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data storage
let tasks = [
  {
    id: 1,
    title: 'Setup DevOps Project',
    status: 'completed',
    priority: 'high',
    category: 'work',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Implement Monitoring Script',
    status: 'pending',
    priority: 'high',
    category: 'work',
    createdAt: new Date().toISOString(),
  }
];

// --- Task CRUD Endpoints ---

// GET /tasks -> return all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks -> create a new task
app.post('/tasks', (req, res) => {
  const { title, status = 'pending', priority = 'medium', category = 'work' } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title,
    status,
    priority,
    category,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id -> update task status or priority
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, status, priority, category } = req.body;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title !== undefined ? title : tasks[taskIndex].title,
    status: status !== undefined ? status : tasks[taskIndex].status,
    priority: priority !== undefined ? priority : tasks[taskIndex].priority,
    category: category !== undefined ? category : tasks[taskIndex].category
  };

  res.json(tasks[taskIndex]);
});

// DELETE /tasks/:id -> delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// --- DevOps Specific Endpoints ---

// GET /health -> return { status: "ok" }
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// GET /crash -> intentionally terminate the server process
app.get('/crash', (req, res) => {
  console.log('CRASH SIMULATION: Received request to terminate server...');
  res.status(500).json({ message: 'Server is crashing intentionally!' });
  
  // Exit after a brief delay so the response can be sent back
  setTimeout(() => {
    process.exit(1);
  }, 100);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
