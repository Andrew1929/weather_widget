var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var apiKey = '0f4e9a8aba74a2eab4ce56f5d718bdc4';
function getLocation() {
    var searchBarInput = document.querySelector('.search-bar-input');
    return searchBarInput.value.trim();
}
function updateWeather(location) {
    return __awaiter(this, void 0, void 0, function () {
        var forecastApiUri, currentDayApiUri, weatherData, currentWeatherData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    forecastApiUri = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=".concat(location, "&appid=").concat(apiKey);
                    currentDayApiUri = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=".concat(location, "&cnt=7&appid=").concat(apiKey);
                    return [4 /*yield*/, getForecastWeather(forecastApiUri)];
                case 1:
                    weatherData = _a.sent();
                    return [4 /*yield*/, getCurrentWeather(currentDayApiUri)];
                case 2:
                    currentWeatherData = _a.sent();
                    renderForecastWeather(weatherData);
                    updateWeatherCard(currentWeatherData);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Помилка оновлення погоди:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getForecastWeather(apiUri) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, WeatherForecastData, groupedForecasts, _i, _a, forecast, date, day, daysCount, day, forecastsForDay, dayForecasts, nightForecasts, maxTempDay, maxTempNight, weatherDay, weatherNight, date, dayOfWeek;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch("".concat(apiUri))];
                case 1:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _b.sent();
                    WeatherForecastData = [];
                    groupedForecasts = {};
                    for (_i = 0, _a = data.list; _i < _a.length; _i++) {
                        forecast = _a[_i];
                        date = new Date(forecast.dt * 1000);
                        day = date.toDateString();
                        if (!groupedForecasts[day]) {
                            groupedForecasts[day] = [];
                        }
                        groupedForecasts[day].push(forecast);
                    }
                    daysCount = 0;
                    for (day in groupedForecasts) {
                        if (daysCount >= 1) {
                            forecastsForDay = groupedForecasts[day];
                            dayForecasts = forecastsForDay.filter(function (forecast) { return forecast.dt_txt.includes('12:00'); });
                            nightForecasts = forecastsForDay.filter(function (forecast) { return forecast.dt_txt.includes('03:00'); });
                            maxTempDay = Math.max.apply(Math, dayForecasts.map(function (forecast) { return forecast.main.temp; }));
                            maxTempNight = Math.max.apply(Math, nightForecasts.map(function (forecast) { return forecast.main.temp; }));
                            weatherDay = dayForecasts.length > 0 ? dayForecasts[0].weather[0].main : '';
                            weatherNight = nightForecasts.length > 0 ? nightForecasts[0].weather[0].main : '';
                            date = new Date(forecastsForDay[0].dt * 1000);
                            dayOfWeek = getDayOfWeek(date);
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
                        if (daysCount >= 6)
                            break;
                    }
                    return [2 /*return*/, WeatherForecastData];
            }
        });
    });
}
function getCurrentWeather(apiUri) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, currentWeatherData, currentLocation, currentDate, currentHour, weatherAtAnotherPartOfDay, temperaturAtAnotherPartOfDay, currentWeather, currentTemperature;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, fetch("".concat(apiUri))];
                case 1:
                    response = _j.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _j.sent();
                    currentWeatherData = [];
                    currentLocation = data.city.name;
                    currentDate = new Date();
                    currentHour = currentDate.getHours();
                    weatherAtAnotherPartOfDay = '';
                    temperaturAtAnotherPartOfDay = 0;
                    if (currentHour >= 6 && currentHour < 18) {
                        weatherAtAnotherPartOfDay = (_b = (_a = data.list.find(function (forecast) { return forecast.dt_txt.includes('03:00'); })) === null || _a === void 0 ? void 0 : _a.weather[0].main) !== null && _b !== void 0 ? _b : '';
                        temperaturAtAnotherPartOfDay = (_d = (_c = data.list.find(function (forecast) { return forecast.dt_txt.includes('03:00'); })) === null || _c === void 0 ? void 0 : _c.main.temp) !== null && _d !== void 0 ? _d : 0;
                    }
                    else {
                        weatherAtAnotherPartOfDay = (_f = (_e = data.list.find(function (forecast) { return forecast.dt_txt.includes('12:00'); })) === null || _e === void 0 ? void 0 : _e.weather[0].main) !== null && _f !== void 0 ? _f : '';
                        temperaturAtAnotherPartOfDay = (_h = (_g = data.list.find(function (forecast) { return forecast.dt_txt.includes('12:00'); })) === null || _g === void 0 ? void 0 : _g.main.temp) !== null && _h !== void 0 ? _h : 0;
                    }
                    currentWeather = data.list[0].weather[0].main;
                    currentTemperature = data.list[0].main.temp;
                    currentWeatherData.push({
                        currentLocation: currentLocation,
                        currentWeather: currentWeather,
                        currentTemperature: currentTemperature,
                        weatherAtAnotherPartOfDay: weatherAtAnotherPartOfDay,
                        temperaturAtAnotherPartOfDay: temperaturAtAnotherPartOfDay,
                        dayTime: new Date(data.list[0].dt * 1000)
                    });
                    return [2 /*return*/, currentWeatherData];
            }
        });
    });
}
function getDayOfWeek(date) {
    var daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return daysOfWeek[date.getDay()];
}
function fetchData(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var weatherData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fn()];
                case 1:
                    weatherData = _a.sent();
                    console.log(weatherData);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching weather data:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function updateWeatherCard(currentWeatherData) {
    return __awaiter(this, void 0, void 0, function () {
        var weatherCard, _a, currentTemperature, currentWeather, weatherAtAnotherPartOfDay, temperaturAtAnotherPartOfDay, currentLocation;
        return __generator(this, function (_b) {
            weatherCard = document.querySelector('.current-weather-card');
            if (currentWeatherData.length > 0) {
                _a = currentWeatherData[0], currentTemperature = _a.currentTemperature, currentWeather = _a.currentWeather, weatherAtAnotherPartOfDay = _a.weatherAtAnotherPartOfDay, temperaturAtAnotherPartOfDay = _a.temperaturAtAnotherPartOfDay, currentLocation = _a.currentLocation;
                weatherCard.querySelector('.weather-card-current-temperature').textContent = "".concat(currentTemperature.toFixed(0), "\u00B0C");
                weatherCard.querySelector('.weather-card-prediction-precipitation').textContent = weatherAtAnotherPartOfDay;
                weatherCard.querySelector('.weather-card-prediction-maxtemperature').textContent = "".concat(temperaturAtAnotherPartOfDay.toFixed(0), "\u00B0C");
                weatherCard.querySelector('.weather-card-current-general').textContent = currentWeather;
                weatherCard.querySelector('.weather-card-general-location').textContent = currentLocation;
            }
            return [2 /*return*/];
        });
    });
}
function renderForecastWeather(weatherData) {
    return __awaiter(this, void 0, void 0, function () {
        var weatherCardsContainer;
        return __generator(this, function (_a) {
            try {
                weatherCardsContainer = document.querySelector('.weather-cards-ohter-days');
                if (!weatherCardsContainer) {
                    console.error('Element with class "weather-cards-ohter-days" not found.');
                    return [2 /*return*/];
                }
                weatherCardsContainer.innerHTML = weatherData.map(function (card) { return "\n            <div class=\"next-day-weather-card\">\n                <p class=\"next-day-weather-card-weekday\">".concat(card.weekday, "</p>\n\n                <div class=\"next-day-weather-card-img\">\n                    <img src=\"/images/").concat(card.weatherAtDay, ".png\" alt=\"").concat(card.weatherAtDay, "\" />\n                </div>\n\n                <p class=\"next-day-weather-card-prediction\">").concat(card.weatherAtDay, "</p>\n\n                <div class=\"next-day-weather-card-temperature\">\n                    <p class=\"next-day-weather-card-temperature-part-of-day\">Day</p>\n                    <p class=\"next-day-weather-card-temperature-in-day-night\">").concat(Math.round(card.temperatureAtDay), "&deg;C</p>\n                    <p class=\"next-day-weather-card-temperature-in-day-night\">").concat(Math.round(card.temperatureAtNight), "&deg;C</p>\n                    <p class=\"next-day-weather-card-temperature-part-of-day\">Night</p>\n                </div>\n            </div>\n        "); }).join('');
            }
            catch (error) {
                console.error('Error rendering forecast weather:', error);
            }
            return [2 /*return*/];
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    var searchBtn = document.querySelector('.search-bar-btn');
    var searchBarInput = document.querySelector('.search-bar-input');
    searchBtn.addEventListener('click', function () {
        var location = getLocation();
        updateWeather(location);
    });
    searchBarInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            var location_1 = getLocation();
            updateWeather(location_1);
        }
    });
    updateWeather('Kyiv');
});
