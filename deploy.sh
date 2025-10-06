#!/bin/bash

# Word Filter Application - Production Deployment Script
# This script builds and deploys the application using Docker Compose

set -e  # Exit on error

echo "=========================================="
echo "Word Filter - Production Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    exit 1
fi

# Determine docker compose command
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env file with your configuration${NC}"
    echo ""
fi

# Check if words.txt exists
if [ ! -f backend/words.txt ]; then
    echo -e "${RED}Error: backend/words.txt not found${NC}"
    echo "Please ensure the words.txt file exists in the backend directory"
    exit 1
fi

echo -e "${GREEN}✓ Configuration files found${NC}"
echo ""

# Parse command line arguments
ACTION=${1:-"up"}

case $ACTION in
    build)
        echo "Building Docker images..."
        $DOCKER_COMPOSE -f docker-compose.prod.yml build --no-cache
        echo -e "${GREEN}✓ Build complete${NC}"
        ;;
    
    up|start)
        echo "Starting application..."
        $DOCKER_COMPOSE -f docker-compose.prod.yml up -d
        echo ""
        echo -e "${GREEN}✓ Application started successfully${NC}"
        echo ""
        echo "Services:"
        echo "  Frontend: http://localhost"
        echo "  Backend:  http://localhost:8001"
        echo "  API Docs: http://localhost:8001/docs"
        echo ""
        echo "View logs with: ./deploy.sh logs"
        ;;
    
    down|stop)
        echo "Stopping application..."
        $DOCKER_COMPOSE -f docker-compose.prod.yml down
        echo -e "${GREEN}✓ Application stopped${NC}"
        ;;
    
    restart)
        echo "Restarting application..."
        $DOCKER_COMPOSE -f docker-compose.prod.yml restart
        echo -e "${GREEN}✓ Application restarted${NC}"
        ;;
    
    logs)
        $DOCKER_COMPOSE -f docker-compose.prod.yml logs -f
        ;;
    
    status)
        echo "Application status:"
        $DOCKER_COMPOSE -f docker-compose.prod.yml ps
        ;;
    
    clean)
        echo "Cleaning up..."
        $DOCKER_COMPOSE -f docker-compose.prod.yml down -v
        docker system prune -f
        echo -e "${GREEN}✓ Cleanup complete${NC}"
        ;;
    
    rebuild)
        echo "Rebuilding and restarting application..."
        $DOCKER_COMPOSE -f docker-compose.prod.yml down
        $DOCKER_COMPOSE -f docker-compose.prod.yml build --no-cache
        $DOCKER_COMPOSE -f docker-compose.prod.yml up -d
        echo -e "${GREEN}✓ Rebuild and restart complete${NC}"
        ;;
    
    *)
        echo "Usage: ./deploy.sh [command]"
        echo ""
        echo "Commands:"
        echo "  build    - Build Docker images"
        echo "  up       - Start the application (default)"
        echo "  down     - Stop the application"
        echo "  restart  - Restart the application"
        echo "  logs     - View application logs"
        echo "  status   - Show application status"
        echo "  clean    - Stop and remove all containers and volumes"
        echo "  rebuild  - Rebuild and restart the application"
        exit 1
        ;;
esac
