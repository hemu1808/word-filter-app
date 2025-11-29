# How to Start the App

## Quick Start

### Option 1: Use the Startup Scripts

1. **Start Backend** (in one terminal):
   ```powershell
   .\start-backend.ps1
   ```
   Or manually:
   ```powershell
   cd backend
   python main.py
   ```

2. **Start Frontend** (in another terminal):
   ```powershell
   .\start-frontend.ps1
   ```
   Or manually:
   ```powershell
   cd frontend
   npm start
   ```

### Option 2: Use npm scripts (from root directory)

```powershell
# Terminal 1 - Backend
npm run start-backend

# Terminal 2 - Frontend  
npm run start-frontend
```

### Option 3: Use uvicorn directly (Backend)

```powershell
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

## Verify Servers are Running

- **Backend**: Open http://localhost:8001 in your browser
- **Frontend**: Open http://localhost:4200 in your browser
- **API Docs**: Open http://localhost:8001/docs

## Troubleshooting

### Backend won't start:

1. Check if Python dependencies are installed:
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

2. Check if `words.txt` exists in the `backend` directory

3. Check for port conflicts (port 8001):
   ```powershell
   netstat -ano | findstr ":8001"
   ```

### Frontend won't start:

1. Check if Node dependencies are installed:
   ```powershell
   cd frontend
   npm install
   ```

2. Check for port conflicts (port 4200):
   ```powershell
   netstat -ano | findstr ":4200"
   ```

3. Clear npm cache if needed:
   ```powershell
   npm cache clean --force
   ```

## Expected Output

### Backend:
- Should show: "Application startup initiated"
- Should show: "Successfully loaded X words"
- Should show: "Uvicorn running on http://0.0.0.0:8001"

### Frontend:
- Should show: "** Angular Live Development Server is listening on localhost:4200"
- Should automatically open browser

