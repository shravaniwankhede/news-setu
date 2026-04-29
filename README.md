# NewsSetu

NewsSetu is a modern news aggregation and analysis platform.

## Project Structure

- `frontend/`: React + Vite frontend application.
- `backend/`: Node.js + Express backend application.

## Deployment Ready

This project has been configured for easy deployment (e.g., on Render, Heroku, etc.).

### Local Setup

1. Install dependencies:
   ```bash
   npm run install-all
   ```
2. Configure environment variables in `backend/.env` (see `backend/.env.example`).
3. Run the project:
   - Backend: `npm start --prefix backend`
   - Frontend: `npm run dev --prefix frontend`

### Production Deployment

1. **Build and Start**:
   The root `package.json` includes scripts to build the frontend and start the backend:
   ```bash
   npm run build
   npm start
   ```
2. **Environment Variables**:
   Ensure the following environment variables are set on your hosting platform:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `TOGETHER_API_KEY`: Your Together AI API key.
   - `NEWSAPI_KEY`: Your NewsAPI key.
   - `NODE_ENV`: Set to `production`.
   - `PORT`: (Optional) The port to run the server on (defaults to 5000).

3. **Render Deployment**:
   This project includes a `render.yaml` for quick deployment on [Render](https://render.com/). Just connect your GitHub repository and Render will handle the rest.
