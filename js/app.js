// Centralized API Keys
const API_KEYS = {
    openWeather: "YOUR_OPENWEATHER_API_KEY",
    news: "YOUR_NEWS_API_KEY"
};

// Bookmarks Manager
class BookmarksManager {
    constructor(authManager) {
        this.authManager = authManager;
    }

    _getStorageKey() {
        const user = this.authManager.user;
        return user ? `news_bookmarks_${user.email}` : null;
    }

    getBookmarks() {
        const key = this._getStorageKey();
        if (!key) return [];
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    isBookmarked(articleId) {
        return this.getBookmarks().some(b => b.id === articleId);
    }

    toggleBookmark(article) {
        const key = this._getStorageKey();
        if (!key) return false;

        const bookmarks = this.getBookmarks();
        const index = bookmarks.findIndex(b => b.id === article.id);
        
        if (index > -1) {
            bookmarks.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(bookmarks));
            return false;
        } else {
            bookmarks.push(article);
            localStorage.setItem(key, JSON.stringify(bookmarks));
            return true;
        }
    }
}

class AuthManager {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('news_user')) || null;
        this.usersDb = JSON.parse(localStorage.getItem('news_users_db')) || {};
    }

    isLoggedIn() {
        return this.user !== null;
    }

    login(email, password) {
        // Mock authentication with persistent passwords
        if (!this.usersDb[email]) {
            // First time logging in with this email, save the password
            this.usersDb[email] = password;
            localStorage.setItem('news_users_db', JSON.stringify(this.usersDb));
        } else {
            // Email exists, verify password matches
            if (this.usersDb[email] !== password) {
                throw new Error("Incorrect password for this email.");
            }
        }

        this.user = { email: email };
        localStorage.setItem('news_user', JSON.stringify(this.user));
    }

    logout() {
        this.user = null;
        localStorage.removeItem('news_user');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const weatherAPI = new WeatherAPI("");
    const newsAPI = new NewsAPI("");
    const authManager = new AuthManager();
    const bookmarksManager = new BookmarksManager(authManager);

    function getAPIKeys() {
        const isDemo = localStorage.getItem('metrosky_demo_mode') === 'true';
        if (isDemo) {
            return {
                openWeather: "YOUR_OPENWEATHER_API_KEY",
                news: "YOUR_NEWS_API_KEY"
            };
        }
        return {
            openWeather: localStorage.getItem('openweather_api_key') || API_KEYS.openWeather,
            news: localStorage.getItem('news_api_key') || API_KEYS.news
        };
    }

    function refreshAPIInstances(showToast = false) {
        const keys = getAPIKeys();
        weatherAPI.apiKey = keys.openWeather;
        newsAPI.apiKey = keys.news;

        const isDemo = localStorage.getItem('metrosky_demo_mode') === 'true' || 
                       keys.openWeather.includes("YOUR_") || 
                       keys.news.includes("YOUR_");

        if (isDemo && showToast) {
            setTimeout(() => {
                ui.showToastMessage("Running in Demo Mode (simulated data). Configure live keys in settings.", "success");
            }, 1000);
        }
    }

    refreshAPIInstances(true);

    // Callbacks for UI
    const isBookmarkedFn = (id) => bookmarksManager.isBookmarked(id);
    const onBookmarkToggle = (article) => {
        if (!authManager.isLoggedIn()) {
            ui.showToastMessage("Please log in to save articles.", "error");
            ui.showLoginModal();
            return false; // Prevent toggling
        }
        return bookmarksManager.toggleBookmark(article);
    };

    // ==========================================
    // AUTH LOGIC
    // ==========================================
    const loginForm = document.getElementById('login-form');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const profileBtn = document.querySelector('.profile-btn');

    // Update Profile Button appearance
    function updateProfileBtn() {
        if (authManager.isLoggedIn()) {
            profileBtn.innerHTML = '<i class="ph-fill ph-user-check" style="color: var(--accent-blue);"></i>';
            profileBtn.title = "Sign Out";
        } else {
            profileBtn.innerHTML = '<i class="ph ph-user-circle"></i>';
            profileBtn.title = "Sign In";
        }
    }
    updateProfileBtn();

    function refreshBookmarkIcons() {
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            const id = btn.getAttribute('data-id');
            const isBookmarked = bookmarksManager.isBookmarked(id);
            const icon = btn.querySelector('i');
            if (isBookmarked) {
                icon.className = 'ph-fill ph-bookmark-simple bookmark-icon';
                icon.style.color = 'var(--accent-blue)';
            } else {
                icon.className = 'ph ph-bookmark-simple bookmark-icon';
                icon.style.color = '';
            }
        });
    }

    profileBtn.addEventListener('click', () => {
        if (authManager.isLoggedIn()) {
            authManager.logout();
            ui.showToastMessage("You have been signed out.", "success");
            updateProfileBtn();
            refreshBookmarkIcons();
        } else {
            ui.showLoginModal();
        }
    });

    closeModalBtn.addEventListener('click', () => ui.hideLoginModal());

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            authManager.login(email, password);
            ui.hideLoginModal();
            ui.showToastMessage(`Welcome back, ${email.split('@')[0]}!`, "success");
            updateProfileBtn();
            refreshBookmarkIcons();
            loginForm.reset();
        } catch (error) {
            ui.showToastMessage(error.message, "error");
        }
    });

    // ==========================================
    // THEME LOGIC
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');

    function updateThemeIcon() {
        if (document.documentElement.classList.contains('dark-mode')) {
            themeIcon.className = 'ph-fill ph-sun';
            themeIcon.style.color = '#fbbf24';
        } else {
            themeIcon.className = 'ph ph-moon';
            themeIcon.style.color = '';
        }
    }
    
    updateThemeIcon();

    // Dynamic Compare page background photos
    window.compareCond1 = null;
    window.compareCond2 = null;

    function updateCompareBackground(condition1 = null, condition2 = null) {
        if (!document.body.classList.contains('compare-theme')) return;
        
        const bgMap = {
            'Clear': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&q=80&w=1600',
            'Clouds': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80&w=1600',
            'Rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&q=80&w=1600',
            'Snow': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&q=80&w=1600',
            'Thunderstorm': 'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?auto=format&fit=crop&q=80&w=1600',
            'Drizzle': 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=1600',
            'Mist': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&q=80&w=1600',
            'Fog': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&q=80&w=1600',
            'Haze': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&q=80&w=1600'
        };

        const isDark = document.documentElement.classList.contains('dark-mode');
        const overlay = isDark
            ? 'linear-gradient(rgba(8, 12, 20, 0.8), rgba(8, 12, 20, 0.88))'
            : 'linear-gradient(rgba(255, 255, 255, 0.55), rgba(241, 245, 249, 0.8))';

        let chosenCond = condition1 || condition2;
        let bgUrl = chosenCond ? bgMap[chosenCond] : null;
        if (!bgUrl) {
            bgUrl = 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80&w=1600';
        }

        document.body.style.backgroundImage = `${overlay}, url('${bgUrl}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }

    function updateNewsBackground() {
            if (!document.body.classList.contains('news-theme')) return;

            const isDark = document.documentElement.classList.contains('dark-mode');
            const overlay = isDark
                ? 'linear-gradient(rgba(8, 12, 20, 0.82), rgba(8, 12, 20, 0.9))'
                : 'linear-gradient(rgba(255, 255, 255, 0.6), rgba(241, 245, 249, 0.82))';

            const bgUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600';

            document.body.style.backgroundImage = `${overlay}, url('${bgUrl}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
        }

        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            const isDark = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('metrosky_theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
            if (document.body.classList.contains('compare-theme')) {
                updateCompareBackground(window.compareCond1, window.compareCond2);
            } else if (document.body.classList.contains('news-theme')) {
                updateNewsBackground();
            }
        });

        // ==========================================
        // API SETTINGS MODAL LOGIC
        // ==========================================
        const settingsBtn = document.getElementById('settings-btn');
        const settingsModal = document.getElementById('settings-modal');
        const closeSettingsBtn = document.getElementById('close-settings-btn');
        const settingsForm = document.getElementById('settings-form');
        const weatherKeyInput = document.getElementById('settings-weather-key');
        const newsKeyInput = document.getElementById('settings-news-key');
        const demoModeCheckbox = document.getElementById('settings-demo-mode');

        settingsBtn.addEventListener('click', () => {
            // Load current saved settings into form
            weatherKeyInput.value = localStorage.getItem('openweather_api_key') || "";
            newsKeyInput.value = localStorage.getItem('news_api_key') || "";
            demoModeCheckbox.checked = localStorage.getItem('metrosky_demo_mode') === 'true';
            ui.showSettingsModal();
        });

        closeSettingsBtn.addEventListener('click', () => ui.hideSettingsModal());

        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const weatherKey = weatherKeyInput.value.trim();
            const newsKey = newsKeyInput.value.trim();
            const demoMode = demoModeCheckbox.checked;

            if (weatherKey) {
                localStorage.setItem('openweather_api_key', weatherKey);
            } else {
                localStorage.removeItem('openweather_api_key');
            }

            if (newsKey) {
                localStorage.setItem('news_api_key', newsKey);
            } else {
                localStorage.removeItem('news_api_key');
            }

            localStorage.setItem('metrosky_demo_mode', demoMode);

            ui.hideSettingsModal();
            ui.showToastMessage("Settings saved! Refreshing dashboard...", "success");

            // Apply new keys and reload dashboard
            refreshAPIInstances(false);
            loadHomeWeather();
            loadHomeNews();
        });

        // ==========================================
        // 1. SPA ROUTING LOGIC
        // ==========================================
        const navItems = document.querySelectorAll('.nav-item');
        const views = document.querySelectorAll('.spa-view');
        const headerTitle = document.getElementById('header-title');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-target');
                if (!targetId) return;

                document.querySelectorAll('#main-nav .nav-item').forEach(nav => nav.classList.remove('active'));
                const mainNavBtn = document.querySelector(`#main-nav .nav-item[data-target="${targetId}"]`);
                if (mainNavBtn) mainNavBtn.classList.add('active');

                views.forEach(view => view.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');

                switch (targetId) {
                    case 'view-home': headerTitle.textContent = "MetroSky"; break;
                    case 'view-compare': headerTitle.textContent = "Compare Cities"; break;
                    case 'view-news': headerTitle.textContent = "News Explorer"; break;
                    case 'view-search': headerTitle.textContent = "MetroSky Search"; break;
                }

                // Reset background themes
                document.body.classList.remove('compare-theme', 'news-theme');
                document.body.style.backgroundImage = '';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundAttachment = '';

                if (targetId === 'view-compare') {
                    document.body.classList.add('compare-theme');
                    updateCompareBackground(window.compareCond1, window.compareCond2);
                } else if (targetId === 'view-news') {
                    document.body.classList.add('news-theme');
                    updateNewsBackground();
                }

                if (targetId === 'view-news' && !window.newsLoaded) {
                    fetchCategoryNews('general');
                    window.newsLoaded = true;
                }
                if (targetId === 'view-search' && !window.searchNewsLoaded) {
                    fetchSearchDefaultNews();
                    window.searchNewsLoaded = true;
                }
            });
        });

        document.querySelector('.view-all-link').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(`#main-nav .nav-item[data-target="view-news"]`).click();
        });

        const headerBookmarksBtn = document.getElementById('header-bookmarks-btn');
        if (headerBookmarksBtn) {
            headerBookmarksBtn.addEventListener('click', () => {
                // Navigate to dedicated bookmarks view
                document.querySelectorAll('#main-nav .nav-item').forEach(nav => nav.classList.remove('active'));
                views.forEach(view => view.classList.remove('active'));

                const bookmarksView = document.getElementById('view-bookmarks');
                if (bookmarksView) bookmarksView.classList.add('active');
                headerTitle.textContent = "Saved Articles";

                // Reset backgrounds
                document.body.classList.remove('compare-theme', 'news-theme');
                document.body.style.backgroundImage = '';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundAttachment = '';

                loadBookmarksView();
            });
        }

        const bookmarksHomeBtn = document.getElementById('bookmarks-home-btn');
        if (bookmarksHomeBtn) {
            bookmarksHomeBtn.addEventListener('click', () => {
                document.querySelector(`#main-nav .nav-item[data-target="view-home"]`).click();
            });
        }

        function loadBookmarksView() {
            ui.showNewsLoader('bookmarks-page-loader', 'bookmarks-page-grid', 'bookmarks-page-error');
            const articles = bookmarksManager.getBookmarks();
            ui.renderNews(articles, 'bookmarks', 'bookmarks-page-grid', isBookmarkedFn, (article) => {
                const bookmarked = onBookmarkToggle(article);
                if (!bookmarked) {
                    loadBookmarksView(); // re-render to remove from view
                }
                return bookmarked;
            });
            ui.hideNewsLoader('bookmarks-page-loader', 'bookmarks-page-grid', 'bookmarks-page-error');
        }

        // ==========================================
        // 2. HOME VIEW LOGIC
        // ==========================================
        async function loadHomeWeather() {
            ui.showWeatherLoader('home-weather-loader', 'home-weather-content', 'home-weather-error');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const data = await weatherAPI.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                            ui.renderWeather(data, 'w-');
                            ui.hideWeatherLoader('home-weather-loader', 'home-weather-content', 'home-weather-error');
                        } catch (error) {
                            fallbackHomeWeather();
                        }
                    },
                    () => { fallbackHomeWeather(); },
                    { timeout: 5000 }
                );
            } else {
                fallbackHomeWeather();
            }
        }

        async function fallbackHomeWeather() {
            try {
                const data = await weatherAPI.getWeatherByCity('San Francisco');
                ui.renderWeather(data, 'w-');
                ui.hideWeatherLoader('home-weather-loader', 'home-weather-content', 'home-weather-error');
            } catch (error) {
                ui.showWeatherError(error.message, 'home-weather-loader', 'home-weather-content', 'home-weather-error');
            }
        }

        async function loadHomeNews() {
            ui.showNewsLoader('home-news-loader', 'home-news-grid', 'home-news-error');
            try {
                const articles = await newsAPI.getNews('general');
                ui.renderNews(articles.slice(0, 12), 'general', 'home-news-grid', isBookmarkedFn, onBookmarkToggle);
                ui.hideNewsLoader('home-news-loader', 'home-news-grid', 'home-news-error');
            } catch (error) {
                ui.showNewsError("Could not load news.", 'home-news-loader', 'home-news-grid', 'home-news-error');
            }
        }

        loadHomeWeather();
        loadHomeNews();

        // ==========================================
        // 3. COMPARE VIEW LOGIC
        // ==========================================
        const compareForm = document.getElementById('compare-form');
        compareForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const city1 = document.getElementById('city1-input').value.trim();
            const city2 = document.getElementById('city2-input').value.trim();
            if (!city1 || !city2) return;

            const loader = document.getElementById('compare-loader');
            const errorDiv = document.getElementById('compare-error');
            const results = document.getElementById('compare-results');

            loader.classList.remove('hidden');
            results.classList.add('hidden');
            errorDiv.classList.add('hidden');

            try {
                const [data1, data2, forecast1, forecast2] = await Promise.all([
                    weatherAPI.getWeatherByCity(city1),
                    weatherAPI.getWeatherByCity(city2),
                    weatherAPI.getForecastByCity(city1),
                    weatherAPI.getForecastByCity(city2)
                ]);
                ui.renderWeather(data1, 'c1-', forecast1);
                ui.renderWeather(data2, 'c2-', forecast2);

                window.compareCond1 = data1.mainCondition;
                window.compareCond2 = data2.mainCondition;
                updateCompareBackground(data1.mainCondition, data2.mainCondition);

                loader.classList.add('hidden');
                results.classList.remove('hidden');
            } catch (error) {
                loader.classList.add('hidden');
                errorDiv.textContent = "Error: Could not find one or both cities. Please check your spelling.";
                errorDiv.classList.remove('hidden');
            }
        });

        // ==========================================
        // 4. NEWS VIEW LOGIC
        // ==========================================
        const newsPills = document.querySelectorAll('#category-container .pill');
        const newsSearchForm = document.getElementById('news-search-form');
        const newsSearchInput = document.getElementById('news-search-input');

        newsPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                newsPills.forEach(p => p.classList.remove('active'));
                e.currentTarget.classList.add('active');
                newsSearchInput.value = '';
                fetchCategoryNews(e.currentTarget.getAttribute('data-category'));
            });
        });

        newsSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = newsSearchInput.value.trim();
            if (!query) return;
            newsPills.forEach(p => p.classList.remove('active'));
            fetchSearchNews(query);
        });

        async function fetchCategoryNews(category) {
            ui.showNewsLoader('news-page-loader', 'news-page-grid', 'news-page-error');

            try {
                const articles = await newsAPI.getNews(category);
                ui.renderNews(articles, category, 'news-page-grid', isBookmarkedFn, onBookmarkToggle);
                ui.hideNewsLoader('news-page-loader', 'news-page-grid', 'news-page-error');
            } catch (error) {
                ui.showNewsError(error.message, 'news-page-loader', 'news-page-grid', 'news-page-error');
            }
        }

        async function fetchSearchNews(query) {
            ui.showNewsLoader('news-page-loader', 'news-page-grid', 'news-page-error');
            try {
                const articles = await newsAPI.searchNews(query);
                ui.renderNews(articles, 'SEARCH', 'news-page-grid', isBookmarkedFn, onBookmarkToggle);
                ui.hideNewsLoader('news-page-loader', 'news-page-grid', 'news-page-error');
            } catch (error) {
                ui.showNewsError(error.message, 'news-page-loader', 'news-page-grid', 'news-page-error');
            }
        }

        // ==========================================
        // 5. SEARCH VIEW LOGIC
        // ==========================================
        const weatherSearchForm = document.getElementById('weather-search-form');
        const weatherSearchInput = document.getElementById('weather-search-input');

        weatherSearchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = weatherSearchInput.value.trim();
            if (!query) return;

            ui.showWeatherLoader('search-weather-loader', 'search-weather-content', 'search-weather-error');
            try {
                const data = await weatherAPI.getWeatherByCity(query);
                ui.renderWeather(data, 'sw-');
                ui.hideWeatherLoader('search-weather-loader', 'search-weather-content', 'search-weather-error');
            } catch (error) {
                ui.showWeatherError(error.message, 'search-weather-loader', 'search-weather-content', 'search-weather-error');
            }
        });

        async function fetchSearchDefaultNews() {
            ui.showNewsLoader('search-news-loader', 'search-news-grid', 'search-news-error');
            try {
                const articles = await newsAPI.getNews('general');
                ui.renderNews(articles, 'general', 'search-news-grid', isBookmarkedFn, onBookmarkToggle);
                ui.hideNewsLoader('search-news-loader', 'search-news-grid', 'search-news-error');
            } catch (error) {
                ui.showNewsError("Could not load background news.", 'search-news-loader', 'search-news-grid', 'search-news-error');
            }
        }
});
