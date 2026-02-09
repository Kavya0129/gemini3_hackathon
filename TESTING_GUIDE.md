# Finwise Testing Guide

## Quick Demo Testing

### Instant Login
Click **"Try Demo Account"** button to instantly log in with:
- **Email:** `demo@example.com`
- **Password:** `demo123`

This automatically loads:
- ✅ Pre-populated user profile (Alex Johnson)
- ✅ 6 months of financial history
- ✅ Realistic spending patterns
- ✅ Financial goals and risk profile

---

## Testing Scenarios

### Scenario 1: First-Time User Experience
**Goal:** Experience the complete onboarding flow

1. Start fresh (clear localStorage or use incognito mode)
2. Visit the app
3. You'll see the login page
4. Click "Sign up"
5. Fill in the form with:
   - Name: Your name
   - Monthly Budget: $4000
   - Risk Tolerance: Moderate
   - Email: testuser@example.com
   - Password: password123
6. Click "Create Account"
7. Confirm you're logged in and can see the dashboard

**Expected Result:** New account created, you're logged in, empty financial data ready to populate

---

### Scenario 2: Demo Account Deep Dive
**Goal:** Explore the app with realistic financial data

1. Login with demo account
   - Email: `demo@example.com`
   - Password: `demo123`

2. **Dashboard Tab**
   - View 6 months of financial history
   - Charts showing income/expenses trends
   - Savings progression from $2,050 to $2,700
   - Financial goals displayed

3. **Monthly Snapshot Tab**
   - View existing 6 snapshots
   - Try editing an existing snapshot
   - Create a new snapshot for current month
   - See data persist after refresh

4. **AI Copilot Tab**
   - Click "Start Chat"
   - Ask questions like:
     - "How am I doing financially?"
     - "Should I invest more?"
     - "What's my savings rate?"
     - "How can I improve my finances?"
   - Observe AI responses based on demo data

5. **Life Simulator Tab**
   - Create a scenario:
     - Name: "Extra Savings Plan"
     - Type: Career (salary increase to $6000)
     - See 5-year projection
   - Create another scenario:
     - Type: Purchase (save for $30,000 car)
     - See how long it would take

6. **Economic News Tab**
   - View news feed
   - See articles relevant to your profile

---

### Scenario 3: Data Persistence
**Goal:** Verify data is saved locally

1. Login with demo account
2. Dashboard tab - note the savings amounts
3. Monthly Snapshot tab - add a new snapshot with custom data
4. **Refresh the page** (F5 or Cmd+R)
5. Verify:
   - You're still logged in
   - New snapshot appears in the list
   - All data is intact

---

### Scenario 4: Multiple Users
**Goal:** Test switching between different user accounts

1. Create User A:
   - Email: `user-a@example.com`
   - Password: `password-a`
   - Budget: $3000
   - Risk: Conservative

2. Add a snapshot to User A

3. Logout

4. Create User B:
   - Email: `user-b@example.com`
   - Password: `password-b`
   - Budget: $6000
   - Risk: Aggressive

5. Add a snapshot to User B

6. Logout and login back to User A

7. Verify: User A's data is still there, separate from User B

---

### Scenario 5: Session Management
**Goal:** Test authentication flow

1. Login with demo account
2. Open browser DevTools → Application → Storage → Local Storage
3. See stored keys:
   - `finwise-user` (current session)
   - `finwise-users` (all users)
   - `finwise-snapshots` (financial data)
   - `finwise-profile` (user profile)

4. Click logout in sidebar
5. Verify: You're redirected to login page
6. Try accessing `/` directly
7. Verify: Automatically redirected to `/auth`

---

### Scenario 6: Form Validation
**Goal:** Test signup form validation

1. Go to signup page
2. Try submitting with:
   - Empty fields → See "fill in all fields" message
   - Invalid email → Email input validation
   - Budget as text → See validation errors
   - All fields valid → Account created

3. Try logging in with wrong credentials
   - Wrong password → "Invalid email or password"
   - Non-existent user → "Invalid email or password"

---

## Demo Data Deep Dive

### September 2024 (Month 1)
```
Income:     $5,500
Expenses:   $3,200
Savings:    $2,300 ← Good start
Events:     Started new job (promotion!)
Notes:      "Good month, got a promotion with salary increase"
```

### October 2024 (Month 2)
```
Income:     $5,500
Expenses:   $3,450 ↑
Savings:    $2,050 ↓
Events:     Car maintenance, Wedding gift
Notes:      "Higher expenses due to unexpected car repairs"
```

### November 2024 (Month 3)
```
Income:     $5,500
Expenses:   $3,100
Savings:    $2,400
Events:     Thanksgiving expenses
Notes:      "Spent more on groceries and travel for holidays"
```

### December 2024 (Month 4)
```
Income:     $6,200 ↑ ← Year-end bonus!
Expenses:   $3,800 ↑
Savings:    $2,400
Events:     Holiday bonuses, Christmas shopping
Notes:      "Received year-end bonus, managed expenses well"
```

### January 2025 (Month 5)
```
Income:     $5,500
Expenses:   $2,800 ↓
Savings:    $2,700 ↑
Events:     New Year resolution started
Notes:      "Started budgeting app, reduced dining out expenses"
```

### February 2025 (Month 6)
```
Income:     $5,500
Expenses:   $3,100
Savings:    $2,400
Events:     Investments made
Notes:      "Started investing $500/month in index funds"
```

### Key Insights from Demo Data
- **Average Monthly Savings:** $2,408
- **Savings Rate:** ~44% of income
- **Total 6-Month Savings:** $14,450
- **Expense Trend:** Slightly increasing over time
- **Income Growth:** Bonus in December (+$700)
- **Financial Discipline:** Actively investing and reducing expenses

---

## Testing AI Copilot Responses

The AI Copilot uses demo data to provide insights. Try asking:

### Questions That Should Work Well:
```
"What's my average monthly savings?"
→ AI analyzes all 6 snapshots, calculates average

"How much did I spend on car maintenance?"
→ AI mentions October's car maintenance expense

"Am I meeting my savings goals?"
→ AI references financial goals vs actual savings

"What's my income trend?"
→ AI notes the December bonus and pattern

"Should I invest more?"
→ AI considers savings rate and risk tolerance

"What's happening to my expenses?"
→ AI identifies increase from Sept to Dec, then Dec to Feb

"How many months of emergency fund do I have?"
→ AI uses 6-month savings to calculate months of expenses
```

---

## Browser DevTools Inspection

### To Inspect Stored Data:

**Chrome/Edge/Firefox:**
1. Open DevTools (F12)
2. Go to Application → Storage → Local Storage → App URL
3. Look for these keys:

#### finwise-users
```json
[
  {
    "id": "1",
    "email": "demo@example.com",
    "password": "demo123",
    "name": "Alex Johnson",
    "financialGoals": [...],
    "riskTolerance": "moderate",
    "monthlyBudget": 5000
  }
]
```

#### finwise-user (current session)
```json
{
  "id": "1",
  "email": "demo@example.com",
  "name": "Alex Johnson",
  "financialGoals": [...],
  "riskTolerance": "moderate",
  "monthlyBudget": 5000
}
```

#### finwise-snapshots
```json
[
  {
    "id": "1",
    "month": "2024-09",
    "income": 5500,
    "expenses": 3200,
    "savings": 2300,
    "majorEvents": ["Started new job"],
    "notes": "Good month...",
    "createdAt": "2024-09-15T10:30:00Z"
  },
  ...
]
```

---

## Common Testing Issues

### Issue: Data not persisting
**Solution:** Ensure localStorage is not being cleared
- Check if browser's "Clear data on exit" is enabled
- Use a regular (non-incognito) browser window
- Check storage quota isn't exceeded

### Issue: Auth not working
**Solution:** Try these steps
- Clear localStorage completely
- Refresh the page
- Try the demo account first
- Check browser console for errors

### Issue: Demo button not showing
**Solution:**
- You might already be logged in
- Log out first
- Return to /auth page
- Demo button should appear

### Issue: Data looks different
**Solution:**
- Multiple users might have modified demo data
- Create a new test user
- Use fresh localStorage
- Login fresh with demo account

---

## Quick Checklist

Before marking as ready:

- [ ] Demo account login works instantly
- [ ] 6 months of data visible on dashboard
- [ ] Can create new user accounts
- [ ] Can add monthly snapshots
- [ ] Data persists after refresh
- [ ] Logout removes session
- [ ] Can't access app without login
- [ ] AI Copilot responds to questions
- [ ] Life Simulator creates scenarios
- [ ] Multiple users can exist independently
- [ ] Form validation works
- [ ] Error messages display properly
- [ ] Sidebar shows user name and email
- [ ] Responsive on mobile
- [ ] No console errors

---

## Performance Notes

- **Initial Load:** < 1 second (all local)
- **Auth:** Instant (localStorage check)
- **Data Access:** < 100ms (all local)
- **No Network Delays:** Everything works offline
- **Storage Used:** ~50KB for full demo data

---

**Ready to test? Click "Try Demo Account" to get started! 🚀**
