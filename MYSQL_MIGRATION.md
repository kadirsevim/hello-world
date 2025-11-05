# MySQL Migration & Web Hosting Deployment Guide

## 📋 İçindekiler
1. [MySQL'e Geçiş](#mysql-geçiş)
2. [Local Test](#local-test)
3. [Deployment Seçenekleri](#deployment-seçenekleri)
4. [cPanel Deployment](#cpanel-deployment)
5. [VPS Deployment](#vps-deployment)
6. [PythonAnywhere Deployment](#pythonanywhere-deployment)

---

## 1. MySQL'e Geçiş

### Gerekli Paketler
```bash
pip install aiomysql sqlalchemy pymysql
```

### `.env` Dosyası (Backend)
`/app/backend/.env` dosyası oluşturun:

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=yzr_yangin

# JWT Secret
JWT_SECRET_KEY=your-secret-key-change-in-production

# Backend URL (local test)
BACKEND_URL=http://localhost:8001
```

### MySQL Database Oluşturma

```sql
CREATE DATABASE yzr_yangin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'yzr_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON yzr_yangin.* TO 'yzr_user'@'localhost';
FLUSH PRIVILEGES;
```

### Migration Script Çalıştırma

```bash
cd /app/backend
python migrate_to_mysql.py
```

Bu script:
- MySQL tablolarını oluşturur
- MongoDB'den verileri çeker
- MySQL'e aktarır

---

## 2. Local Test

### Backend Test
```bash
cd /app/backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Test
```bash
cd /app/frontend
npm start
```

Test URL: http://localhost:3000

---

## 3. Deployment Seçenekleri

### ⚠️ Shared Hosting (cPanel) Sınırlamaları

**Sorun:** Çoğu shared hosting FastAPI (ASGI) çalıştıramaz.

**Çözüm Seçenekleri:**

| Seçenek | Maliyet | Zorluk | Önerilen |
|---------|---------|---------|----------|
| VPS (DigitalOcean, Hetzner) | $4-6/ay | Orta | ⭐⭐⭐⭐⭐ |
| PythonAnywhere | $5/ay | Kolay | ⭐⭐⭐⭐ |
| Railway | Ücretsiz-$5/ay | Kolay | ⭐⭐⭐⭐ |
| Vercel + Railway | Ücretsiz | Kolay | ⭐⭐⭐⭐ |
| cPanel (Python App) | Mevcut | Zor | ⭐⭐ |

---

## 4. cPanel Deployment (Sınırlı Destek)

### A. Gereksinimler
- Python 3.9+ desteği olan cPanel
- MySQL database erişimi
- SSH erişimi (opsiyonel ama önerilen)

### B. Backend Deployment

#### 1. Python App Oluşturma (cPanel)
```
cPanel → Setup Python App
- Python Version: 3.9+
- App Root: /home/username/backend
- App URL: yourdomain.com/api
- App Startup File: passenger_wsgi.py
```

#### 2. `passenger_wsgi.py` Oluşturma
```python
import sys
import os

# Virtual environment
INTERP = "/home/username/backend/venv/bin/python"
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.path.dirname(__file__))

from server import app

# WSGI application
application = app
```

#### 3. Backend Dosyalarını Upload
```bash
# FTP ile upload edin:
/home/username/backend/
├── server.py
├── models.py
├── database_mysql.py
├── routes/
├── requirements.txt
├── .env (MySQL credentials)
└── passenger_wsgi.py
```

#### 4. Dependencies Install
```bash
cd ~/backend
source venv/bin/activate
pip install -r requirements.txt
```

#### 5. MySQL Configuration
cPanel → MySQL Databases:
- Database oluştur: `username_yzr`
- User oluştur: `username_yzr`
- Grant all privileges

`.env` dosyasını güncelleyin:
```env
MYSQL_HOST=localhost
MYSQL_USER=username_yzr
MYSQL_PASSWORD=your_password
MYSQL_DB=username_yzr
```

### C. Frontend Deployment

#### 1. Build Oluşturma
```bash
cd /app/frontend

# .env.production oluşturun
echo "REACT_APP_BACKEND_URL=https://yourdomain.com" > .env.production

# Build
npm run build
```

#### 2. Build'i Upload
```
# FTP ile /public_html/ altına upload:
/public_html/
├── index.html
├── static/
├── assets/
└── ...
```

#### 3. .htaccess Oluşturma
`/public_html/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # API requests'i backend'e yönlendir
  RewriteCond %{REQUEST_URI} ^/api
  RewriteRule ^api/(.*)$ https://yourdomain.com:8001/api/$1 [P,L]
  
  # React Router için
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 5. VPS Deployment (Önerilen) 🌟

### A. VPS Seçenekleri
- **Hetzner Cloud:** €4.15/ay (2 vCPU, 4GB RAM)
- **DigitalOcean:** $6/ay (1 vCPU, 1GB RAM)
- **Vultr:** $6/ay

### B. Setup Script

```bash
# 1. VPS'e SSH ile bağlan
ssh root@your-vps-ip

# 2. Dependencies
apt update && apt upgrade -y
apt install -y python3.11 python3-pip nginx mysql-server nodejs npm git

# 3. MySQL Setup
mysql_secure_installation
mysql -u root -p

# MySQL'de:
CREATE DATABASE yzr_yangin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'yzr_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON yzr_yangin.* TO 'yzr_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 4. Backend Setup
mkdir -p /var/www/yzr-backend
cd /var/www/yzr-backend

# Git clone veya dosyaları upload edin
# ...

# Virtual environment
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# .env oluştur
cat > .env << EOF
MYSQL_HOST=localhost
MYSQL_USER=yzr_user
MYSQL_PASSWORD=strong_password
MYSQL_DB=yzr_yangin
JWT_SECRET_KEY=$(openssl rand -hex 32)
EOF

# 5. Systemd Service
cat > /etc/systemd/system/yzr-backend.service << EOF
[Unit]
Description=YZR Yangin Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/yzr-backend
Environment="PATH=/var/www/yzr-backend/venv/bin"
ExecStart=/var/www/yzr-backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl enable yzr-backend
systemctl start yzr-backend

# 6. Frontend Setup
mkdir -p /var/www/yzr-frontend
cd /var/www/yzr-frontend

# Build'i upload edin veya:
# npm install
# npm run build
# Build output: /var/www/yzr-frontend/build

# 7. Nginx Configuration
cat > /etc/nginx/sites-available/yzr-yangin << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Frontend
    location / {
        root /var/www/yzr-frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/yzr-yangin /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 8. SSL (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### C. Deployment Scripti

`deploy.sh`:
```bash
#!/bin/bash

# Backend update
cd /var/www/yzr-backend
git pull
source venv/bin/activate
pip install -r requirements.txt
systemctl restart yzr-backend

# Frontend update
cd /var/www/yzr-frontend
git pull
npm install
npm run build
systemctl reload nginx

echo "Deployment completed!"
```

---

## 6. PythonAnywhere Deployment

### A. Account Oluşturma
- https://www.pythonanywhere.com/
- Beginner Account: Ücretsiz (sınırlı)
- Hacker Account: $5/ay (önerilen)

### B. Setup

#### 1. Console'dan
```bash
# Başlangıç
cd ~
git clone your-repo-url
cd yzr-backend

# Virtual environment
mkvirtualenv --python=/usr/bin/python3.10 yzr-env
pip install -r requirements.txt
```

#### 2. MySQL Setup
Web → Databases → Initialize MySQL
```sql
CREATE DATABASE $USER$yzr_yangin;
```

#### 3. Web App Configuration
Web → Add a new web app:
- Framework: Manual configuration
- Python version: 3.10
- Working directory: `/home/yourusername/yzr-backend`
- WSGI file: `/var/www/yourusername_pythonanywhere_com_wsgi.py`

WSGI file içeriği:
```python
import sys
import os

project_home = '/home/yourusername/yzr-backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

from server import app
application = app
```

#### 4. Static Files
Static files → Add:
- URL: /static/
- Directory: /home/yourusername/yzr-frontend/build/static/

#### 5. Environment Variables
`.env` dosyası:
```env
MYSQL_HOST=yourusername.mysql.pythonanywhere-services.com
MYSQL_USER=yourusername
MYSQL_PASSWORD=your_password
MYSQL_DB=yourusername$yzr_yangin
```

---

## 7. Railway/Render Deployment (En Kolay)

### A. Railway

1. https://railway.app/ - GitHub ile giriş
2. New Project → Deploy from GitHub
3. Backend repo seçin
4. Environment Variables ekleyin:
```
MYSQL_HOST=containers-us-west-xxx.railway.app
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=xxx
MYSQL_DB=railway
```
5. MySQL plugin ekleyin
6. Deploy!

### B. Frontend (Vercel)

1. https://vercel.com/ - GitHub ile giriş
2. Import Git Repository
3. Frontend repo seçin
4. Environment Variables:
```
REACT_APP_BACKEND_URL=https://your-backend.up.railway.app
```
5. Deploy!

---

## 8. Troubleshooting

### MySQL Connection Error
```python
# Test script
import aiomysql
import asyncio

async def test():
    conn = await aiomysql.connect(
        host='localhost',
        user='root',
        password='password',
        db='yzr_yangin'
    )
    async with conn.cursor() as cursor:
        await cursor.execute("SELECT 1")
        result = await cursor.fetchone()
        print(f"Connection OK: {result}")
    conn.close()

asyncio.run(test())
```

### CORS Error
server.py'de:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Update
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Build Error
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 9. Production Checklist

- [ ] MySQL database oluşturuldu
- [ ] Strong passwords kullanıldı
- [ ] JWT_SECRET_KEY değiştirildi
- [ ] CORS ayarları production domain'e göre
- [ ] SSL sertifikası kuruldu (HTTPS)
- [ ] .env dosyası git'e eklenmedi (.gitignore)
- [ ] Admin şifresi değiştirildi (admin/admin123 → güçlü şifre)
- [ ] Backup sistemi kuruldu
- [ ] Monitoring kuruldu (UptimeRobot vb.)

---

## 10. Backup Script

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)

# MySQL Backup
mysqldump -u yzr_user -p yzr_yangin > backup_$DATE.sql

# Compress
gzip backup_$DATE.sql

# Upload to cloud (optional)
# aws s3 cp backup_$DATE.sql.gz s3://your-bucket/

echo "Backup completed: backup_$DATE.sql.gz"
```

Cron job (her gün saat 2'de):
```bash
crontab -e
0 2 * * * /path/to/backup.sh
```

---

## Destek

Sorunlar için:
- VPS: DigitalOcean Community Tutorials
- PythonAnywhere: Help Forum
- Railway: Discord Community

**Başarılar! 🚀**
