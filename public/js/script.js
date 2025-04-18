import { sortTasks, updateSortCriteria } from './sort.js';
import { updateFilter } from './filter.js';
import { initializeDarkMode } from './darkMode.js';
import { showToast } from './notifications.js';

let currentFilter = { value: 'all' };
let sortCriteria = { value: 'date' };

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

	if (taskName) {
		fetch('/api/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: taskName })
		})
			.then(response => response.json())
			.then(() => {
				taskInput.value = '';
				loadList();
				showToast(taskName, 'ajoutée', "#00a0df");
			})
			.catch(console.error);
	} else {
		showToast("Erreur:", "nom de tâche requis", "red");
	}
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
	fetch(`/api/tasks/${task.id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ completed: checkbox.checked })
	})
		.then(response => {
			if (!response.ok) throw new Error("Erreur lors de la mise à jour");
			return response.json();
		})
		.then(() => {
			item.classList.toggle('completed', checkbox.checked);
			if (currentFilter.value !== 'all') loadList();
		})
		.catch(console.error);
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
			fetch(`/api/tasks/${task.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newName })
			})
				.then(response => {
					if (!response.ok) throw new Error("Erreur lors de la mise à jour");
					return response.json();
				})
				.then(() => {
					task.name = newName;
					text.textContent = newName;
					item.replaceChild(text, input);
				})
				.catch(console.error);
		} else {
			item.replaceChild(text, input);
		}
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
		fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
			.then(() => loadList())
			.catch(console.error);
	}, 300);
}

function loadList() {
    fetch('/api/tasks')
        .then(res => res.json())
        .then(tasks => {
            const list = document.getElementById('taskList');
            list.innerHTML = '';

            const filtered = tasks.filter(task => {
                if (currentFilter.value === 'all') return true;
                if (currentFilter.value === 'active') return !task.completed;
                if (currentFilter.value === 'done') return task.completed;
            });

            const sorted = sortTasks(filtered, sortCriteria.value);
            sorted.forEach(renderTask);
        })
        .catch(console.error);
}

initializeEvents();
loadList();
initializeDarkMode();
