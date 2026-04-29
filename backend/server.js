const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articles');
const analysisRoutes = require('./routes/analysis');

dotenv.config();
const app = express();

// Health check endpoint (at top to ensure reachable)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'NewsSetu API is running' });
});

// Explicit CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

app.use('/api/articles', articleRoutes);
app.use('/api/analysis', analysisRoutes);

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Serve frontend static files
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const localDistPath = path.join(__dirname, 'dist');

if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND) {
  const distPath = require('fs').existsSync(frontendDistPath) ? frontendDistPath : localDistPath;
  
  if (require('fs').existsSync(distPath)) {
    console.log(`Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.warn(`Warning: Frontend dist directory not found at ${frontendDistPath} or ${localDistPath}`);
    app.get('/', (req, res) => {
      res.json({ status: 'OK', message: 'Backend is running, but frontend assets are missing. Did you run "npm run build"?' });
    });
  }
} else {
  app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'NewsSetu API is running in development mode' });
  });
}

const PORT = process.env.PORT || 5000;

// Export the app for Vercel
module.exports = app;

const startServer = async () => {
  // Only call listen if we are not in a serverless environment like Vercel
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    try {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
};

startServer();