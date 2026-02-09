# Finwise Application Flow Diagram

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   USER VISITS APP                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Check Authentication Status  │
        │  (AuthProvider)               │
        └──────────────────┬────────────┘
                          │
                ┌─────────┴──────────┐
                │                    │
                ▼                    ▼
         ┌─────────────┐      ┌─────────────┐
         │  USER FOUND │      │ NO USER     │
         │  (Logged In)│      │ (Not Logged)│
         └──────┬──────┘      └──────┬──────┘
                │                    │
                ▼                    ▼
         ┌─────────────┐      ┌─────────────────┐
         │  DASHBOARD  │      │  LOGIN/SIGNUP   │
         │  PAGE       │      │  PAGE (/auth)   │
         └─────────────┘      └────────┬────────┘
                                       │
                      ┌────────────────┼─────────────────┐
                      │                │                 │
                      ▼                ▼                 ▼
            ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
            │ TRY DEMO ACCOUNT │  │ LOGIN        │  │ CREATE ACCT  │
            │ (Auto-login)     │  │ (Existing)   │  │ (New User)   │
            └────────┬─────────┘  └───────┬──────┘  └───────┬──────┘
                     │                    │                 │
                     └────────┬───────────┴────────┬────────┘
                              │                    │
                              ▼                    ▼
                      ┌──────────────────┐  ┌──────────────────┐
                      │ VALIDATE CREDS   │  │ VALIDATE & STORE │
                      │ LOAD DEMO DATA   │  │ CREATE PROFILE   │
                      └────────┬─────────┘  └────────┬─────────┘
                               │                     │
                               └──────────┬──────────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │  SET USER IN AUTH   │
                              │  STORE IN LOCALSTOR │
                              │  REDIRECT TO HOME   │
                              └────────┬────────────┘
                                       │
                                       ▼
                              ┌─────────────────────┐
                              │   DASHBOARD LOADED  │
                              │   WITH USER DATA    │
                              └─────────────────────┘
```

## Dashboard Navigation Flow

```
┌──────────────────────────────────────────────────────────────┐
│                       MAIN DASHBOARD                          │
│                       (Protected Route)                        │
└──────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌────────────┐    ┌──────────┐
    │DASHBOARD│       │SNAPSHOT    │    │AI COPILOT│
    │- Charts │       │FORM        │    │- AI Chat │
    │- Goals │       │- Input Data│    │- Insights│
    │- Trends│       │- Track     │    │- Advice  │
    └────────┘       │  Monthly   │    └──────────┘
        │            │  Finances  │         │
        │            └────────────┘         │
        │                 │                 │
        ▼                 ▼                 ▼
    ┌────────────────────────────────────────────┐
    │     LOCALSTORAGE (finwise-snapshots)       │
    │     LOCALSTORAGE (finwise-profile)         │
    └────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌────────────┐    ┌──────────┐
    │SIMULATOR│       │ECONOMIC    │    │LOGOUT    │
    │- Scenarios│     │NEWS        │    │- Clear   │
    │- What-If  │     │- Articles  │    │  Session │
    │- Projections│   │- Insights  │    │- Redirect│
    └────────┘       └────────────┘    └──────────┘
```

## Demo User Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   DEMO USER LOGIN                             │
│              (demo@example.com / demo123)                     │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
                ┌───────────────────────────┐
                │ useDemoData Hook          │
                │ (Triggered on Login)      │
                └──────────┬────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  Initialize Demo Snapshots       │
        │  (6 months of financial data)    │
        └──────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────┐
        │                                 │
        ▼                                 ▼
   September 2024              October - February 2025
   - Income: $5,500            - Various scenarios
   - Expenses: $3,200          - Real-world events
   - Savings: $2,300           - Financial decisions
   - Event: New job!
                                         │
                                         ▼
                          ┌──────────────────────────┐
                          │  localStorage Keys:      │
                          │  - finwise-snapshots     │
                          │  - finwise-profile       │
                          │  - finwise-user          │
                          │  - finwise-users         │
                          └──────────────────────────┘
                                         │
                                         ▼
                          ┌──────────────────────────┐
                          │ Dashboard Renders With:  │
                          │ - 6 months of data       │
                          │ - Charts & trends        │
                          │ - Financial insights     │
                          │ - AI recommendations     │
                          └──────────────────────────┘
```

## Data Persistence Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  USER INTERACTION                            │
│         (Login / Snapshot Creation / Data Update)            │
└────────────────────────┬──────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────────┐
            │  React State Updated       │
            │  (useState/Context)        │
            └────────────────┬───────────┘
                             │
                             ▼
            ┌────────────────────────────┐
            │  useLocalStorage Hook      │
            │  Captures Change           │
            └────────────────┬───────────┘
                             │
                             ▼
            ┌────────────────────────────┐
            │  Data Serialized to JSON   │
            └────────────────┬───────────┘
                             │
                             ▼
            ┌────────────────────────────┐
            │  Stored in Browser's       │
            │  localStorage              │
            │  (Persistent until clear)  │
            └────────────────┬───────────┘
                             │
                             ▼
            ┌────────────────────────────┐
            │  Available on:             │
            │  - Page Refresh            │
            │  - New Sessions            │
            │  - Same Domain Only        │
            └────────────────────────────┘
```

## Complete User Journey

```
1. INITIAL VISIT
   └─> AuthProvider checks for session
       └─> No user found
           └─> Redirected to /auth
               └─> Auth page loads

2. LOGIN OPTIONS
   ├─> Click "Try Demo Account"
   │   └─> Auto-login with demo credentials
   │       └─> Demo data loaded
   │           └─> Redirect to /
   │
   └─> Enter credentials manually
       ├─> Login (existing user)
       │   └─> Credentials validated
       │       └─> User session created
       │           └─> Redirect to /
       │
       └─> Sign up (new user)
           └─> Create profile
               └─> Validate input
                   └─> Store new user
                       └─> Auto-login
                           └─> Redirect to /

3. MAIN APP EXPERIENCE
   ├─> Dashboard (view financial overview)
   │   └─> See 6 months of demo data
   │       └─> View charts and trends
   │
   ├─> Monthly Snapshot (track finances)
   │   └─> Add new financial data
   │       └─> Saved to localStorage
   │           └─> Available on next visit
   │
   ├─> AI Copilot (get advice)
   │   └─> Chat with AI
   │       └─> Get insights based on data
   │
   ├─> Life Simulator (what-if scenarios)
   │   └─> Create financial scenarios
   │       └─> See projections
   │
   └─> Economic News (stay informed)
       └─> View relevant articles
           └─> Get personalized insights

4. LOGOUT
   └─> Click logout button
       └─> Session cleared
           └─> Redirect to /auth
               └─> Login page ready for next user
```

## Component Hierarchy

```
RootLayout
├─ AuthProvider (Context)
│  └─ Children
│     ├─ /auth/page
│     │  ├─ AuthForm
│     │  ├─ DemoButton
│     │  ├─ LoginForm / SignupForm
│     │  └─ FormValidation
│     │
│     └─ page.tsx (Dashboard)
│        ├─ useAuth Hook (check authentication)
│        ├─ useDemoData Hook (load demo data)
│        ├─ Sidebar
│        │  ├─ useAuth Hook (get user info)
│        │  ├─ useRouter Hook (navigate)
│        │  ├─ NavItems
│        │  └─ LogoutButton
│        │
│        └─ Main Content
│           ├─ Dashboard Component
│           ├─ SnapshotForm Component
│           ├─ AICopilot Component
│           ├─ LifeSimulator Component
│           └─ NewsFeed Component
```

## Key Data Structures

```
AuthUser {
  id: string
  email: string
  name: string
  financialGoals: string[]
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  monthlyBudget: number
}

MonthlySnapshot {
  id: string
  month: string (YYYY-MM format)
  income: number
  expenses: number
  savings: number
  majorEvents: string[]
  notes: string
  createdAt: string
}

UserProfile {
  name: string
  financialGoals: string[]
  riskTolerance: 'conservative' | 'moderate' | 'aggressive'
  monthlyBudget: number
}
```

---

**This diagram shows the complete flow from authentication through the app experience!**
