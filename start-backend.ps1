# Backend Startup Script
Write-Host "Starting Backend Server..." -ForegroundColor Green
cd backend

# Activate virtual environment if it exists
if (Test-Path "venv\Scripts\activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & .\venv\Scripts\activate.ps1
}

# Check if FastAPI is installed
try {
    python -c "import fastapi" 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "FastAPI not found. Installing dependencies..." -ForegroundColor Yellow
        pip install -r requirements.txt
    }
} catch {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Ensure words.txt exists before starting the server
if (-not (Test-Path "words.txt") -and (Test-Path "google-10k-common.txt")) {
    Write-Host "Creating words.txt from google-10k-common.txt..." -ForegroundColor Yellow
    Copy-Item "google-10k-common.txt" "words.txt"
}

Write-Host "Starting server on http://localhost:8001" -ForegroundColor Cyan
python main.py
Write-Host "Backend server stopped." -ForegroundColor Red
pause

