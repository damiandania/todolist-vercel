export function initializeDarkMode() {
		const darkModeIcon = document.getElementById('darkModeIcon');
		const body = document.body;

		// Recuperar el estado del modo oscuro desde localStorage
		const isDarkMode = localStorage.getItem('darkMode') === 'true';
		if (isDarkMode) {
				body.classList.add('dark-mode');
				darkModeIcon.classList.remove('fa-moon');
				darkModeIcon.classList.add('fa-sun');
		}

		// Alternar entre modo claro y oscuro
		darkModeIcon.addEventListener('click', () => {
				const isDarkMode = body.classList.toggle('dark-mode');

				// Cambiar el ícono entre luna (modo oscuro) y sol (modo claro)
				if (isDarkMode) {
						darkModeIcon.classList.remove('fa-moon');
						darkModeIcon.classList.add('fa-sun');
				} else {
						darkModeIcon.classList.remove('fa-sun');
						darkModeIcon.classList.add('fa-moon');
				}

				// Guardar el estado del modo oscuro en localStorage
				localStorage.setItem('darkMode', isDarkMode);
		});
}
