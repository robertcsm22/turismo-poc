# 🌴 Sistema de Turismo Local — PoC

> Proyecto 1 · Programación 4 · Universidad Nacional

Sistema web de turismo local con autenticación SSO de Google y acceso por código QR.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Bootstrap 5 |
| Backend | Spring Boot 3.2 + Java 17 |
| Autenticación | Google SSO (OAuth 2.0 / OpenID Connect) |
| Base de datos | PostgreSQL (Cloud SQL en GCP) |
| CI/CD | GitHub Actions |
| Despliegue | Google Cloud Run + Firebase Hosting |

---

## ⚙️ Configuración local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-equipo/turismo-poc.git
cd turismo-poc
```

### 2. Backend
```bash
cd backend

# Crea un archivo .env o exporta las variables:
export DATABASE_URL=jdbc:postgresql://localhost:5432/turismo_db
export DATABASE_USER=postgres
export DATABASE_PASSWORD=postgres
export GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
export JWT_SECRET=tu-secreto-super-largo-de-al-menos-32-caracteres

mvn spring-boot:run
# Corre en http://localhost:8080
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env.local
# Edita .env.local con tu VITE_GOOGLE_CLIENT_ID

npm install
npm run dev
# Corre en http://localhost:5173
```

### 4. Base de datos local (Docker)
```bash
docker run -d \
  --name turismo-db \
  -e POSTGRES_DB=turismo_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15
```

---

## 🔐 Configurar Google SSO — Paso a paso

Ver `GOOGLE_SSO_SETUP.md` para instrucciones detalladas.

---

## 🧪 Pruebas

```bash
# Backend
cd backend && mvn test

# Frontend
cd frontend && npm test
```

---

## 🔗 URL desplegada

- **Frontend:** https://turismo-poc.web.app
- **Backend API:** https://turismo-backend-xxx-uc.a.run.app

---

## 📱 QR de prueba

El QR de prueba apunta a: `https://turismo-poc.web.app/p/santa-teresa`

---

## 👥 Equipo

- Roberto Sanchez Matus
- Shirley Perez Anchia
- Keyner Mesis Castellon
- Joan Eras Cruz
- Gabriel Murillo Ruiz
