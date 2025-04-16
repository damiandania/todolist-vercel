export function sortTasks(tasks, criteria) {
	return tasks.sort((a, b) => {
		if (criteria === 'date') {
			return a.id - b.id;
		} else if (criteria === 'alphabetical') {
			return a.name.localeCompare(b.name);
		} else if (criteria === 'status') {
			return a.completed - b.completed;
		}
		return 0;
	});
}

export function updateSortCriteria(newCriteria, sortCriteria, loadList) {
	sortCriteria.value = newCriteria;

	document.querySelectorAll('.sort-link').forEach(link => link.classList.remove('active'));
	if (newCriteria === 'date') {
		document.getElementById('sortDate').classList.add('active');
	} else if (newCriteria === 'alphabetical') {
		document.getElementById('sortAlphabetical').classList.add('active');
	} else if (newCriteria === 'status') {
		document.getElementById('sortStatus').classList.add('active');
	}

	loadList();
}
