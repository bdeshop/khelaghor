# Balance API Documentation

## Overview

Simple APIs to check user balances for both frontend users and dashboard admins.

---

## Frontend User Endpoints

### Get My Balance

```
GET /api/users/balance
```

Get the authenticated user's current balance.

**Headers:**

- `Authorization: Bearer <frontend_user_token>`

**Response (200):**

```json
{
  "success": true,
  "balance": 5000,
  "userName": "john_doe"
}
```

**Example:**

```bash
curl http://localhost:8000/api/users/balance \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

---

### Get My Full Profile (includes balance)

```
GET /api/users/me
```

Get complete user profile including balance.

**Headers:**

- `Authorization: Bearer <frontend_user_token>`

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "65abc...",
    "userName": "john_doe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": 1712345678,
    "callingCode": "880",
    "balance": 5000,
    "myReferralCode": "ABC123",
    "friendReferrerCode": "",
    "referredBy": "",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Dashboard Admin Endpoints

### Get All Users' Balances

```
GET /api/dashboard/users/balances
```

Get all frontend users' balances sorted by balance (highest first).

**Headers:**

- `Authorization: Bearer <admin_token>`

**Response (200):**

```json
{
  "success": true,
  "count": 150,
  "totalBalance": 750000,
  "users": [
    {
      "id": "65abc...",
      "userName": "john_doe",
      "phone": 1712345678,
      "email": "john@example.com",
      "balance": 10000
    },
    {
      "id": "65def...",
      "userName": "jane_smith",
      "phone": 1798765432,
      "email": "jane@example.com",
      "balance": 8500
    }
  ]
}
```

**Example:**

```bash
curl http://localhost:8000/api/dashboard/users/balances \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### Get Specific User's Balance

```
GET /api/dashboard/users/:userId/balance
```

Get a specific frontend user's balance.

**Headers:**

- `Authorization: Bearer <admin_token>`

**Parameters:**

- `userId`: Frontend user's ID

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "65abc...",
    "userName": "john_doe",
    "phone": 1712345678,
    "balance": 5000
  }
}
```

**Example:**

```bash
curl http://localhost:8000/api/dashboard/users/65abc123def456.../balance \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Quick Reference

| Endpoint                               | Method | Auth          | Description                 |
| -------------------------------------- | ------ | ------------- | --------------------------- |
| `/api/users/balance`                   | GET    | Frontend User | Get my balance              |
| `/api/users/me`                        | GET    | Frontend User | Get my full profile         |
| `/api/dashboard/users/balances`        | GET    | Admin         | Get all users' balances     |
| `/api/dashboard/users/:userId/balance` | GET    | Admin         | Get specific user's balance |

---

## Use Cases

### Frontend User Checks Balance

```bash
# Quick balance check
curl http://localhost:8000/api/users/balance \
  -H "Authorization: Bearer <frontend_token>"
```

### Admin Views All Balances

```bash
# See all users and total balance
curl http://localhost:8000/api/dashboard/users/balances \
  -H "Authorization: Bearer <admin_token>"
```

### Admin Checks Specific User

```bash
# Check a specific user's balance
curl http://localhost:8000/api/dashboard/users/USER_ID/balance \
  -H "Authorization: Bearer <admin_token>"
```

---

## Notes

- Frontend users can only see their own balance
- Dashboard admins can see all users' balances
- Balance is updated automatically when deposit transactions are approved
- All endpoints require valid authentication tokens
- Admin endpoints require `admin` role
