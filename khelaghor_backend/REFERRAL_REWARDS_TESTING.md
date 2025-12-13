# Referral & Rewards System - Testing Guide

## Quick Start Testing

### Step 1: Get Your Referral Dashboard

```bash
curl http://localhost:8000/api/referrals/dashboard \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "myReferralCode": "ABC123",
    "referralCount": 0,
    "todayRewards": 0,
    "yesterdayRewards": 0,
    "availableCashRewards": 0,
    "balance": 1000
  }
}
```

**Note:** Copy your `myReferralCode` - this is what you share with friends!

---

### Step 2: Admin - Set Up Reward Configuration

```bash
curl -X PUT http://localhost:8000/api/referrals/admin/config \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dailyRewardAmount": 10,
    "referralBonusAmount": 50,
    "minimumClaimAmount": 10,
    "isActive": true
  }'
```

**Expected:** Configuration created/updated successfully

---

### Step 3: Admin - Generate Daily Reward for User

```bash
curl -X POST http://localhost:8000/api/referrals/admin/generate-daily-reward \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID"
  }'
```

**Expected:** Daily reward created with amount 10

---

### Step 4: Check Dashboard Again

```bash
curl http://localhost:8000/api/referrals/dashboard \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected:**

```json
{
  "success": true,
  "data": {
    "myReferralCode": "ABC123",
    "referralCount": 0,
    "todayRewards": 10,
    "yesterdayRewards": 0,
    "availableCashRewards": 10,
    "balance": 1000
  }
}
```

**Note:** `availableCashRewards` should now be 10!

---

### Step 5: Claim Your Rewards

```bash
curl -X POST http://localhost:8000/api/referrals/claim-rewards \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Rewards claimed successfully",
  "data": {
    "claimedAmount": 10,
    "newBalance": 1010,
    "rewardsClaimed": 1
  }
}
```

**Your balance increased from 1000 to 1010!**

---

### Step 6: Verify Balance Updated

```bash
curl http://localhost:8000/api/users/balance \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected:** Balance should be 1010

---

### Step 7: Check Dashboard After Claiming

```bash
curl http://localhost:8000/api/referrals/dashboard \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected:**

```json
{
  "success": true,
  "data": {
    "myReferralCode": "ABC123",
    "referralCount": 0,
    "todayRewards": 10,
    "yesterdayRewards": 0,
    "availableCashRewards": 0,
    "balance": 1010
  }
}
```

**Note:** `availableCashRewards` is now 0 (already claimed)

---

## Test Scenarios

### Scenario 1: Try to Claim When No Rewards Available

```bash
curl -X POST http://localhost:8000/api/referrals/claim-rewards \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected Error:**

```json
{
  "success": false,
  "message": "No rewards available to claim"
}
```

---

### Scenario 2: Minimum Claim Amount

**Step 1:** Admin sets high minimum claim amount

```bash
curl -X PUT http://localhost:8000/api/referrals/admin/config \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "minimumClaimAmount": 50
  }'
```

**Step 2:** Admin generates small reward (10)

```bash
curl -X POST http://localhost:8000/api/referrals/admin/generate-daily-reward \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID"
  }'
```

**Step 3:** User tries to claim

```bash
curl -X POST http://localhost:8000/api/referrals/claim-rewards \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected Error:**

```json
{
  "success": false,
  "message": "Minimum claim amount is 50. You have 10"
}
```

---

### Scenario 3: Multiple Daily Rewards

Generate rewards for multiple days:

```bash
# Day 1
curl -X POST http://localhost:8000/api/referrals/admin/generate-daily-reward \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "YOUR_USER_ID"}'

# Wait or manually create for different dates
# Day 2, Day 3, etc.
```

Then claim all at once:

```bash
curl -X POST http://localhost:8000/api/referrals/claim-rewards \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected:** All rewards claimed together

---

### Scenario 4: Duplicate Daily Reward

Try generating reward twice for same day:

```bash
# First time
curl -X POST http://localhost:8000/api/referrals/admin/generate-daily-reward \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "YOUR_USER_ID"}'

# Second time (same day)
curl -X POST http://localhost:8000/api/referrals/admin/generate-daily-reward \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "YOUR_USER_ID"}'
```

**Expected Error:**

```json
{
  "success": false,
  "message": "Daily reward already generated for today"
}
```

---

### Scenario 5: View Referrals

If you have referred users:

```bash
curl http://localhost:8000/api/referrals/my-referrals \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected:** List of users who signed up with your referral code

---

### Scenario 6: Reward History

```bash
curl http://localhost:8000/api/referrals/reward-history \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Expected:** Complete history of all rewards (claimed and unclaimed)

---

### Scenario 7: Admin Statistics

```bash
curl http://localhost:8000/api/referrals/admin/statistics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected:**

```json
{
  "success": true,
  "statistics": {
    "totalUsers": 100,
    "usersWithReferrals": 25,
    "totalRewardsGenerated": 500,
    "totalRewardsClaimed": 300,
    "totalRewardAmount": 5000,
    "totalClaimedAmount": 3000,
    "pendingRewardAmount": 2000
  }
}
```

---

## Complete Flow Example

### Initial State

- User Balance: 1000
- Available Rewards: 0

### Admin Generates 5 Days of Rewards

```bash
for i in {1..5}; do
  curl -X POST http://localhost:8000/api/referrals/admin/generate-daily-reward \
    -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"userId": "YOUR_USER_ID"}'
  sleep 1
done
```

### User Checks Dashboard

```bash
curl http://localhost:8000/api/referrals/dashboard \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Shows:**

- todayRewards: 10
- availableCashRewards: 50 (5 days × 10)

### User Claims All Rewards

```bash
curl -X POST http://localhost:8000/api/referrals/claim-rewards \
  -H "Authorization: Bearer YOUR_FRONTEND_TOKEN"
```

**Result:**

- claimedAmount: 50
- newBalance: 1050

### Final State

- User Balance: 1050
- Available Rewards: 0

---

## Configuration Examples

### High Rewards Setup

```json
{
  "dailyRewardAmount": 50,
  "referralBonusAmount": 200,
  "minimumClaimAmount": 10,
  "isActive": true
}
```

### Conservative Setup

```json
{
  "dailyRewardAmount": 5,
  "referralBonusAmount": 25,
  "minimumClaimAmount": 50,
  "isActive": true
}
```

### Disabled Rewards

```json
{
  "isActive": false
}
```

---

## Common Issues

### Issue: "No rewards available to claim"

- Check if rewards have been generated
- Use `/api/referrals/dashboard` to see `availableCashRewards`

### Issue: "Minimum claim amount is X"

- Admin needs to lower `minimumClaimAmount`
- Or wait for more rewards to accumulate

### Issue: "Daily reward already generated for today"

- Can only generate one reward per user per day
- This is expected behavior

### Issue: Balance not updated after claiming

- Check response - it should show new balance
- Verify with `/api/users/balance`

---

## Testing Checklist

- [ ] Get referral dashboard
- [ ] Admin: Create/update reward config
- [ ] Admin: Generate daily reward
- [ ] Check dashboard shows available rewards
- [ ] Claim rewards successfully
- [ ] Verify balance increased
- [ ] Try to claim again (should fail - no rewards)
- [ ] Admin: Generate reward for same day (should fail)
- [ ] View reward history
- [ ] View my referrals list
- [ ] Admin: View statistics
- [ ] Test minimum claim amount validation
- [ ] Test with multiple rewards
- [ ] Disable reward system (isActive: false)

---

## API Endpoints Summary

### User Endpoints

- `GET /api/referrals/dashboard` - Get dashboard data
- `GET /api/referrals/my-referrals` - List referred users
- `POST /api/referrals/claim-rewards` - Claim rewards
- `GET /api/referrals/reward-history` - View history

### Admin Endpoints

- `POST /api/referrals/admin/generate-daily-reward` - Generate reward
- `GET /api/referrals/admin/config` - Get configuration
- `PUT /api/referrals/admin/config` - Update configuration
- `GET /api/referrals/admin/statistics` - View statistics

---

## Integration with Frontend

### Dashboard Display

```javascript
const response = await fetch("/api/referrals/dashboard", {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await response.json();

// Display:
// - My Referral Code: data.myReferralCode
// - Referral Count: data.referralCount
// - Today's Rewards: ৳data.todayRewards
// - Yesterday's Rewards: ৳data.yesterdayRewards
// - Available Cash Rewards: ৳data.availableCashRewards
```

### Claim Button

```javascript
const claimRewards = async () => {
  const response = await fetch("/api/referrals/claim-rewards", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  if (data.success) {
    alert(
      `Claimed ৳${data.data.claimedAmount}! New balance: ৳${data.data.newBalance}`
    );
  }
};
```
