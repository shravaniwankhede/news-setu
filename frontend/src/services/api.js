// Determine API Base URL based on environment
// In production (Vercel), we use relative path '/api'
// In development, we use the local backend URL
const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:5001/api' 
      : '/api');

console.log(`[API Service] Using Base URL: ${API_BASE_URL}`);

class ApiService {
  // Generic request method
  async request(endpoint, options = {}) {
    // Ensure endpoint starts with a slash
    const sanitizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${sanitizedEndpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Articles API
  async fetchNews(query = '', category = '', language = 'en', pageSize = 20) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    if (language) params.append('language', language);
    if (pageSize) params.append('pageSize', pageSize);

    return this.request(`/articles/news?${params.toString()}`);
  }

  async getAllArticles() {
    return this.request('/articles');
  }

  async getArticlesByUser(userId) {
    return this.request(`/articles/user/${userId}`);
  }

  async saveArticle(articleData) {
    return this.request('/articles/save', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(articleId) {
    return this.request(`/articles/${articleId}`, {
      method: 'DELETE',
    });
  }

  async getSavedArticlesCount(userId) {
    return this.request(`/articles/count/${userId}`);
  }

  // Analysis API
  async analyzeArticle(text, title = '', source = '') {
    return this.request('/analysis/analyze', {
      method: 'POST',
      body: JSON.stringify({ text, title, source }),
    });
  }

  async generateSummary(text, title = '') {
    return this.request('/analysis/summarize', {
      method: 'POST',
      body: JSON.stringify({ text, title }),
    });
  }

  async getAnalytics() {
    return this.request('/analysis/analytics');
  }

  async translateText(text, targetLang) {
    return this.request('/analysis/translate', {
      method: 'POST',
      body: JSON.stringify({ text, targetLang }),
    });
  }

  async bulkAnalyze(articles) {
    return this.request('/analysis/bulk-analyze', {
      method: 'POST',
      body: JSON.stringify({ articles }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService(); 