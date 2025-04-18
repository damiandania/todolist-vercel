const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexión a MongoDB
const mongoUri = process.env.MONGO_URI || 'your-mongodb-connection-string';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'El nombre de la tarea es requerido.' });
    }

    const newTask = new Task({ name });
    await newTask.save();
    res.status(201).json(newTask);
});

app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { name, completed } = req.body;

    const task = await Task.findById(id);
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    if (name !== undefined) task.name = name;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
    }

    res.status(204).send();
});

module.exports = app;
module.exports.handler = serverless(app);
