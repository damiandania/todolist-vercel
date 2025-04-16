export function updateFilter(newFilter, currentFilter, loadList) {
  currentFilter.value = newFilter;

  document.querySelectorAll('#filterAll, #filterActive, #filterDone').forEach(btn => btn.classList.remove('active'));
  if (newFilter === 'all') {
    document.getElementById('filterAll').classList.add('active');
  } else if (newFilter === 'active') {
    document.getElementById('filterActive').classList.add('active');
  } else if (newFilter === 'done') {
    document.getElementById('filterDone').classList.add('active');
  }

  loadList();
}
