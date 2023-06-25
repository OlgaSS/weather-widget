import { getCurrentDateTime, calcDewPoint, convertPressure, getWeatherForecastData } from './utils.js';

const dayColor = {
    clear: '#8fb4eb, #84aae8, #7aa1e6, #7197e2, #698ddf, #6387db, #5d80d8, #577ad4, #5176d0, #4b71cc, #456dc8, #3f69c4',
    cloudy: '#8ba7d0, #819dc7, #7792bd, #6d88b4, #637eab, #5c77a5, #546f9f, #4d6899, #476195, #405b91, #3a548c, #344e88',
    rainy: '#8094b1, #768ba9, #6d81a1, #637899, #5a6f91, #55698b, #506486, #4b5e80, #495b7c, #475778, #455474, #435170',
    drizzle: '#fbfcfc, #d8e7e9, #b7d1d9, #97bbcb, #7ba4be, #6f99b8, #658fb2, #5b84ac, #5a83ab, #5983aa, #5782a9, #5681a8',
    lightning: '#40123b, #582654, #713a6e, #8b508a, #a566a7, #a968ae, #ad6bb5, #b16dbc, #a05cad, #8e4a9e, #7d398f, #6c2881',
    snow: '#8fb5df, #79a4d7, #6494ce, #4f83c6, #3873bd, #3873bd, #3873bd, #3873bd, #4f83c6, #6494ce, #79a4d7, #8fb5df',
    snowstorm: '#2e6097, #2f5f93, #2f5e8f, #305c8c, #315b88, #335a84, #36597f, #38587b, #3c5775, #3f566f, #435569, #465463',
}

const nightColor = {
    clear: '#5261a6, #465394, #3a4683, #2e3972, #222c62, #1d275a, #172153, #121c4b, #121c49, #121c47, #131c45, #131c43',
    cloudy: '#3d4777, #363f6a, #30375e, #292f52, #232846, #202541, #1c213c, #191e37, #181d37, #171c36, #151b36, #141a35',
    rainy: '#353b62, #31375c, #2e3456, #2a3050, #272d4a, #262c47, #242a45, #232942, #242942, #242a41, #252a41, #252a40',
    drizzle: '#353b62, #31375c, #2e3456, #2a3050, #272d4a, #262c47, #242a45, #232942, #242942, #242a41, #252a41, #252a40',
    lightning: '#341931, #4a2c47, #603f5d, #785475, #90698e, #916990, #916992, #926994, #7c5380, #663e6c, #502959, #3b1546',
    snow: '#415584, #3a4f7f, #33497a, #2c4475, #253e70, #213b6e, #1d396d, #19366b, #18356d, #17356f, #163470, #153372',
    snowstorm: '#455376, #3c4b6f, #334367, #2a3c60, #213459, #1c2f55, #172b50, #12264c, #102349, #0e2146, #0c1e43, #0a1c40',
}

export const renderWidgetToday = (widget, data) => {
    const { dayOfMonth, month, year, dayOfWeek, hours, minutes } = getCurrentDateTime();
    let color;

    if (data.weather[0].icon === '01d') {
        color = dayColor.clear;
    } else if (data.weather[0].icon === '02d' || data.weather[0].icon === '03d' || data.weather[0].icon === '04d') {
        color = dayColor.cloudy;
    } else if (data.weather[0].icon === '09d') {
        color = dayColor.rainy;
    } else if (data.weather[0].icon === '10d') {
        color = dayColor.drizzle;
    } else if (data.weather[0].icon === '11d') {
        color = dayColor.lightning;
    } else if (data.weather[0].icon === '13d') {
        color = dayColor.snow;
    } else if (data.weather[0].icon === '50d') {
        color = dayColor.snowstorm;
    }

    if (data.weather[0].icon === '01n') {
        color = nightColor.clear;
    } else if (data.weather[0].icon === '02n' || data.weather[0].icon === '03n' || data.weather[0].icon === '04n') {
        color = nightColor.cloudy;
    } else if (data.weather[0].icon === '09n') {
        color = nightColor.rainy;
    } else if (data.weather[0].icon === '10n') {
        color = nightColor.drizzle;
    } else if (data.weather[0].icon === '11n') {
        color = nightColor.lightning;
    } else if (data.weather[0].icon === '13n') {
        color = nightColor.snow;
    } else if (data.weather[0].icon === '50n') {
        color = nightColor.snowstorm;
    }
    document.body.style.backgroundImage = `linear-gradient(to right bottom, ${color})`;
    widget.style.backgroundImage = `linear-gradient(to right bottom, ${color})`;

    widget.insertAdjacentHTML('beforeend', `
    <div class="widget__today">
        <div class="widget__date-block">
            <p class="widget__date">${dayOfMonth} ${month} ${year}</p>
            <p class="widget__time">${hours}:${minutes}</p>
            <p class="widget__day">${dayOfWeek}</p>
        </div>
        <div class="widget__icon">
            <img class="widget__img" src="./icon/${data.weather[0].icon}.svg" alt="Погода">
        </div>
        <div class="widget__wheather">
            <div class="widget__city">
                <p>${data.name}</p>
                <button class="widget__change-city" aria-label="Изменить город"></button>
            </div>
            <p class="widget__temp-big">${(data.main.temp - 273.15).toFixed(0)}°C</p>
            <p class="widget__felt">ощущается</p>
            <p class="widget__temp-small">${(data.main.feels_like - 273.15).toFixed(0)}°C</p>
        </div>
    </div>
    `);
};

export const renderWidgetOther = (widget, data) => {
    widget.insertAdjacentHTML('beforeend', `
    <div class="widget__other">
        <div class="widget__wind">
            <p class="widget__wind-title">Ветер</p>
            <p class="widget__wind-speed">${data.wind.speed} м/с</p>
            <p class="widget__wind-text" style="transform: rotate(${data.wind.deg}deg)">&#8595</p>
        </div>
        <div class="widget__humidity">
            <p class="widget__humidity-title">Влажность</p>
            <p class="widget__humidity-value">${data.main.humidity}%</p>
            <p class="widget__humidity-text">Т.Р: ${calcDewPoint((data.main.temp - 273.15), data.main.humidity)} °C</p>
        </div>
        <div class="widget__pressure">
            <p class="widget__pressure-title">Давление</p>
            <p class="widget__pressure-value">${convertPressure(data.main.pressure)}</p>
            <p class="widget__pressure-text">мм рт.ст.</p>
        </div>
    </div>
    `);
};

export const renderWidgetForecast = (widget, data) => {
    const widgetForecast = document.createElement('ul');
    widgetForecast.className = 'widget__forecast';
    widget.append(widgetForecast);

    const forecastData = getWeatherForecastData(data);

    const items = forecastData.map((item) => {
        const widgetDayItem = document.createElement('li');
        widgetDayItem.className = 'widget__day-item';
        widgetDayItem.insertAdjacentHTML('beforeend', `
            <p class="widget__day-text">${item.dayOfWeek}</p>
            <img class="widget__day-img" src="./icon/${item.weatherIcon}.svg" alt="Погода">
            <p class="widget__day-temp">${(item.minTemp - 273.15).toFixed(0)}°/${(item.maxTemp - 273.15).toFixed(0)}°</p>
        `);

        return widgetDayItem;
    })

    widgetForecast.append(...items)
};

export const showError = (widget, error) => {
    widget.textContent = error.toString();
    widget.classList.add('widget__error');
}
