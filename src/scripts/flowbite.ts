import 'flowbite';

const selects = document.querySelectorAll<HTMLSelectElement>('select[data-tabs-toggle]');

selects.forEach((select) => {
	const target = select.getAttribute('data-tabs-toggle');
	if (!target) {
		return;
	}

	select.addEventListener('change', () => {
		const value = select.value.trim();
		if (!value) {
			return;
		}

		const tabButton = document.querySelector<HTMLElement>(
			`[data-tabs-target="#${value}"]`
		);
		if (tabButton) {
			tabButton.click();
		}
	});
});
