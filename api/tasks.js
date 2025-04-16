const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

let tasks = [];
let currentId = 1;

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la tarea es requerido.' });
  }
  const newTask = { id: currentId++, name, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }
  task.completed = !task.completed; // Cambiar el estado de 'completed'
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = app;
module.exports.handler = serverless(app);
