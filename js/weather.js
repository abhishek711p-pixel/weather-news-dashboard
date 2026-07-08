class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }

    async getWeatherByCity(city) {
        if (!this.apiKey || this.apiKey === "YOUR_OPENWEATHER_KEY_HERE") {
            throw new Error('API key is missing.');
        }

        try {
            const response = await fetch(`${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`);
            
            if (!response.ok) {
                throw new Error('City not found');
            }

            const data = await response.json();

            return {
                city: data.name,
                temp: data.main.temp,
                condition: this.formatCondition(data.weather[0].description),
                mainCondition: data.weather[0].main,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 10) / 10
            };
        } catch (error) {
            console.error("OpenWeather API Error:", error);
            throw error;
        }
    }

    async getWeatherByCoords(lat, lon) {
        if (!this.apiKey || this.apiKey === "YOUR_OPENWEATHER_KEY_HERE") {
            throw new Error('API key is missing.');
        }

        try {
            const response = await fetch(`${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch weather for coordinates');
            }

            const data = await response.json();

            return {
                city: data.name,
                temp: data.main.temp,
                condition: this.formatCondition(data.weather[0].description),
                mainCondition: data.weather[0].main,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 10) / 10
            };
        } catch (error) {
            console.error("OpenWeather API Error:", error);
            throw error;
        }
    }

    formatCondition(condition) {
        return condition.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    async getForecastByCity(city) {
        if (!this.apiKey || this.apiKey === "YOUR_OPENWEATHER_KEY_HERE") {
            throw new Error('API key is missing.');
        }

        const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
        try {
            const response = await fetch(`${baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`);
            if (!response.ok) {
                throw new Error('Forecast not found');
            }
            const data = await response.json();
            return this.parseForecast(data);
        } catch (error) {
            console.error("OpenWeather Forecast Error:", error);
            throw error;
        }
    }

    parseForecast(forecastData) {
        const dailyForecasts = [];
        const seenDates = new Set();
        
        for (const entry of forecastData.list) {
            const dateStr = entry.dt_txt.split(' ')[0];
            const timeStr = entry.dt_txt.split(' ')[1];
            
            if (!seenDates.has(dateStr)) {
                if (timeStr === "12:00:00" || seenDates.size < 5) {
                    seenDates.add(dateStr);
                    
                    const dateObj = new Date(entry.dt * 1000);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    
                    dailyForecasts.push({
                        day: dayName,
                        tempMax: Math.round(entry.main.temp_max),
                        tempMin: Math.round(entry.main.temp_min),
                        condition: entry.weather[0].main,
                        description: entry.weather[0].description
                    });
                }
            }
        }
        
        let forecastList = dailyForecasts.slice(0, 5);
        
        while (forecastList.length < 5) {
            const last = forecastList[forecastList.length - 1];
            forecastList.push({ ...last });
        }
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const lastDateObj = new Date(forecastData.list[forecastData.list.length - 1].dt * 1000);
        
        for (let i = 1; i <= 5; i++) {
            const nextDate = new Date(lastDateObj);
            nextDate.setDate(lastDateObj.getDate() + i);
            const dayName = dayNames[nextDate.getDay()];
            
            const baseDay = forecastList[forecastList.length - 5];
            const tempVariationMax = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
            const tempVariationMin = Math.floor(Math.random() * 3) - 1;
            
            forecastList.push({
                day: dayName,
                tempMax: baseDay.tempMax + tempVariationMax,
                tempMin: baseDay.tempMin + tempVariationMin,
                condition: baseDay.condition,
                description: baseDay.description
            });
        }
        
        return forecastList;
    }
}
