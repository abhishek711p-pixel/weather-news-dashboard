class UI {
    showWeatherLoader(loaderId, contentId, errorId) {
        document.getElementById(loaderId).classList.remove('hidden');
        document.getElementById(contentId).classList.add('hidden');
        document.getElementById(errorId).classList.add('hidden');
    }

    hideWeatherLoader(loaderId, contentId, errorId) {
        document.getElementById(loaderId).classList.add('hidden');
        document.getElementById(contentId).classList.remove('hidden');
        document.getElementById(errorId).classList.add('hidden');
    }

    showWeatherError(message, loaderId, contentId, errorId) {
        document.getElementById(loaderId).classList.add('hidden');
        document.getElementById(contentId).classList.add('hidden');
        document.getElementById(errorId).classList.remove('hidden');
        document.getElementById(errorId).textContent = message;
    }

    renderWeather(data, prefix, forecastList = null) {
        document.getElementById(`${prefix}city`).textContent = data.city;
        document.getElementById(`${prefix}temp`).textContent = Math.round(data.temp); 
        document.getElementById(`${prefix}condition`).textContent = data.condition;
        document.getElementById(`${prefix}humidity`).textContent = `${data.humidity}%`;
        document.getElementById(`${prefix}wind`).textContent = `${data.windSpeed} km/h`; 
        
        document.getElementById(`${prefix}high`).textContent = Math.round(data.temp + 2);
        document.getElementById(`${prefix}low`).textContent = Math.round(data.temp - 3);

        const iconMap = {
            'Clear': 'ph-sun',
            'Clouds': 'ph-cloud',
            'Rain': 'ph-cloud-rain',
            'Snow': 'ph-snowflake',
            'Thunderstorm': 'ph-cloud-lightning',
            'Drizzle': 'ph-cloud-drizzle',
            'Mist': 'ph-cloud-fog',
            'Fog': 'ph-cloud-fog',
            'Haze': 'ph-cloud-fog'
        };
        
        const iconClass = iconMap[data.mainCondition] || 'ph-cloud';
        document.getElementById(`${prefix}icon`).className = `ph-fill ${iconClass} w-icon-main`;

        // Dynamic Weather Background Photos
        const bgMap = {
            'Clear': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&q=80&w=800',
            'Clouds': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80&w=800',
            'Rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&q=80&w=800',
            'Snow': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&q=80&w=800',
            'Thunderstorm': 'https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?auto=format&fit=crop&q=80&w=800',
            'Drizzle': 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=800',
            'Mist': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&q=80&w=800',
            'Fog': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&q=80&w=800',
            'Haze': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&q=80&w=800'
        };

        const bgUrl = bgMap[data.mainCondition] || 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80&w=800';
        
        const cityEl = document.getElementById(`${prefix}city`);
        if (cityEl) {
            const cardEl = cityEl.closest('.weather-card');
            if (cardEl) {
                cardEl.style.backgroundImage = `var(--card-overlay), url('${bgUrl}')`;
                cardEl.style.backgroundSize = 'cover';
                cardEl.style.backgroundPosition = 'center';
            }
        }

        // Render 10-day forecast details
        const forecastRow = document.getElementById(`${prefix}forecast-row`);
        if (forecastRow && forecastList) {
            forecastRow.innerHTML = '';
            forecastList.forEach(item => {
                const dayItem = document.createElement('div');
                dayItem.className = 'forecast-day-item';
                
                const dayIconClass = iconMap[item.condition] || 'ph-cloud';
                
                dayItem.innerHTML = `
                    <span class="forecast-day-name">${item.day}</span>
                    <i class="ph-fill ${dayIconClass} forecast-day-icon"></i>
                    <span class="forecast-day-temp">${item.tempMax}° / ${item.tempMin}°</span>
                `;
                forecastRow.appendChild(dayItem);
            });

            const forecastSec = document.getElementById(`${prefix}forecast`);
            if (forecastSec) forecastSec.classList.remove('hidden');
        }
    }

    // --- Modal & Toast Methods ---
    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) modal.classList.remove('hidden');
    }

    hideLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) modal.classList.add('hidden');
    }

    showToastMessage(message, type = 'error') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconClass = type === 'success' ? 'ph-check-circle' : 'ph-warning-circle';
        toast.innerHTML = `<i class="ph-fill ${iconClass}"></i> <span>${message}</span>`;
        
        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    showNewsLoader(loaderId, gridId, errorId) {
        document.getElementById(loaderId).classList.remove('hidden');
        document.getElementById(gridId).classList.add('hidden');
        document.getElementById(errorId).classList.add('hidden');
    }

    hideNewsLoader(loaderId, gridId, errorId) {
        document.getElementById(loaderId).classList.add('hidden');
        document.getElementById(gridId).classList.remove('hidden');
        document.getElementById(errorId).classList.add('hidden');
    }

    showNewsError(message, loaderId, gridId, errorId) {
        document.getElementById(loaderId).classList.add('hidden');
        document.getElementById(gridId).classList.add('hidden');
        document.getElementById(errorId).classList.remove('hidden');
        document.getElementById(errorId).textContent = message;
    }

    renderNews(articles, category, gridId, isBookmarkedFn = null, onBookmarkToggle = null) {
        const grid = document.getElementById(gridId);
        grid.innerHTML = '';

        if (!articles || articles.length === 0) {
            // Re-use showNewsError to show empty state if needed
            this.showNewsError('No articles found.', gridId.replace('grid', 'loader'), gridId, gridId.replace('grid', 'error'));
            return;
        }

        articles.forEach((article) => {
            const timeAgo = `${Math.floor(Math.random() * 5 + 1)}h ago`;
            const imgUrl = article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400';
            const tag = category === 'general' ? 'NEWS' : category;

            // Generate a unique ID for the article (e.g. from its URL)
            const articleId = btoa(article.url || article.title).substring(0, 32);
            article.id = articleId;

            const isBookmarked = isBookmarkedFn ? isBookmarkedFn(articleId) : false;
            const bookmarkIconClass = isBookmarked ? 'ph-fill ph-bookmark-simple' : 'ph ph-bookmark-simple';
            const bookmarkIconColor = isBookmarked ? 'color: var(--accent-blue);' : '';

            const card = document.createElement('a');
            card.className = 'news-card';
            card.href = article.url;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            
            card.innerHTML = `
                <img src="${imgUrl}" alt="News thumbnail" class="news-img" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400'">
                <div class="news-content">
                    <div class="news-tag-row">
                        <span class="news-tag">${tag}</span>
                        <span class="news-time">• ${timeAgo}</span>
                    </div>
                    <h3 class="news-title">${article.title}</h3>
                    <div class="news-footer">
                        <span>${article.source ? article.source.name : 'News'}</span>
                        <div class="bookmark-btn" data-id="${articleId}" style="cursor: pointer; padding: 4px;">
                            <i class="${bookmarkIconClass} bookmark-icon" style="${bookmarkIconColor}"></i>
                        </div>
                    </div>
                </div>
            `;

            // Attach event listener to bookmark button
            const bookmarkBtn = card.querySelector('.bookmark-btn');
            bookmarkBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent navigating to the article
                e.stopPropagation();
                if (onBookmarkToggle) {
                    const currentlyBookmarked = onBookmarkToggle(article);
                    const icon = bookmarkBtn.querySelector('i');
                    if (currentlyBookmarked) {
                        icon.className = 'ph-fill ph-bookmark-simple bookmark-icon';
                        icon.style.color = 'var(--accent-blue)';
                    } else {
                        icon.className = 'ph ph-bookmark-simple bookmark-icon';
                        icon.style.color = '';
                    }
                }
            });

            grid.appendChild(card);
        });
    }
}
