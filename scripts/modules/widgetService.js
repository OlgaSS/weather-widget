import { fetchWeather, fetchForecast, getCity } from './APIservice.js';
import { renderWidgetToday, renderWidgetOther, renderWidgetForecast, showError } from './render.js';

export const startWidget = async (city, widget) => {

    if (!city) {
        const dataCity = await getCity();
        if (dataCity.success) {
            city = dataCity.city;
        } else {
            showError(widget, dataCity.error);
        }
    }

    if (!widget) {
        widget = document.createElement('div');
        widget.classList.add('widget');
    }

    const dataWeather = await fetchWeather(city);
    if (dataWeather.success) {
        renderWidgetToday(widget, dataWeather.data);
        renderWidgetOther(widget, dataWeather.data);
    } else {
        showError(widget, 'По вашему запросу ничего не найдено');
    }

    const dataForecast = await fetchForecast(city);
    if (dataWeather.success) {
        renderWidgetForecast(widget, dataForecast.data);
    } else {
        showError(widget, 'По вашему запросу ничего не найдено');
    }

    return widget
}