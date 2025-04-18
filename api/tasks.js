const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, 'tasks.json');

// Helper function to read tasks from the JSON file
function readTasks() {
    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    return JSON.parse(data);
}

// Helper function to write tasks to the JSON file
function writeTasks(tasks) {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El nombre de la tarea es requerido.' });
    }

    const tasks = readTasks();
    const newTask = { id: tasks.length ? tasks[tasks.length - 1].id + 1 : 0, name, completed: false };
    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, completed } = req.body;

    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    if (name !== undefined) task.name = name;
    if (completed !== undefined) task.completed = completed;

    writeTasks(tasks);
    res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const tasks = readTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    tasks.splice(index, 1);
    writeTasks(tasks);

    res.status(204).send();
});

module.exports = app;
module.exports.handler = serverless(app);
