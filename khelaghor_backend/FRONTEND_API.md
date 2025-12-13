# Frontend User API Documentation

## Authentication

All endpoints require: `Authorization: Bearer <frontend_user_token>`

---

## User Profile & Balance

### Get My Profile

**GET** `/api/users/me`

**Response:**

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

### Get My Balance

**GET** `/api/users/balance`

**Response:**

```json
{
  "success": true,
  "balance": 5000,
  "userName": "john_doe"
}
```

---

## Deposit Methods

### Get Active Deposit Methods

**GET** `/api/deposit-methods/active`

**Response:**

```json
{
  "success": true,
  "count": 2,
  "depositMethods": [
    {
      "_id": "65abc...",
      "method_name_en": "bKash",
      "method_name_bd": "বিকাশ",
      "agent_wallet_number": "01712345678",
      "agent_wallet_text": "Send money to this number",
      "gateways": ["bKash"],
      "method_image": "/uploads/image.png",
      "payment_page_image": "/uploads/payment.png",
      "text_color": "#000000",
      "background_color": "#ffffff",
      "button_color": "#007bff",
      "status": "Active",
      "instruction_en": "Send money and provide transaction ID",
      "instruction_bd": "টাকা পাঠান এবং লেনদেন আইডি প্রদান করুন",
      "user_input_fields": [
        {
          "name": "transaction_id",
          "type": "text",
          "isRequired": true,
          "label_en": "Transaction ID",
          "label_bd": "লেনদেন আইডি"
        }
      ]
    }
  ]
}
```

---

## Deposit Transactions

### Create Deposit Transaction

**POST** `/api/deposit-transactions`

**Request:**

```json
{
  "depositMethodId": "65abc123def456...",
  "transactionId": "BKH123456789",
  "amount": 1000,
  "userInputData": {
    "sender_number": "01798765432"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Deposit transaction created successfully",
  "transaction": {
    "_id": "65abc...",
    "userId": {
      "userName": "john_doe",
      "phone": 1712345678,
      "email": "john@example.com"
    },
    "depositMethodId": {
      "method_name_en": "bKash",
      "method_name_bd": "বিকাশ"
    },
    "transactionId": "BKH123456789",
    "amount": 1000,
    "userInputData": {...},
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get My Deposit Transactions

**GET** `/api/deposit-transactions/my-transactions?status=pending`

**Query Parameters:**

- `status` (optional): `pending`, `approved`, `cancelled`

**Response:**

```json
{
  "success": true,
  "count": 5,
  "transactions": [
    {
      "_id": "65abc...",
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

**GET** `/api/deposit-transactions/:id`

**Response:**

```json
{
  "success": true,
  "transaction": {
    "_id": "65abc...",
    "depositMethodId": {...},
    "transactionId": "BKH123456789",
    "amount": 1000,
    "userInputData": {...},
    "status": "approved",
    "adminNote": "Verified and approved",
    "processedBy": {
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "processedAt": "2024-01-15T11:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Withdraw Methods

### Get Active Withdraw Methods

**GET** `/api/withdraw-methods/active`

**Response:**

```json
{
  "success": true,
  "count": 1,
  "withdrawMethods": [
    {
      "_id": "6935c434c6a0e48ba9bbd764",
      "methodNameEn": "bkash",
      "methodNameBn": "বিকাশ",
      "minimumWithdrawal": 10,
      "maximumWithdrawal": 1000,
      "processingTime": "2 hours",
      "status": "Active",
      "withdrawalFee": 2,
      "feeType": "Fixed",
      "methodImage": "/uploads/image.png",
      "withdrawPageImage": "/uploads/withdraw.png",
      "colors": {
        "textColor": "#000000",
        "backgroundColor": "#ffffff",
        "buttonColor": "#007bff"
      },
      "instructionEn": "Enter your bKash account number",
      "instructionBn": "আপনার বিকাশ অ্যাকাউন্ট নম্বর লিখুন",
      "userInputFields": [
        {
          "fieldLabelEn": "Account Number",
          "fieldLabelBn": "অ্যাকাউন্ট নম্বর",
          "fieldType": "text",
          "required": true
        }
      ]
    }
  ]
}
```

---

## Withdraw Transactions

### Create Withdraw Transaction

**POST** `/api/withdraw-transactions`

**Request:**

```json
{
  "withdrawMethodId": "6935c434c6a0e48ba9bbd764",
  "amount": 1000,
  "userInputData": {
    "account_number": "01712345678",
    "account_name": "John Doe"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Withdraw transaction created successfully",
  "transaction": {
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
    "userInputData": {...},
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get My Withdraw Transactions

**GET** `/api/withdraw-transactions/my-transactions?status=pending`

**Query Parameters:**

- `status` (optional): `pending`, `approved`, `cancelled`

**Response:**

```json
{
  "success": true,
  "count": 3,
  "transactions": [
    {
      "_id": "65abc...",
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

**GET** `/api/withdraw-transactions/:id`

**Response:**

```json
{
  "success": true,
  "transaction": {
    "_id": "65abc...",
    "withdrawMethodId": {...},
    "amount": 1000,
    "withdrawalFee": 20,
    "netAmount": 980,
    "userInputData": {...},
    "status": "approved",
    "adminNote": "Payment sent successfully",
    "processedBy": {
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "processedAt": "2024-01-15T11:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Referrals & Rewards

### Get Referral Dashboard

**GET** `/api/referrals/dashboard`

**Response:**

```json
{
  "success": true,
  "data": {
    "myReferralCode": "ABC123",
    "referralCount": 5,
    "todayRewards": 10,
    "yesterdayRewards": 10,
    "availableCashRewards": 50,
    "balance": 1000
  }
}
```

---

### Get My Referrals

**GET** `/api/referrals/my-referrals`

**Response:**

```json
{
  "success": true,
  "count": 5,
  "referrals": [
    {
      "_id": "65abc...",
      "userName": "john_doe",
      "phone": 1712345678,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Claim Rewards

**POST** `/api/referrals/claim-rewards`

**Response:**

```json
{
  "success": true,
  "message": "Rewards claimed successfully",
  "data": {
    "claimedAmount": 50,
    "newBalance": 1050,
    "rewardsClaimed": 5
  }
}
```

---

### Get Reward History

**GET** `/api/referrals/reward-history`

**Response:**

```json
{
  "success": true,
  "count": 10,
  "rewards": [
    {
      "_id": "65abc...",
      "userId": "65def...",
      "amount": 10,
      "rewardDate": "2024-01-15T00:00:00.000Z",
      "isClaimed": true,
      "claimedAt": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```
