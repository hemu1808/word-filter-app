# 🌐 Deploy to Remote Server

## Prerequisites

- A server with SSH access (Ubuntu 20.04+ recommended)
- Docker and Docker Compose installed on the server
- Domain name (optional, but recommended)

## Step-by-Step Deployment

### 1. Prepare Your Server

SSH into your server:
```bash
ssh user@your-server-ip
```

Install Docker:
```bash
# Update packages
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again for group changes to take effect
exit
```

### 2. Copy Files to Server

From your local machine:
```bash
# Option 1: Using SCP
scp -r fullstack-app/ user@your-server-ip:/home/user/

# Option 2: Using rsync (recommended)
rsync -avz --exclude 'node_modules' --exclude 'venv' --exclude '.git' \
  fullstack-app/ user@your-server-ip:/home/user/fullstack-app/

# Option 3: Using Git
# On server:
git clone https://github.com/yourusername/fullstack-app.git
```

### 3. Configure for Production

SSH back into your server:
```bash
ssh user@your-server-ip
cd fullstack-app
```

Edit `.env`:
```bash
cp .env.example .env
nano .env
```

Update these values:
```env
ENVIRONMENT=production
CORS_ORIGINS=http://your-domain.com,https://your-domain.com
```

### 4. Deploy

```bash
chmod +x deploy.sh
./deploy.sh up
```

### 5. Configure Firewall

```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (if using SSL)
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### 6. Set Up Domain (Optional)

Point your domain's A record to your server's IP address:
```
Type: A
Name: @
Value: your-server-ip
TTL: 3600
```

### 7. Set Up SSL/HTTPS (Recommended)

Install Nginx as reverse proxy:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/word-filter
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/word-filter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Get SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

### 8. Verify Deployment

Access your application:
- http://your-domain.com (or http://your-server-ip)
- http://your-domain.com:8001/docs (API docs)

## Maintenance

### View Logs
```bash
./deploy.sh logs
```

### Restart Application
```bash
./deploy.sh restart
```

### Update Application
```bash
git pull origin main
./deploy.sh rebuild
```

### Backup
```bash
# Backup words.txt
docker cp word-filter-backend:/app/words.txt ./backup-words-$(date +%Y%m%d).txt
```

## Troubleshooting

### Check Container Status
```bash
docker ps
```

### Check Logs
```bash
docker logs word-filter-backend
docker logs word-filter-frontend
```

### Restart Services
```bash
./deploy.sh restart
```
