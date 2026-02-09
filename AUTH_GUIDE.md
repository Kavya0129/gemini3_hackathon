# Finwise Authentication & Demo Flow Guide

## Overview
Finwise now includes a complete authentication system with login/signup functionality. All user data is stored locally on your device for privacy.

## Quick Start - Try the Demo

### Demo User Credentials
The quickest way to explore Finwise is to use the demo account:

- **Email:** `demo@example.com`
- **Password:** `demo123`

Simply click **"Try Demo Account"** on the login page to automatically log in with pre-populated financial data.

## Demo Data Included

When you log in as the demo user, you'll see 6 months of realistic financial data:

### September 2024
- **Income:** $5,500
- **Expenses:** $3,200
- **Savings:** $2,300
- **Event:** Started new job (promotion with raise)

### October 2024
- **Income:** $5,500
- **Expenses:** $3,450
- **Savings:** $2,050
- **Events:** Car maintenance, Wedding gift

### November 2024
- **Income:** $5,500
- **Expenses:** $3,100
- **Savings:** $2,400
- **Event:** Thanksgiving expenses

### December 2024
- **Income:** $6,200
- **Expenses:** $3,800
- **Savings:** $2,400
- **Events:** Holiday bonuses, Christmas shopping

### January 2025
- **Income:** $5,500
- **Expenses:** $2,800
- **Savings:** $2,700
- **Event:** New Year resolution started (reduced dining out)

### February 2025
- **Income:** $5,500
- **Expenses:** $3,100
- **Savings:** $2,400
- **Event:** Started investing $500/month in index funds

### Demo User Profile
- **Name:** Alex Johnson
- **Monthly Budget:** $5,000
- **Risk Tolerance:** Moderate
- **Financial Goals:**
  - Save 6 months emergency fund
  - Invest in index funds
  - Buy a house in 5 years

## Complete Authentication Flow

### 1. Login Page
When you first visit the app, you'll see the authentication page with:
- Email and password input fields
- "Try Demo Account" button for quick access
- Toggle to switch between login and signup modes

### 2. Login Process
1. Enter your email address
2. Enter your password
3. Click "Sign In"
4. You'll be redirected to the dashboard

### 3. Create New Account
1. Click "Sign up" on the login page
2. Fill in your details:
   - **Full Name**
   - **Monthly Budget** (in dollars)
   - **Risk Tolerance** (Conservative, Moderate, or Aggressive)
   - **Email**
   - **Password**
3. Click "Create Account"
4. You'll be logged in automatically and can start using Finwise

## What Happens After Login

Once authenticated, you'll have access to:

### Dashboard
- View your financial overview
- See trends across your saved monthly snapshots
- Access AI insights and recommendations

### Monthly Snapshot
- Record your monthly income, expenses, and savings
- Track major financial events
- Add notes about your financial situation

### AI Copilot
- Get AI-powered financial guidance based on your data
- Ask questions about your finances
- Receive personalized recommendations

### Life Simulator
- Run "what-if" scenarios
- Simulate career changes, loans, purchases, and investments
- Visualize potential financial outcomes

### Economic News
- Stay informed about market trends
- Read relevant financial news
- Get insights tailored to your financial profile

## Data Privacy

**Important:** All your data is stored locally on your device:
- ✅ No data sent to external servers
- ✅ No tracking or monitoring
- ✅ Complete privacy and control
- ✅ Clear your browser data = clear all app data

## Session Management

Your login session persists while:
- You keep your browser open
- Your browser's localStorage is intact

You can log out anytime:
- Click the "Logout" button in the sidebar
- This clears your session and returns you to the login page

## Demo Data Flow

### To Experience the Full Flow:

1. **Login with Demo Account**
   - Email: `demo@example.com`
   - Password: `demo123`

2. **View Dashboard**
   - See 6 months of financial history
   - Review savings trends
   - Check financial goals

3. **Run AI Copilot**
   - Ask questions about your finances
   - Get personalized insights based on demo data
   - Explore recommendations

4. **Use Life Simulator**
   - Create a scenario (e.g., "What if I save $1000/month for 5 years?")
   - See projected outcomes
   - Compare different financial decisions

5. **Check Economic News**
   - View relevant financial articles
   - Get market insights
   - Find personalized recommendations

6. **Add New Snapshot**
   - Create your own financial snapshot
   - Your data persists in localStorage
   - Return anytime to see your history

## Technical Details

### Authentication Context
- Uses React Context for state management
- Stores user session in browser's localStorage
- Automatically checks for existing session on app load

### Data Storage
- User profiles stored in `finwise-profile` localStorage key
- Monthly snapshots stored in `finwise-snapshots` localStorage key
- User credentials stored in `finwise-users` localStorage key (demo only)

### Protected Routes
- `/` (Dashboard) - requires authentication
- `/auth` - public, accessible without login

## Troubleshooting

### Forgot Your Password?
Since this is a demo app with localStorage, you cannot recover a lost password. Create a new account with a new email.

### Session Expired?
If you're logged out unexpectedly:
1. Return to the login page
2. Check if your browser cleared localStorage
3. Log in again with your credentials

### Lost Your Data?
Browser data is usually cleared when:
- You clear browser history/cookies
- You use private/incognito mode
- You uninstall your browser
- Storage quota is exceeded

**Recommendation:** Periodically export your financial snapshots or take screenshots for backup.

## Future Enhancements

When deploying to production, consider:
- Backend API for authentication
- Secure password hashing (bcrypt/argon2)
- Database for persistent data storage
- Email verification
- Password recovery
- Session management with secure tokens
- Rate limiting on auth endpoints
- Two-factor authentication (2FA)

---

**Happy tracking with Finwise! 🚀**
