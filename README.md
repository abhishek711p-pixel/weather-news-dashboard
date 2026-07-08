# Weather + News Dashboard

A responsive web dashboard that combines real-time weather updates and latest news in one place — based on the user's location.

Built with vanilla HTML, CSS, and JavaScript as part of a team web development project.

---

## Live Demo

> Coming soon

---

## Features

- Auto-detects user location via browser Geolocation API
- Fetches live weather data (temperature, humidity, wind speed, condition, icon)
- Fetches latest news headlines with category filters
- Manual city search for weather
- Filter news by: Technology, Sports, Business, Health, Entertainment
- Fully responsive — works on mobile, tablet, and desktop
- Loading states and error handling for all API calls

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Structure  | HTML5                   |
| Styling    | CSS3, Flexbox, Grid     |
| Logic      | Vanilla JavaScript (ES6+) |
| Weather API| OpenWeatherMap API      |
| News API   | NewsAPI                 |
| Version Control | Git + GitHub       |

---

## Project Structure

```
weather-news-dashboard/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js        # Main entry point
│   ├── weather.js    # OpenWeather API logic
│   ├── news.js       # NewsAPI logic
│   └── ui.js         # DOM manipulation
├── assets/
│   └── (icons and images)
└── README.md
```

---

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/abhishek711p-pixel/weather-news-dashboard.git
cd weather-news-dashboard
```

2. Get your API keys:
   - OpenWeather: https://openweathermap.org/api
   - NewsAPI: https://newsapi.org

3. Create a `js/config.js` file in the `js/` folder:
```js
const API_KEYS = {
  openWeather: "YOUR_OPENWEATHER_KEY_HERE",
  news: "YOUR_NEWSAPI_KEY_HERE"
};
```

4. Open `index.html` in your browser — no server needed!

> **Note:** `js/config.js` is listed in `.gitignore` — never commit your API keys to GitHub.

---

## Team

| Name | GitHub |
|------|--------|
| Abhishek | [@abhishek711p-pixel](https://github.com/abhishek711p-pixel) |
| Anshu Kumar | [@anshuks-byte](https://github.com/anshuks-byte) |
| Utkarsh Verma | [@vutkarsh957-spec](https://github.com/vutkarsh957-spec) |

---

## Current Status

- [x] Project structure setup
- [x] Repo created and team added
- [x] HTML layout
- [x] CSS styling
- [x] Weather API integration
- [x] News API integration
- [x] Geolocation
- [x] Error handling
- [ ] Responsive design
- [ ] Final testing

---

## License

This project is for educational purposes as part of a web development team assignment.
