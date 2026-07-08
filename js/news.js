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
                },
                {
                    source: { name: "Science Horizon" },
                    title: "Historic Antarctic Ice Core Reveals Climate Data From 1.5 Million Years Ago",
                    description: "Glaciologists have successfully retrieved an ice core that preserves atmospheric bubbles from the early Pleistocene epoch, shedding new light on historical climate cycles.",
                    url: "https://example.com/ice-core",
                    urlToImage: "https://images.unsplash.com/photo-1516690561799-46d8f74f90f6?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Marine Eco" },
                    title: "Global Conservation Treaty Signed by Over 120 Nations to Protect Oceans",
                    description: "A landmark agreement establishes protected high-seas sanctuaries, aiming to preserve marine biodiversity and halt overfishing across international waters.",
                    url: "https://example.com/ocean-treaty",
                    urlToImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Deep Ocean Journal" },
                    title: "Deep-Sea Expedition Discovers 20 New Marine Species Near Mariana Trench",
                    description: "Oceanographers using advanced remote submersibles have documented previously unknown bioluminescent organisms and hydrothermal vents at extreme depths.",
                    url: "https://example.com/mariana-trench",
                    urlToImage: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400"
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
                },
                {
                    source: { name: "Quantum Computing News" },
                    title: "Quantum Computer Simulates Complex Chemical Bonds at Room Temperature",
                    description: "Researchers have leveraged a 120-qubit processor to model biological catalysts, marking a crucial step toward quantum-accelerated drug design.",
                    url: "https://example.com/quantum-simulation",
                    urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "EV Battery Daily" },
                    title: "New Solid-State Battery Chemistry Promises 1,000-Mile EV Range",
                    description: "An engineering team has developed a ceramic-based solid-state electrolyte that eliminates dendrite growth, doubling current battery density.",
                    url: "https://example.com/solid-state-battery",
                    urlToImage: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Gizmo Trend" },
                    title: "Smart Glasses Integrated with Real-Time Translator Ship Worldwide",
                    description: "A consumer hardware startup has launched lightweight augmented reality glasses capable of translating 40 spoken languages instantly.",
                    url: "https://example.com/smart-glasses",
                    urlToImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Cyber Defender" },
                    title: "Major Cybersecurity Framework Upgraded to Address Post-Quantum Cryptography",
                    description: "In response to advancing quantum capabilities, global security standards have been updated with algorithms resistant to quantum decryption.",
                    url: "https://example.com/quantum-crypto",
                    urlToImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400"
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
                },
                {
                    source: { name: "Athletics Weekly" },
                    title: "New World Record Set in Women's 100m Sprinters Final",
                    description: "Crossing the finish line at an astonishing 10.48 seconds, the sprinter shattered a decades-old record under perfect wind conditions.",
                    url: "https://example.com/sprinters-record",
                    urlToImage: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Velo News" },
                    title: "Cycling Tour: Leader Defends Yellow Jersey in Mountain Stage",
                    description: "Facing grueling climbs and steep descents, the reigning champion held off a series of attacks to retain the overall lead by a narrow margin.",
                    url: "https://example.com/cycling-tour",
                    urlToImage: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Hoops Insider" },
                    title: "Basketball League Announces Extension of International Games",
                    description: "The league has finalized plans to schedule regular-season games in four European cities next year, expanding its global footprint.",
                    url: "https://example.com/hoops-international",
                    urlToImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Gymnastics Nation" },
                    title: "Historic Gold for Gymnast in Individual All-Around Final Event",
                    description: "Executing a flawless routine on the balance beam, the gymnast secured the nation's first individual gold medal in over forty years.",
                    url: "https://example.com/gymnastics-gold",
                    urlToImage: "https://images.unsplash.com/photo-1564069114354-d1a2430ccaaea?auto=format&fit=crop&q=80&w=400"
                }
            ],
            business: [
                {
                    source: { name: "Corporate Digest" },
                    title: "Electric Vehicle Giant Announces Massive Battery Factory Expansion",
                    description: "Plans to build a multi-billion dollar solid-state battery gigafactory have been finalized, expected to double production capacity by 2028.",
                    url: "https://example.com/ev-battery-expansion",
                    urlToImage: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Market Watch" },
                    title: "Tech Stock Rally Drives Major Indexes to Historic All-Time Highs",
                    description: "Surging corporate earnings and robust consumer demand sparked a massive market rally, led primarily by technology and energy sectors.",
                    url: "https://example.com/stocks",
                    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Trade Report" },
                    title: "Global Supply Chain Congestion Eases to Pre-Pandemic Levels",
                    description: "Ocean freight rates have stabilized and port wait times are down significantly, providing substantial relief for retailers ahead of the holidays.",
                    url: "https://example.com/supply-chain-recovery",
                    urlToImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "E-Commerce Pulse" },
                    title: "E-Commerce Pioneer Expands Same-Day Delivery Service to 50 New Regions",
                    description: "Leveraging its new automated sorting centers, the online retail giant has dramatically reduced local transit and shipping delays.",
                    url: "https://example.com/same-day-delivery",
                    urlToImage: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Venture Green" },
                    title: "Renewable Energy Startups Attract Record Venture Capital Funding in Q2",
                    description: "Clean energy technologies, particularly grid storage and green hydrogen systems, pulled in over $12 billion from private equity firms.",
                    url: "https://example.com/green-funding",
                    urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Telecom News" },
                    title: "Major Merger in Telecom Sector Receives Regulatory Antitrust Approval",
                    description: "The federal regulatory commission approved the multi-billion dollar acquisition after both companies agreed to preserve local consumer pricing tiers.",
                    url: "https://example.com/telecom-merger",
                    urlToImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400"
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
                },
                {
                    source: { name: "Genetics Review" },
                    title: "Researchers Identify Key Genetic Marker Linked to Human Longevity",
                    description: "A genome-wide association study of centenarians has isolated a specific variant involved in cellular repair and metabolic maintenance.",
                    url: "https://example.com/longevity-marker",
                    urlToImage: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "BioTech Wire" },
                    title: "FDA Approves First CRISPR Gene-Editing Therapy for Sickle Cell Disease",
                    description: "In a historic ruling, the administration cleared the ex-vivo gene therapy, offering a potential one-time curative treatment for severe patients.",
                    url: "https://example.com/crispr-approval",
                    urlToImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Nutrition Health" },
                    title: "Plant-Based Diet Associated with Lower Risk of Heart Conditions",
                    description: "Analyzing clinical profiles over a ten-year span, researchers observed lower cholesterol levels and reduced arterial inflammation in vegetarian cohorts.",
                    url: "https://example.com/plant-diet-heart",
                    urlToImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Mental Health Monthly" },
                    title: "Virtual Reality Therapy Certified for Treatment of Chronic Pain Management",
                    description: "Clinical guidelines have been updated to support VR cognitive immersion therapy, which decreases patient reliance on prescription painkillers.",
                    url: "https://example.com/vr-pain-therapy",
                    urlToImage: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=400"
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
                },
                {
                    source: { name: "Broadway Herald" },
                    title: "Broadway Revival of Classic Musical Breaks Weekly Box Office Record",
                    description: "Boasting packed houses and stellar critical reviews, the production took in over $3.2 million in ticket sales in its opening week.",
                    url: "https://example.com/broadway-record",
                    urlToImage: "https://images.unsplash.com/photo-1503095391757-111742d4d219?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Showbiz Reporter" },
                    title: "Streaming Platform Greenlights Interactive Animated Series From Top Creator",
                    description: "Following the success of choose-your-own-adventure specials, the platform will finance a full 10-episode interactive animated sci-fi series.",
                    url: "https://example.com/interactive-series",
                    urlToImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Art Pulse" },
                    title: "Modern Art Museum Opens Groundbreaking Digital Art Exhibition",
                    description: "The exhibit features generative installations, interactive projection mapping, and physical computing displays that adapt to attendee movement.",
                    url: "https://example.com/digital-art-exhibition",
                    urlToImage: "https://images.unsplash.com/photo-1531058020387-3be344559be6?auto=format&fit=crop&q=80&w=400"
                },
                {
                    source: { name: "Book Watch" },
                    title: "Bestselling Fantasy Novel Series Adapted into Major Television Franchise",
                    description: "Production studios have announced the casting and screenwriters for the high-budget serialization, scheduled to begin filming next spring.",
                    url: "https://example.com/fantasy-adaptation",
                    urlToImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=400"
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
        const lowerQuery = query.toLowerCase();
        
        // Match category keywords
        if (lowerQuery.includes('tech') || lowerQuery.includes('science') || lowerQuery.includes('computer') || lowerQuery.includes('ai') || lowerQuery.includes('robot') || lowerQuery.includes('software') || lowerQuery.includes('game') || lowerQuery.includes('apple') || lowerQuery.includes('google')) {
            return this.getMockNews('technology');
        }
        if (lowerQuery.includes('sport') || lowerQuery.includes('football') || lowerQuery.includes('soccer') || lowerQuery.includes('tennis') || lowerQuery.includes('olympic') || lowerQuery.includes('race') || lowerQuery.includes('championship')) {
            return this.getMockNews('sports');
        }
        if (lowerQuery.includes('business') || lowerQuery.includes('finance') || lowerQuery.includes('stock') || lowerQuery.includes('market') || lowerQuery.includes('money') || lowerQuery.includes('economy')) {
            return this.getMockNews('business');
        }
        if (lowerQuery.includes('health') || lowerQuery.includes('medical') || lowerQuery.includes('vaccine') || lowerQuery.includes('doctor') || lowerQuery.includes('sleep') || lowerQuery.includes('study')) {
            return this.getMockNews('health');
        }
        if (lowerQuery.includes('movie') || lowerQuery.includes('music') || lowerQuery.includes('film') || lowerQuery.includes('song') || lowerQuery.includes('show') || lowerQuery.includes('award') || lowerQuery.includes('star')) {
            return this.getMockNews('entertainment');
        }

        // Generate customized news results matching the query term
        const titleQuery = query.charAt(0).toUpperCase() + query.slice(1);
        const generated = [
            {
                source: { name: `${titleQuery} Journal` },
                title: `Global Summit Highlights New Initiatives in ${titleQuery} Sector`,
                description: `Leaders and experts gathered at the international forum to outline the future strategy and collaborative frameworks for ${query} advancements.`,
                url: `https://example.com/search/${encodeURIComponent(query)}-summit`,
                urlToImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400"
            },
            {
                source: { name: `Tech & ${titleQuery}` },
                title: `How Modern Technology is Revolutionizing ${titleQuery}`,
                description: `Recent implementation of artificial intelligence and machine learning models has dramatically accelerated workflow efficiency in the field of ${query}.`,
                url: `https://example.com/search/${encodeURIComponent(query)}-tech`,
                urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400"
            },
            {
                source: { name: `${titleQuery} Daily` },
                title: `Market Study: The Rising Economic Value of ${titleQuery}`,
                description: `A comprehensive new report tracks consumer demand and venture capital investment trends, predicting a strong growth trajectory for ${query}.`,
                url: `https://example.com/search/${encodeURIComponent(query)}-market`,
                urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400"
            },
            {
                source: { name: "Citizen Report" },
                title: `Public Debate Rises Over New Policies Regulating ${titleQuery}`,
                description: `Civic groups and industry representatives voice differing viewpoints as local governments begin drafting regulatory compliance frameworks for ${query}.`,
                url: `https://example.com/search/${encodeURIComponent(query)}-policies`,
                urlToImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400"
            },
            {
                source: { name: "Academic Review" },
                title: `University Study Explores the Surprising Historical Roots of ${titleQuery}`,
                description: `Researchers have uncovered fascinating archives and data correlation dating back decades, shedding new light on how ${query} originally evolved.`,
                url: `https://example.com/search/${encodeURIComponent(query)}-history`,
                urlToImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400"
            },
            {
                source: { name: "Future Pulse" },
                title: `What Lies Ahead: Five Predictions for ${titleQuery} Over the Next Decade`,
                description: `Industry analysts share key predictions and milestones expected to shape the implementation and public adoption of ${query} solutions.`,
                url: `https://example.com/search/${encodeURIComponent(query)}-predictions`,
                urlToImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=400"
            }
        ];

        return generated.map(item => ({
            ...item,
            id: btoa(item.url).substring(0, 32),
            author: "MetroSky Search Bot",
            publishedAt: new Date().toISOString()
        }));
    }
}
