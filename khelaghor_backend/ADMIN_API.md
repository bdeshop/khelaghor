# Admin API Documentation

## Authentication

All endpoints require: `Authorization: Bearer <admin_token>`

---

## Dashboard

### Get Dashboard User Info

**GET** `/api/dashboard/me`

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "65abc...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get All Users' Balances

**GET** `/api/dashboard/users/balances`

**Response:**

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
    }
  ]
}
```

---

### Get Specific User's Balance

**GET** `/api/dashboard/users/:userId/balance`

**Response:**

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

---

## User Management

### Get All Users

**GET** `/api/users`

**Response:**

```json
{
  "success": true,
  "count": 150,
  "users": [
    {
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
  ]
}
```

---

### Update User

**PUT** `/api/users/:id`

**Request:**

```json
{
  "userName": "new_username",
  "phone": 1798765432,
  "callingCode": "880",
  "balance": 10000,
  "friendReferrerCode": "XYZ789"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "65abc...",
    "userName": "new_username",
    "balance": 10000,
    ...
  }
}
```

---

### Delete User

**DELETE** `/api/users/:id`

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Deposit Transactions

### Get All Deposit Transactions

**GET** `/api/deposit-transactions/admin/all?status=pending`

**Query Parameters:**

- `status` (optional): `pending`, `approved`, `cancelled`
- `userId` (optional): Filter by user ID
- `depositMethodId` (optional): Filter by deposit method ID

**Response:**

```json
{
  "success": true,
  "count": 10,
  "transactions": [
    {
      "_id": "65abc...",
      "userId": {
        "userName": "john_doe",
        "phone": 1712345678,
        "email": "john@example.com",
        "balance": 5000
      },
      "depositMethodId": {
        "method_name_en": "bKash",
        "method_name_bd": "বিকাশ"
      },
      "transactionId": "BKH123456789",
      "amount": 1000,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Deposit Transaction

**GET** `/api/deposit-transactions/admin/:id`

**Response:**

```json
{
  "success": true,
  "transaction": {
    "_id": "65abc...",
    "userId": {...},
    "depositMethodId": {...},
    "transactionId": "BKH123456789",
    "amount": 1000,
    "userInputData": {...},
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Approve/Cancel Deposit Transaction

**PUT** `/api/deposit-transactions/admin/:id`

**Request:**

```json
{
  "status": "approved",
  "adminNote": "Verified and approved"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Transaction approved successfully",
  "transaction": {
    "_id": "65abc...",
    "userId": {
      "userName": "john_doe",
      "balance": 6000
    },
    "amount": 1000,
    "status": "approved",
    "adminNote": "Verified and approved",
    "processedBy": {
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "processedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Get Deposit Statistics

**GET** `/api/deposit-transactions/admin/statistics`

**Response:**

```json
{
  "success": true,
  "statistics": {
    "totalPending": 15,
    "totalApproved": 250,
    "totalCancelled": 10,
    "totalApprovedAmount": 500000
  }
}
```

---

## Withdraw Transactions

### Get All Withdraw Transactions

**GET** `/api/withdraw-transactions/admin/all?status=pending`

**Query Parameters:**

- `status` (optional): `pending`, `approved`, `cancelled`
- `userId` (optional): Filter by user ID
- `withdrawMethodId` (optional): Filter by withdraw method ID

**Response:**

```json
{
  "success": true,
  "count": 10,
  "transactions": [
    {
      "_id": "65abc...",
      "userId": {
        "userName": "john_doe",
        "phone": 1712345678,
        "email": "john@example.com",
        "balance": 4000
      },
      "withdrawMethodId": {
        "methodNameEn": "bkash",
        "methodNameBn": "বিকাশ"
      },
      "amount": 1000,
      "withdrawalFee": 20,
      "netAmount": 980,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Withdraw Transaction

**GET** `/api/withdraw-transactions/admin/:id`

**Response:**

```json
{
  "success": true,
  "transaction": {
    "_id": "65abc...",
    "userId": {...},
    "withdrawMethodId": {...},
    "amount": 1000,
    "withdrawalFee": 20,
    "netAmount": 980,
    "userInputData": {...},
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Approve/Cancel Withdraw Transaction

**PUT** `/api/withdraw-transactions/admin/:id`

**Request:**

```json
{
  "status": "approved",
  "adminNote": "Payment sent to bKash account"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Transaction approved successfully",
  "transaction": {
    "_id": "65abc...",
    "userId": {
      "userName": "john_doe",
      "balance": 4000
    },
    "amount": 1000,
    "withdrawalFee": 20,
    "netAmount": 980,
    "status": "approved",
    "adminNote": "Payment sent to bKash account",
    "processedBy": {
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "processedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Get Withdraw Statistics

**GET** `/api/withdraw-transactions/admin/statistics`

**Response:**

```json
{
  "success": true,
  "statistics": {
    "totalPending": 15,
    "totalApproved": 180,
    "totalCancelled": 8,
    "totalWithdrawnAmount": 450000,
    "totalFeesCollected": 9000
  }
}
```

---

## Referrals & Rewards

### Generate Daily Reward

**POST** `/api/referrals/admin/generate-daily-reward`

**Request:**

```json
{
  "userId": "65abc123def456..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Daily reward generated successfully",
  "reward": {
    "_id": "65xyz...",
    "userId": "65abc...",
    "amount": 10,
    "rewardDate": "2024-01-15T00:00:00.000Z",
    "isClaimed": false,
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

---

### Get Reward Configuration

**GET** `/api/referrals/admin/config`

**Response:**

```json
{
  "success": true,
  "config": {
    "_id": "65abc...",
    "dailyRewardAmount": 10,
    "referralBonusAmount": 50,
    "minimumClaimAmount": 10,
    "isActive": true,
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

---

### Update Reward Configuration

**PUT** `/api/referrals/admin/config`

**Request:**

```json
{
  "dailyRewardAmount": 15,
  "referralBonusAmount": 100,
  "minimumClaimAmount": 20,
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Reward configuration updated successfully",
  "config": {
    "_id": "65abc...",
    "dailyRewardAmount": 15,
    "referralBonusAmount": 100,
    "minimumClaimAmount": 20,
    "isActive": true,
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### Get Referral Statistics

**GET** `/api/referrals/admin/statistics`

**Response:**

```json
{
  "success": true,
  "statistics": {
    "totalUsers": 1000,
    "usersWithReferrals": 350,
    "totalRewardsGenerated": 5000,
    "totalRewardsClaimed": 3500,
    "totalRewardAmount": 50000,
    "totalClaimedAmount": 35000,
    "pendingRewardAmount": 15000
  }
}
```
