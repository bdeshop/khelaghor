# Admin - Referral & Rewards Management

## What You Need to Do

As an admin, you manage the referral and rewards system by:

1. **Configuring reward amounts** (how much users earn)
2. **Generating daily rewards** for users
3. **Monitoring statistics**

---

## Step 1: Configure Reward Settings

**PUT** `/api/referrals/admin/config`

Set how much users earn and minimum claim amount.

**Request:**

```json
{
  "dailyRewardAmount": 10,
  "referralBonusAmount": 50,
  "minimumClaimAmount": 10,
  "isActive": true
}
```

**What each field means:**

- `dailyRewardAmount`: How much each daily reward is worth (e.g., 10 BDT)
- `referralBonusAmount`: Bonus for referring friends (future use)
- `minimumClaimAmount`: Minimum rewards needed before user can claim (e.g., must have at least 10 BDT)
- `isActive`: Turn reward system on/off

**Response:**

```json
{
  "success": true,
  "message": "Reward configuration updated successfully",
  "config": {
    "dailyRewardAmount": 10,
    "referralBonusAmount": 50,
    "minimumClaimAmount": 10,
    "isActive": true
  }
}
```

---

## Step 2: Generate Daily Rewards for Users

**POST** `/api/referrals/admin/generate-daily-reward`

Give a user their daily reward.

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
    "isClaimed": false
  }
}
```

**Note:** You can only generate one reward per user per day.

---

## Step 3: View Current Configuration

**GET** `/api/referrals/admin/config`

Check current reward settings.

**Response:**

```json
{
  "success": true,
  "config": {
    "dailyRewardAmount": 10,
    "referralBonusAmount": 50,
    "minimumClaimAmount": 10,
    "isActive": true
  }
}
```

---

## Step 4: Monitor Statistics

**GET** `/api/referrals/admin/statistics`

See overall reward system stats.

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

**What the stats mean:**

- `totalUsers`: Total registered users
- `usersWithReferrals`: Users who were referred by someone
- `totalRewardsGenerated`: Total number of rewards created
- `totalRewardsClaimed`: How many rewards users have claimed
- `totalRewardAmount`: Total BDT in all rewards
- `totalClaimedAmount`: Total BDT claimed by users
- `pendingRewardAmount`: Total BDT waiting to be claimed

---

## Typical Admin Workflow

### Daily Task: Generate Rewards

```bash
# Generate reward for user
curl -X POST http://localhost:8000/api/referrals/admin/generate-daily-reward \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID_HERE"}'
```

### Initial Setup: Configure System

```bash
# Set reward amounts
curl -X PUT http://localhost:8000/api/referrals/admin/config \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dailyRewardAmount": 10,
    "minimumClaimAmount": 10,
    "isActive": true
  }'
```

### Monitor: Check Statistics

```bash
# View stats
curl http://localhost:8000/api/referrals/admin/statistics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Common Scenarios

### Scenario 1: Change Daily Reward Amount

If you want to give users 20 BDT per day instead of 10:

```bash
curl -X PUT http://localhost:8000/api/referrals/admin/config \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dailyRewardAmount": 20}'
```

### Scenario 2: Increase Minimum Claim Amount

If you want users to accumulate at least 50 BDT before claiming:

```bash
curl -X PUT http://localhost:8000/api/referrals/admin/config \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"minimumClaimAmount": 50}'
```

### Scenario 3: Disable Reward System

To temporarily turn off rewards:

```bash
curl -X PUT http://localhost:8000/api/referrals/admin/config \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false}'
```

---

## What Happens on User Side

1. **Admin generates daily reward** → User sees "Available Cash Rewards" increase
2. **User clicks "Add" button** → Rewards added to their balance
3. **User's balance increases** → They can use it for withdrawals

---

## Important Notes

- You can only generate **one reward per user per day**
- Users can only claim rewards if they meet the **minimum claim amount**
- When users claim, rewards are **automatically added to their balance**
- All reward generation and claims are **tracked in statistics**
