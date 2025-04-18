import { sortTasks, updateSortCriteria } from './sort.js';
import { updateFilter } from './filter.js';
import { initializeDarkMode } from './darkMode.js';
import { showToast } from './notifications.js';

let currentFilter = { value: 'all' };
let sortCriteria = { value: 'date' };

// Utilitaires pour gérer les tâches dans le localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialiser les événements de filtres et de tri
function initializeEvents() {
	// Filtres
	['filterAll', 'filterActive', 'filterDone'].forEach(filterId => {
		document.getElementById(filterId).addEventListener('click', () => {
			updateFilter(filterId.replace('filter', '').toLowerCase(), currentFilter, loadList);
		});
	});

	// Tri
	['sortDate', 'sortAlphabetical', 'sortStatus'].forEach(sortId => {
		document.getElementById(sortId).addEventListener('click', (e) => {
			e.preventDefault();
			updateSortCriteria(sortId.replace('sort', '').toLowerCase(), sortCriteria, loadList);
		});
	});

	// Ajouter une tâche
	document.getElementById('addTaskBtn').addEventListener('click', addTask);
	document.getElementById('taskInput').addEventListener('keydown', e => {
		if (e.key === 'Enter') addTask();
	});
}

// Fonction pour ajouter une tâche
function addTask() {
	const taskInput = document.getElementById('taskInput');
	const taskName = taskInput.value.trim();

	if (!taskName) {
		showToast("Erreur:", "nom de tâche requis", "red");
		return;
	}

	const tasks = getTasks();
	tasks.push({ id: Date.now(), name: taskName, completed: false });
	saveTasks(tasks);
	taskInput.value = '';
	loadList();
	showToast(taskName, 'ajoutée', "#00a0df");
}

// Fonction pour afficher une tâche
function renderTask(task) {
	const list = document.getElementById('taskList');
	const item = document.createElement('li');
	if (task.completed) item.classList.add('completed');

	// Checkbox
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.checked = task.completed;
	checkbox.onchange = () => {
		toggleTaskCompletion(task, checkbox, item);
		if (checkbox.checked) {
			showToast(task.name, 'completée', 'green');
		}
	};

	// Texte de la tâche
	const text = document.createElement('span');
	text.className = 'task-text';
	text.textContent = task.name;
	text.ondblclick = () => editTaskName(task, text, item);

	// Bouton de suppression
	const deleteBtn = document.createElement('span');
	deleteBtn.className = 'trash-btn';
	deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
	deleteBtn.onclick = () => deleteTask(task, item);

	item.append(checkbox, text, deleteBtn);
	list.appendChild(item);
}

// Fonction pour basculer l'état de complétion d'une tâche
function toggleTaskCompletion(task, checkbox, item) {
	const tasks = getTasks();
	const t = tasks.find(t => t.id === task.id);
	if (t) t.completed = checkbox.checked;
	saveTasks(tasks);
	loadList();
}

// Fonction pour modifier le nom d'une tâche
function editTaskName(task, text, item) {
	const input = document.createElement('input');
	input.type = 'text';
	input.maxLength = 35;
	input.value = task.name;
	input.className = 'edit-input';

	const saveChanges = () => {
		input.removeEventListener('blur', saveChanges);
		input.removeEventListener('keydown', saveChanges);

		const newName = input.value.trim();
		if (newName && newName !== task.name) {
			const tasks = getTasks();
			const t = tasks.find(t => t.id === task.id);
			if (t) t.name = newName;
			saveTasks(tasks);
			loadList();
		}
		item.replaceChild(text, input);
	};

	input.addEventListener('blur', saveChanges);
	input.addEventListener('keydown', e => {
		if (e.key === 'Enter') saveChanges();
	});

	item.replaceChild(input, text);
	input.focus();
}

function deleteTask(task, item) {
	item.classList.add('deleting');
	showToast(task.name, 'supprimée', 'red');
	setTimeout(() => {
		let tasks = getTasks();
		tasks = tasks.filter(t => t.id !== task.id);
		saveTasks(tasks);
		loadList();
	}, 300);
}

function loadList() {
    const tasks = getTasks();
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    // Filtrado
    const filtered = tasks.filter(task => {
        if (currentFilter.value === 'all') return true;
        if (currentFilter.value === 'active') return !task.completed;
        if (currentFilter.value === 'done') return task.completed;
    });

    // Ordenamiento
    const sorted = sortTasks(filtered, sortCriteria.value);

    sorted.forEach(renderTask);
}

initializeEvents();
loadList();
initializeDarkMode();
