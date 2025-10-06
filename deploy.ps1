# Word Filter Application - Production Deployment Script (PowerShell)
# This script builds and deploys the application using Docker Compose

param(
    [Parameter(Position=0)]
    [ValidateSet("build", "up", "start", "down", "stop", "restart", "logs", "status", "clean", "rebuild")]
    [string]$Action = "up"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Word Filter - Production Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✓ Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "Error: Docker is not installed" -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
$dockerComposeCmd = ""
try {
    docker compose version | Out-Null
    $dockerComposeCmd = "docker compose"
    Write-Host "✓ Docker Compose is installed" -ForegroundColor Green
} catch {
    try {
        docker-compose --version | Out-Null
        $dockerComposeCmd = "docker-compose"
        Write-Host "✓ Docker Compose is installed" -ForegroundColor Green
    } catch {
        Write-Host "Error: Docker Compose is not installed" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "Warning: .env file not found" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..."
    Copy-Item .env.example .env
    Write-Host "Please edit .env file with your configuration" -ForegroundColor Yellow
    Write-Host ""
}

# Check if words.txt exists
if (-not (Test-Path backend\words.txt)) {
    Write-Host "Error: backend\words.txt not found" -ForegroundColor Red
    Write-Host "Please ensure the words.txt file exists in the backend directory"
    exit 1
}

Write-Host "✓ Configuration files found" -ForegroundColor Green
Write-Host ""

# Execute action
switch ($Action) {
    "build" {
        Write-Host "Building Docker images..."
        & $dockerComposeCmd -f docker-compose.prod.yml build --no-cache
        Write-Host "✓ Build complete" -ForegroundColor Green
    }
    
    { $_ -in "up", "start" } {
        Write-Host "Starting application..."
        & $dockerComposeCmd -f docker-compose.prod.yml up -d
        Write-Host ""
        Write-Host "✓ Application started successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "Services:"
        Write-Host "  Frontend: http://localhost"
        Write-Host "  Backend:  http://localhost:8001"
        Write-Host "  API Docs: http://localhost:8001/docs"
        Write-Host ""
        Write-Host "View logs with: .\deploy.ps1 logs"
    }
    
    { $_ -in "down", "stop" } {
        Write-Host "Stopping application..."
        & $dockerComposeCmd -f docker-compose.prod.yml down
        Write-Host "✓ Application stopped" -ForegroundColor Green
    }
    
    "restart" {
        Write-Host "Restarting application..."
        & $dockerComposeCmd -f docker-compose.prod.yml restart
        Write-Host "✓ Application restarted" -ForegroundColor Green
    }
    
    "logs" {
        & $dockerComposeCmd -f docker-compose.prod.yml logs -f
    }
    
    "status" {
        Write-Host "Application status:"
        & $dockerComposeCmd -f docker-compose.prod.yml ps
    }
    
    "clean" {
        Write-Host "Cleaning up..."
        & $dockerComposeCmd -f docker-compose.prod.yml down -v
        docker system prune -f
        Write-Host "✓ Cleanup complete" -ForegroundColor Green
    }
    
    "rebuild" {
        Write-Host "Rebuilding and restarting application..."
        & $dockerComposeCmd -f docker-compose.prod.yml down
        & $dockerComposeCmd -f docker-compose.prod.yml build --no-cache
        & $dockerComposeCmd -f docker-compose.prod.yml up -d
        Write-Host "✓ Rebuild and restart complete" -ForegroundColor Green
    }
}
