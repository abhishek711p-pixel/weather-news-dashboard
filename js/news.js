class NewsAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://newsapi.org/v2';
    }

    async getNews(category = 'general') {
        if (!this.apiKey || this.apiKey === "YOUR_NEWSAPI_KEY_HERE") {
            throw new Error('NewsAPI key is missing.');
        }

        try {
            const response = await fetch(`${this.baseUrl}/top-headlines?country=us&category=${category}&apiKey=${this.apiKey}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch news from NewsAPI');
            }

            const data = await response.json();
            
            return data.articles.filter(article => article.title !== '[Removed]');
        } catch (error) {
            console.error("NewsAPI Error:", error);
            throw error;
        }
    }

    async searchNews(query) {
        if (!this.apiKey || this.apiKey === "YOUR_NEWSAPI_KEY_HERE") {
            throw new Error('NewsAPI key is missing.');
        }

        try {
            const response = await fetch(`${this.baseUrl}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${this.apiKey}`);
            
            if (!response.ok) {
                throw new Error('Failed to search news from NewsAPI');
            }

            const data = await response.json();
            return data.articles.filter(article => article.title !== '[Removed]');
        } catch (error) {
            console.error("NewsAPI Error:", error);
            throw error;
        }
    }
}
