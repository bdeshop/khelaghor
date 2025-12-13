# Khelaghor

Node.js application with TypeScript, Express, MongoDB, and JWT authentication.

## Installation

```bash
npm install
```

## Running the App

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## API Documentation

Swagger UI is available at: `http://localhost:8000/api-docs`

## API Endpoints

### Dashboard Authentication (Admin & Users)

- `POST /api/dashboard/auth/register` - Register dashboard user (admin/user)
- `POST /api/dashboard/auth/login` - Login dashboard user

### Frontend Authentication (Users)

- `POST /api/frontend/auth/register` - Register frontend user
- `POST /api/frontend/auth/login` - Login frontend user

## Environment Variables

See `.env` file for configuration.
