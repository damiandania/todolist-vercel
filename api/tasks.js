const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Conexión a MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://damiandania:g0cpnlIW4y9NXRIb@clustertodolist.nr4amow.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTODOLIST';
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
		return res.status(400).json({ erreur: 'Le nom de la tâche est requis.' });
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
		return res.status(404).json({ erreur: 'Tâche non trouvée.' });
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
		return res.status(404).json({ erreur: 'Tâche non trouvée.' });
    }

    res.status(204).send();
});

module.exports = app;
module.exports.handler = serverless(app);
