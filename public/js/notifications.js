export function showToast(task, action, backgroundColor) {
	Toastify({
		text: `${task} ${action}!`,
		duration: 3000,
		gravity: "bottom",
		position: "right",
		style: {
			background: backgroundColor
		},
	}).showToast();
}

