# Combined Startup Script for Fullstack App
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Word Filter Fullstack App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
Write-Host "Checking Python..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}
Write-Host "Python: $pythonVersion" -ForegroundColor Green

# Check if Node is available
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

# Check if words.txt exists
Write-Host "Checking words.txt..." -ForegroundColor Yellow
if (Test-Path "backend\words.txt") {
    Write-Host "words.txt found" -ForegroundColor Green
} else {
    Write-Host "WARNING: words.txt not found in backend directory" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting Backend Server on port 8001..." -ForegroundColor Green
Write-Host "Starting Frontend Server on port 4200..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend API: http://localhost:8001" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:4200" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8001/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; python main.py" -WindowStyle Normal

# Start frontend in a new window  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm start" -WindowStyle Normal

Write-Host "Both servers are starting in separate windows..." -ForegroundColor Green
Write-Host "Check the windows for any errors." -ForegroundColor Yellow

