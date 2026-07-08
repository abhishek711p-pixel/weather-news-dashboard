class NewsAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://newsapi.org/v2';
    }

    async getNews(category = 'general') {
        if (!this.apiKey || this.apiKey === "YOUR_NEWSAPI_KEY_HERE" || this.apiKey === "YOUR_NEWS_API_KEY" || this.apiKey.includes("YOUR_")) {
            console.log("Using mock news for category:", category);
            return this.getMockNews(category);
        }

        try {
            const response = await fetch(`${this.baseUrl}/top-headlines?country=us&category=${category}&apiKey=${this.apiKey}`);
            
            if (!response.ok) {
                console.warn(`News API call failed with status ${response.status}. Falling back to mock data.`);
                return this.getMockNews(category);
            }

            const data = await response.json();
            return data.articles.filter(article => article.title !== '[Removed]');
        } catch (error) {
            console.error("NewsAPI Error, falling back to mock data:", error);
            return this.getMockNews(category);
        }
    }

    async searchNews(query) {
        if (!this.apiKey || this.apiKey === "YOUR_NEWSAPI_KEY_HERE" || this.apiKey === "YOUR_NEWS_API_KEY" || this.apiKey.includes("YOUR_")) {
            console.log("Using mock news for search query:", query);
            return this.getMockSearchNews(query);
        }

        try {
            const response = await fetch(`${this.baseUrl}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${this.apiKey}`);
            
            if (!response.ok) {
                console.warn(`News API search failed with status ${response.status}. Falling back to mock data.`);
                return this.getMockSearchNews(query);
            }

            const data = await response.json();
            return data.articles.filter(article => article.title !== '[Removed]');
        } catch (error) {
            console.error("NewsAPI Error, falling back to mock data:", error);
            return this.getMockSearchNews(query);
        }
    }

    getMockNews(category = 'general') {
        const demoArticles = {
            general: [
                {
                    source: { name: "Global News" },
                    title: "Pioneering Fusion Reactor Reaches Net Energy Gain in Milestone Test",
                    description: "Physicists have achieved a sustained net energy gain in a magnetic confinement fusion reactor, bringing clean, limitless energy one step closer to reality.",
                    url: "https://example.com/fusion",
                    urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Metro Tech" },
                    title: "Neural Interface Receives FDA Clearance for Human Trials",
                    description: "A leading neurotech startup has received clearance to begin clinical trials on its wireless brain-computer interface aimed at restoring mobility.",
                    url: "https://example.com/neuro",
                    urlToImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Daily Finance" },
                    title: "Central Banks Coordinate Rate Cuts Amid Easing Global Inflation",
                    description: "In a joint decision, major central banks lowered interest rates to stabilize markets as inflation figures return to target ranges.",
                    url: "https://example.com/finance",
                    urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400"
                }
            ],
            technology: [
                {
                    source: { name: "Silicon Valley Hub" },
                    title: "Autonomous Delivery Drone Network Launches in Major Cities",
                    description: "An FAA-approved delivery drone fleet has begun commercial operations, promising package deliveries within 15 minutes of ordering.",
                    url: "https://example.com/drones",
                    urlToImage: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "AI Insider" },
                    title: "Open-Source LLM Outperforms Proprietary Models on Reasoning Benchmarks",
                    description: "A new lightweight, open-source language model trained on curated synthetic reasoning datasets has set new state-of-the-art benchmarks.",
                    url: "https://example.com/ai-model",
                    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=400"
                }
            ],
            sports: [
                {
                    source: { name: "Championship Sports" },
                    title: "Underdog Wins Grand Slam Final in Thrilling Five-Set Comeback",
                    description: "In one of the greatest tennis finals in history, the unseeded challenger rallied from two sets down to capture the Grand Slam trophy.",
                    url: "https://example.com/tennis",
                    urlToImage: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "World Football" },
                    title: "Golden Boot Race Intensifies as Semifinals Approach",
                    description: "With spectacular individual performances, the tournament's top goalscorers are separated by just a single goal heading into the semis.",
                    url: "https://example.com/football",
                    urlToImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400"
                }
            ],
            business: [
                {
                    source: { name: "Corporate Digest" },
                    title: "Electric Vehicle Giant Announces Massive Battery Factory Expansion",
                    description: "Plans to build a multi-billion dollar solid-state battery gigafactory have been finalized, expected to double production capacity by 2028.",
                    url: "https://example.com/ev-battery",
                    urlToImage: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Market Watch" },
                    title: "Tech Stock Rally Drives Major Indexes to Historic All-Time Highs",
                    description: "Surging corporate earnings and robust consumer demand sparked a massive market rally, led primarily by technology and energy sectors.",
                    url: "https://example.com/stocks",
                    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400"
                }
            ],
            health: [
                {
                    source: { name: "Medical Research Journal" },
                    title: "New Immunotherapy Vaccine Shows Promising Results in Melanoma Study",
                    description: "An experimental mRNA vaccine tailored to patient tumor profiles has successfully prevented cancer recurrence in a phase II clinical trial.",
                    url: "https://example.com/melanoma-vaccine",
                    urlToImage: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Wellness Network" },
                    title: "Large-Scale Study Confirms Benefits of Consistent Circadian Sleep Cycles",
                    description: "Tracking over 100,000 adults, researchers found that regular sleep schedules reduce cardiovascular disease risks by over 30%.",
                    url: "https://example.com/sleep-study",
                    urlToImage: "https://images.unsplash.com/photo-1511295742364-927d44d60244?auto=format&fit=crop&q=80&w=400"
                }
            ],
            entertainment: [
                {
                    source: { name: "Hollywood Review" },
                    title: "Acclaimed Sci-Fi Epic Sweeps Annual Film Awards",
                    description: "The visually stunning cinematic sequel dominated the awards ceremony, winning Best Picture, Best Director, and multiple technical categories.",
                    url: "https://example.com/awards",
                    urlToImage: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Music Pulse" },
                    title: "Indie Pop Artist Dominates Streaming Charts with Surprise Album Release",
                    description: "Released without prior promotion, the artist's fourth studio album has broken single-day global streaming records across major platforms.",
                    url: "https://example.com/surprise-album",
                    urlToImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400"
                }
            ]
        };

        const list = demoArticles[category.toLowerCase()] || demoArticles.general;
        return list.map(item => ({
            ...item,
            id: btoa(item.url).substring(0, 32),
            author: "MetroSky Staff",
            publishedAt: new Date().toISOString()
        }));
    }

    getMockSearchNews(query) {
        const mockNews = this.getMockNews('general');
        return mockNews.map(item => ({
            ...item,
            title: `[Search: ${query}] ${item.title}`
        }));
    }
}
