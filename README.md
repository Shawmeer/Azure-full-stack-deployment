# Message Board Application

A simple full-stack web application with a React frontend and Node.js/Express backend, using PostgreSQL for data storage.

## Project Structure

```
full-stack-app/
├── frontend/          # React application
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── backend/           # Node.js Express API
│   ├── index.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Local Development Setup

### 1. Database Setup

#### Using PostgreSQL directly:
```bash
# Create database
createdb messageboard

# Or using psql
psql -U postgres -c "CREATE DATABASE messageboard;"
```

#### Using Docker:
```bash
docker run --name messageboard-db \
  -e POSTGRES_DB=messageboard \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and update with your values
cp .env.example .env

# Start the server
npm start
```

The backend will run on http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on http://localhost:3000

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=messageboard
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
```

### Frontend (optional)
The frontend defaults to http://localhost:5000 for the API.
To use a different backend URL, create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://your-backend-url:5000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /messages | Get all messages |
| POST | /messages | Create a new message |
| GET | /health | Health check |

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

This creates a `build` folder with static files ready for deployment.

### Backend Production
```bash
cd backend
npm install --production
npm start
```

## Azure Deployment

### Option 1: Azure App Service (Recommended for Backend)

1. **Create Azure App Service:**
   - Go to Azure Portal → Create Resource → Web App
   - Select Runtime: Node 18 LTS
   - Select OS: Linux

2. **Deploy Backend:**
   - Use Azure CLI or GitHub Actions
   - Set environment variables in Azure Portal:
     - `DB_HOST` - Your PostgreSQL host
     - `DB_PORT` - 5432
     - `DB_NAME` - messageboard
     - `DB_USER` - Your DB username
     - `DB_PASSWORD` - Your DB password
     - `PORT` - 5000 (or leave blank, Azure will set it)

### Option 2: Azure Storage (Frontend)

1. **Create Storage Account:**
   - Go to Azure Portal → Create Storage Account

2. **Enable Static Website:**
   - Navigate to Static website
   - Enable it and set index document to index.html

3. **Upload Build Files:**
   - Upload contents of `frontend/build` to `$web` container

### Option 3: Azure App Service (Frontend)

1. **Create Web App:**
   - Go to Azure Portal → Create Web App
   - Select Runtime: Node 18 LTS
   - Select OS: Linux

2. **Deploy:**
   - Upload the build folder contents

## Docker Setup (Optional)

### Backend Docker
```bash
cd backend
docker build -t message-backend .
docker run -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=messageboard \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your_password \
  message-backend
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Check firewall settings allow connection on port 5432
- Verify credentials in .env file

### CORS Issues
- The backend is configured with CORS enabled
- If issues persist, check the CORS configuration in `backend/index.js`

### Azure Deployment Issues
- Ensure all environment variables are set in Azure Portal
- For Node.js apps, use a startup command: `node index.js`
- Check Azure App Service logs for errors

## License

MIT
