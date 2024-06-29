const apiKey : string = '0f4e9a8aba74a2eab4ce56f5d718bdc4';

interface WeatherData {
    weatherAtDay: string;
    temperatureAtDay : number;
    weatherAtNight : string;
    temperatureAtNight : number;
    weekday : string;
    dayTime : Date;
}

interface CurrentDayWeatherData {
    currentLocation: string;
    currentWeather: string;
    currentTemperature : number;
    weatherAtAnotherPartOfDay : string;
    temperaturAtAnotherPartOfDay : number;
    dayTime : Date;
}

function getLocation(): string {
    const searchBarInput = document.querySelector('.search-bar-input') as HTMLInputElement;
    return searchBarInput.value.trim();
}

async function updateWeather(location: string): Promise<void> {
    try {
        const forecastApiUri = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=${location}&appid=${apiKey}`;
        const currentDayApiUri = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=${location}&cnt=7&appid=${apiKey}`;

        const weatherData = await getForecastWeather(forecastApiUri);
        const currentWeatherData = await getCurrentWeather(currentDayApiUri);

        renderForecastWeather(weatherData);
        updateWeatherCard(currentWeatherData);
    } catch (error) {
        console.error('Помилка оновлення погоди:', error);
    }
}

async function getForecastWeather(apiUri : string) : Promise<WeatherData[]> {
    const response  = await fetch(`${apiUri}`);
    const data  = await response.json();

    const WeatherForecastData : WeatherData[] = [];

    const groupedForecasts: { [key: string]: any[] } = {};

    for (const forecast of data.list) {
        const date = new Date(forecast.dt * 1000);
        const day = date.toDateString();
        if (!groupedForecasts[day]) {
            groupedForecasts[day] = [];
        }
        groupedForecasts[day].push(forecast);
    }

    let daysCount = 0;
    for (const day in groupedForecasts) {
        if (daysCount >= 1) {
            const forecastsForDay = groupedForecasts[day];

            const dayForecasts = forecastsForDay.filter(forecast => forecast.dt_txt.includes('12:00'));
            const nightForecasts = forecastsForDay.filter(forecast => forecast.dt_txt.includes('03:00'));

            const maxTempDay = Math.max(...dayForecasts.map(forecast => forecast.main.temp));
            const maxTempNight = Math.max(...nightForecasts.map(forecast => forecast.main.temp));

            const weatherDay = dayForecasts.length > 0 ? dayForecasts[0].weather[0].main : '';
            const weatherNight = nightForecasts.length > 0 ? nightForecasts[0].weather[0].main : '';

            const date = new Date(forecastsForDay[0].dt * 1000);
            const dayOfWeek = getDayOfWeek(date);

            WeatherForecastData.push({
                weatherAtDay: weatherDay,
                temperatureAtDay: maxTempDay,
                weatherAtNight: weatherNight,
                temperatureAtNight: maxTempNight,
                weekday: dayOfWeek,
                dayTime: date
            });
        }

        daysCount++;
        if (daysCount >= 6) break;
    }

    return WeatherForecastData;
}

async function getCurrentWeather (apiUri: string) : Promise<CurrentDayWeatherData[]> {
    const response = await fetch(`${apiUri}`);
    const data = await response.json();

    const currentWeatherData: CurrentDayWeatherData[] = [];

    const currentLocation = data.city.name;
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    let weatherAtAnotherPartOfDay = '';
    let temperaturAtAnotherPartOfDay = 0;

    if (currentHour >= 6 && currentHour < 18) {
        weatherAtAnotherPartOfDay = data.list.find(forecast => forecast.dt_txt.includes('03:00'))?.weather[0].main ?? '';
        temperaturAtAnotherPartOfDay = data.list.find(forecast => forecast.dt_txt.includes('03:00'))?.main.temp ?? 0;
    } else {
        weatherAtAnotherPartOfDay = data.list.find(forecast => forecast.dt_txt.includes('12:00'))?.weather[0].main ?? '';
        temperaturAtAnotherPartOfDay = data.list.find(forecast => forecast.dt_txt.includes('12:00'))?.main.temp ?? 0;
    }

    const currentWeather = data.list[0].weather[0].main;
    const currentTemperature = data.list[0].main.temp;

    currentWeatherData.push({
        currentLocation: currentLocation,
        currentWeather: currentWeather,
        currentTemperature: currentTemperature,
        weatherAtAnotherPartOfDay: weatherAtAnotherPartOfDay,
        temperaturAtAnotherPartOfDay: temperaturAtAnotherPartOfDay,
        dayTime: new Date(data.list[0].dt * 1000)
    });

    return currentWeatherData;
}

function getDayOfWeek(date: Date): string {
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return daysOfWeek[date.getDay()];
}

async function fetchData(fn : Function) {
    try {
        const weatherData = await fn();
        console.log(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function updateWeatherCard(currentWeatherData : CurrentDayWeatherData[]) {
    const weatherCard = document.querySelector('.current-weather-card') as HTMLDivElement;
  
    if (currentWeatherData.length > 0) {
      const { currentTemperature, currentWeather, weatherAtAnotherPartOfDay, temperaturAtAnotherPartOfDay, currentLocation } = currentWeatherData[0];
  
      weatherCard.querySelector('.weather-card-current-temperature')!.textContent = `${currentTemperature.toFixed(0)}°C`;
      weatherCard.querySelector('.weather-card-prediction-precipitation')!.textContent = weatherAtAnotherPartOfDay;
      weatherCard.querySelector('.weather-card-prediction-maxtemperature')!.textContent = `${temperaturAtAnotherPartOfDay.toFixed(0)}°C`;
      weatherCard.querySelector('.weather-card-current-general')!.textContent = currentWeather;
      weatherCard.querySelector('.weather-card-general-location')!.textContent = currentLocation;
    }
}

async function renderForecastWeather(weatherData : WeatherData[]): Promise<void> {
    try {
        const weatherCardsContainer = document.querySelector('.weather-cards-ohter-days');
        
        if (!weatherCardsContainer) {
            console.error('Element with class "weather-cards-ohter-days" not found.');
            return;
        }

        weatherCardsContainer.innerHTML = weatherData.map(card => `
            <div class="next-day-weather-card">
                <p class="next-day-weather-card-weekday">${card.weekday}</p>

                <div class="next-day-weather-card-img">
                    <img src="/images/${card.weatherAtDay}.png" alt="${card.weatherAtDay}" />
                </div>

                <p class="next-day-weather-card-prediction">${card.weatherAtDay}</p>

                <div class="next-day-weather-card-temperature">
                    <p class="next-day-weather-card-temperature-part-of-day">Day</p>
                    <p class="next-day-weather-card-temperature-in-day-night">${Math.round(card.temperatureAtDay)}&deg;C</p>
                    <p class="next-day-weather-card-temperature-in-day-night">${Math.round(card.temperatureAtNight)}&deg;C</p>
                    <p class="next-day-weather-card-temperature-part-of-day">Night</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error rendering forecast weather:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-bar-btn') as HTMLButtonElement;
    const searchBarInput = document.querySelector('.search-bar-input') as HTMLInputElement;

    searchBtn.addEventListener('click', () => {
        const location = getLocation();
        updateWeather(location);
    });

    searchBarInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const location = getLocation();
            updateWeather(location);
        }
    });

    updateWeather('Kyiv');
});

