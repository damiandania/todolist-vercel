const express = require('express');
const app = express();
const port = 3000;

app.disable('x-powered-by');

// Base de données simulée
let tasks = [
	{ id: 1, name: "Exemple de tâche", completed: false }
];

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes API
app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
	const { name } = req.body;
	if (!name || name.trim() === "")
		return res.status(400).json({ error: "Nom de tâche requis" }
	);

	const task = { id: Date.now(), name, completed: false };
	tasks.push(task);
	res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
	const taskId = parseInt(req.params.id);
	const task = tasks.find(t => t.id === taskId);
	if (!task) return res.status(404).json({ error: "Tâche non trouvée" });
	Object.assign(task, req.body);
	res.json(task);
});

app.patch('/tasks/:id', (req, res) => {
	const taskId = parseInt(req.params.id);
	const task = tasks.find(t => t.id === taskId);
	if (!task) return res.status(404).json({ error: "Tâche non trouvée" });
	Object.assign(task, req.body);
	res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
	const taskId = parseInt(req.params.id);
	const taskIndex = tasks.findIndex(t => t.id === taskId);
	if (taskIndex === -1)
		return res.status(404).json({ error: "Tâche non trouvée" });
	tasks.splice(taskIndex, 1);
	res.status(204).end();
});

app.post('/error', (req, res) => {
	res.status(400).sendFile(__dirname + '/public/errors/400.html')
});

app.use((req, res) => {
	res.status(404).sendFile(__dirname + '/public/errors/404.html')
});

// Démarrage du serveur
app.listen(port, () => console.log(`Serveur démarré sur http://localhost:${port}`));
