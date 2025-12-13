# Withdraw Transaction API - Quick Testing Guide

## Prerequisites

1. Have a frontend user account with authentication token and sufficient balance
2. Have an admin account with authentication token
3. Have at least one active withdraw method

---

## Step-by-Step Testing

### Step 1: Get Active Withdraw Methods

```bash
curl http://localhost:8000/api/withdraw-methods/active
```

**Note the following from response:**

- `_id` - Copy this as withdrawMethodId
- `minimumWithdrawal` - Minimum amount allowed
- `maximumWithdrawal` - Maximum amount allowed
- `withdrawalFee` - Fee amount
- `feeType` - "Fixed" or "Percentage"

---

### Step 2: Check Your Balance

```bash
curl http://localhost:8000/api/users/balance \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

Make sure you have sufficient balance for withdrawal.

---

### Step 3: Create Withdraw Transaction (Frontend User)

```bash
curl -X POST http://localhost:8000/api/withdraw-transactions \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "withdrawMethodId": "WITHDRAW_METHOD_ID_HERE",
    "amount": 1000,
    "userInputData": {
      "account_number": "01712345678",
      "account_name": "John Doe"
    }
  }'
```

**Expected Response:**

- Status: 201
- Transaction created with status "pending"
- Shows calculated fee and net amount
- Copy the transaction `_id` for next steps

---

### Step 4: Check User's Withdrawals

```bash
curl http://localhost:8000/api/withdraw-transactions/my-transactions \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected Response:**

- List of user's withdrawal transactions
- Should see the transaction created in Step 3

---

### Step 5: Admin Views Pending Withdrawals

```bash
curl http://localhost:8000/api/withdraw-transactions/admin/all?status=pending \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Response:**

- List of all pending withdrawals
- Should include the transaction from Step 3

---

### Step 6: Admin Approves Withdrawal

```bash
curl -X PUT http://localhost:8000/api/withdraw-transactions/admin/TRANSACTION_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "adminNote": "Payment sent to bKash account"
  }'
```

**Expected Response:**

- Status: 200
- Transaction status changed to "approved"
- User's balance decreased by the withdrawal amount

---

### Step 7: Verify User Balance Decreased

```bash
curl http://localhost:8000/api/users/balance \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected:** Balance should be reduced by the withdrawal amount.

---

### Step 8: Get Statistics (Admin)

```bash
curl http://localhost:8000/api/withdraw-transactions/admin/statistics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Response:**

- Total pending, approved, cancelled counts
- Total withdrawn amount
- Total fees collected

---

## Test Scenarios

### Scenario 1: Insufficient Balance

Try withdrawing more than your balance:

```bash
curl -X POST http://localhost:8000/api/withdraw-transactions \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "withdrawMethodId": "WITHDRAW_METHOD_ID",
    "amount": 999999
  }'
```

**Expected:** 400 error - "Insufficient balance"

---

### Scenario 2: Amount Below Minimum

Try withdrawing less than minimum limit:

```bash
curl -X POST http://localhost:8000/api/withdraw-transactions \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "withdrawMethodId": "WITHDRAW_METHOD_ID",
    "amount": 10
  }'
```

**Expected:** 400 error - "Minimum withdrawal amount is X"

---

### Scenario 3: Amount Above Maximum

Try withdrawing more than maximum limit:

```bash
curl -X POST http://localhost:8000/api/withdraw-transactions \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "withdrawMethodId": "WITHDRAW_METHOD_ID",
    "amount": 999999
  }'
```

**Expected:** 400 error - "Maximum withdrawal amount is X"

---

### Scenario 4: Cancel Withdrawal

Create a withdrawal and cancel it:

```bash
curl -X PUT http://localhost:8000/api/withdraw-transactions/admin/TRANSACTION_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled",
    "adminNote": "User requested cancellation"
  }'
```

**Expected:** Transaction cancelled, user balance NOT changed

---

### Scenario 5: Try to Update Already Processed Transaction

Try to update a transaction that's already approved or cancelled:

```bash
curl -X PUT http://localhost:8000/api/withdraw-transactions/admin/TRANSACTION_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'
```

**Expected:** 400 error - "Transaction is already approved/cancelled"

---

### Scenario 6: Inactive Withdraw Method

Try creating a withdrawal with an inactive method:

**Expected:** 400 error - "This withdraw method is currently inactive"

---

### Scenario 7: Filter Withdrawals

Get only approved withdrawals:

```bash
curl http://localhost:8000/api/withdraw-transactions/my-transactions?status=approved \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

---

## Fee Calculation Examples

### Fixed Fee (e.g., 20 BDT)

```
Amount: 1000
Fee: 20
Net Amount: 980
Balance Deducted: 1000
```

### Percentage Fee (e.g., 2%)

```
Amount: 1000
Fee: (1000 × 2) / 100 = 20
Net Amount: 980
Balance Deducted: 1000
```

---

## Common Issues

### Issue: "Insufficient balance"

- Check user's current balance
- Ensure amount doesn't exceed balance
- Remember: full amount is deducted, not net amount

### Issue: "Minimum withdrawal amount is X"

- Check withdraw method's minimumWithdrawal
- Increase withdrawal amount

### Issue: "Maximum withdrawal amount is X"

- Check withdraw method's maximumWithdrawal
- Reduce withdrawal amount

### Issue: "Withdraw method not found"

- Verify the withdrawMethodId exists
- Check if method is active

### Issue: "Not authorized to access this route"

- Check if token is valid
- Ensure token is prefixed with "Bearer "
- Verify token hasn't expired

---

## Quick Test Data

### Sample Amounts (adjust based on your method limits)

- 100, 500, 1000, 2000, 5000

### Sample User Input Data

```json
{
  "account_number": "01712345678",
  "account_name": "John Doe",
  "account_type": "Personal"
}
```

---

## Testing Checklist

- [ ] Get active withdraw methods
- [ ] Check user balance
- [ ] Create withdrawal (valid amount)
- [ ] Create withdrawal (insufficient balance) - should fail
- [ ] Create withdrawal (below minimum) - should fail
- [ ] Create withdrawal (above maximum) - should fail
- [ ] View my withdrawals
- [ ] Admin view all withdrawals
- [ ] Admin approve withdrawal
- [ ] Verify balance decreased
- [ ] Admin cancel withdrawal
- [ ] Verify balance not changed for cancelled
- [ ] Try to update already processed transaction - should fail
- [ ] Get withdrawal statistics

---

## Balance Flow Example

**Initial State:**

- User Balance: 5000 BDT

**User Creates Withdrawal:**

- Amount: 1000 BDT
- Fee: 20 BDT (2% or fixed)
- Net Amount: 980 BDT
- Status: pending
- User Balance: 5000 BDT (unchanged)

**Admin Approves:**

- Status: approved
- User Balance: 4000 BDT (5000 - 1000)
- User receives: 980 BDT to their account

**Final State:**

- User Balance: 4000 BDT
- User Received: 980 BDT
- Platform Fee: 20 BDT
