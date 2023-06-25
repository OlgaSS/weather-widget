import { startWidget } from "./widgetService.js";

export const cityServiceSearch = (widget) => {
    const button = document.querySelector('.widget__change-city');

    button.addEventListener('click', () => {
        if (!button.classList.contains('open')) {
            button.classList.add('open');
            const form = document.createElement('form');
            const input = document.createElement('input');

            form.classList = 'widget__form';
            input.classList = 'widget__input';
            input.name = 'city';
            input.placeholder = 'Введите город';

            form.append(input);
            widget.append(form);

            input.focus();
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                widget.textContent = '';
                await startWidget(input.value, widget);
                cityServiceSearch(widget);
            })
        } else {
            const form = document.querySelector('.widget__form');
            button.classList.remove('open');
            form.remove();
        }
    })
}