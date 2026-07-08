class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }

    async getWeatherByCity(city) {
        if (!this.apiKey || this.apiKey === "YOUR_OPENWEATHER_KEY_HERE" || this.apiKey === "YOUR_OPENWEATHER_API_KEY" || this.apiKey.includes("YOUR_")) {
            console.log("Using mock weather for city:", city);
            return this.getMockWeather(city);
        }

        try {
            const response = await fetch(`${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`);
            
            if (!response.ok) {
                console.warn(`Weather API call failed with status ${response.status}. Falling back to mock data.`);
                return this.getMockWeather(city);
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
            console.error("OpenWeather API Error, falling back to mock data:", error);
            return this.getMockWeather(city);
        }
    }

    async getWeatherByCoords(lat, lon) {
        if (!this.apiKey || this.apiKey === "YOUR_OPENWEATHER_KEY_HERE" || this.apiKey === "YOUR_OPENWEATHER_API_KEY" || this.apiKey.includes("YOUR_")) {
            console.log("Using mock weather for coordinates.");
            return this.getMockWeatherCoords(lat, lon);
        }

        try {
            const response = await fetch(`${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`);
            
            if (!response.ok) {
                console.warn(`Weather API call failed with status ${response.status}. Falling back to mock data.`);
                return this.getMockWeatherCoords(lat, lon);
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
            console.error("OpenWeather API Error, falling back to mock data:", error);
            return this.getMockWeatherCoords(lat, lon);
        }
    }

    formatCondition(condition) {
        return condition.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    async getForecastByCity(city) {
        if (!this.apiKey || this.apiKey === "YOUR_OPENWEATHER_KEY_HERE" || this.apiKey === "YOUR_OPENWEATHER_API_KEY" || this.apiKey.includes("YOUR_")) {
            console.log("Using mock forecast for city:", city);
            return this.getMockForecast(city);
        }

        const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
        try {
            const response = await fetch(`${baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`);
            if (!response.ok) {
                console.warn(`Forecast API call failed with status ${response.status}. Falling back to mock data.`);
                return this.getMockForecast(city);
            }
            const data = await response.json();
            return this.parseForecast(data);
        } catch (error) {
            console.error("OpenWeather Forecast Error, falling back to mock data:", error);
            return this.getMockForecast(city);
        }
    }

    getMockWeather(city = 'San Francisco') {
        const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const tempBase = 12 + (hash % 15);
        const humidity = 50 + (hash % 40);
        const windSpeed = 3 + (hash % 15);
        
        const conditions = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Mist'];
        const mainCondition = conditions[hash % conditions.length];
        
        const descriptions = {
            'Clear': 'clear sky',
            'Clouds': 'broken clouds',
            'Rain': 'moderate rain',
            'Drizzle': 'light intensity drizzle',
            'Mist': 'mist'
        };

        return {
            city: city.charAt(0).toUpperCase() + city.slice(1) + " (Demo)",
            temp: tempBase,
            condition: this.formatCondition(descriptions[mainCondition]),
            mainCondition: mainCondition,
            humidity: humidity,
            windSpeed: Math.round(windSpeed * 10) / 10
        };
    }

    getMockWeatherCoords(lat, lon) {
        return {
            city: "Current Location (Demo)",
            temp: 16.5,
            condition: "Partly Cloudy",
            mainCondition: "Clouds",
            humidity: 72,
            windSpeed: 8.5
        };
    }

    getMockForecast(city = 'San Francisco') {
        const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const tempBase = 12 + (hash % 15);
        
        const conditions = ['Clear', 'Clouds', 'Rain', 'Clouds', 'Clear'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const today = new Date();
        const dailyForecasts = [];
        
        for (let i = 1; i <= 5; i++) {
            const nextDate = new Date();
            nextDate.setDate(today.getDate() + i);
            const dayName = days[nextDate.getDay()];
            
            const condition = conditions[(hash + i) % conditions.length];
            const tempVariationMax = (hash + i) % 4 - 1;
            const tempVariationMin = (hash - i) % 4 - 3;
            
            dailyForecasts.push({
                day: dayName,
                tempMax: Math.round(tempBase + tempVariationMax + 2),
                tempMin: Math.round(tempBase + tempVariationMin - 2),
                condition: condition,
                description: condition === 'Clear' ? 'clear sky' : 'clouds'
            });
        }
        return dailyForecasts;
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
