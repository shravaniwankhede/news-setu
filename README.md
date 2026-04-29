# Newsetu 📰

**The intelligent lens for the next billion news consumers.**

Newsetu is a multilingual, AI-powered news aggregator designed to solve the biggest challenges in digital media: **bias, misinformation, and language barriers.** We don’t just collect news—we enrich it with transparency and accessibility.

---

## 🌍 The Problem We Solve
In a world flooded with fragmented information, Newsetu brings clarity to digital news consumption. We cut through echo chambers, break down regional barriers, and enable informed decision-making by showing users the "why" behind the headlines.

## ✨ Core Features

### 🧠 AI Intelligence Layer
* **Bias Detection Engine:** Custom-built to identify political leanings and the emotional tone of every article.
* **Smart Summarization:** Instant, high-context summaries to save time without losing the story.
* **Multilingual Support:** Real-time translation that brings regional voices into global focus.

### ♿ Accessibility & Inclusion
* **Text-to-Speech (TTS):** Designed for the visually impaired and users on-the-go.
* **Inclusive Design:** Making complex news smarter, more honest, and accessible to everyone, regardless of language or ability.

### 🛠 Technical Overview
- **Frontend**: React + Vite application.
- **Backend**: Node.js + Express server.
- **AI**: Integration with Together AI and OpenAI for analysis.
- **Aggregation**: Powered by **NewsAPI** to pull diverse global sources.

---

## 🚀 Getting Started

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shravaniwankhede/news-setu.git
   cd news-setu
   ```

2. **Install dependencies**:
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**:
   Create a `.env` file in the `backend/` directory (see `backend/.env.example` for reference).

4. **Run the project**:
   - Backend: `npm start --prefix backend`
   - Frontend: `npm run dev --prefix frontend`

### Production Deployment

This project is configured for easy deployment on platforms like Render or Heroku.

1. **Build and Start**:
   The root `package.json` includes scripts to build the frontend and start the backend:
   ```bash
   npm run build
   npm start
   ```

2. **Render Deployment**:
   This project includes a `render.yaml` for quick deployment. Connect your GitHub repository to Render and it will automatically detect the settings.

---

## 🤝 For Journalists
We provide journalists with **reach, insights, and credibility.** In an era where trust is currency, Newsetu helps creators build a reputation for transparency while reaching a global, multilingual audience.
