# Finance Tracker: AI/ML Technical Architecture & Implementation Guide

**Document Generated**: April 21, 2026  
**Project**: Finance Tracker - Intelligent Financial Management System  
**Version**: 1.0

---

## TABLE OF CONTENTS
1. [Technology Stack](#technology-stack)
2. [ML Component: Spending Prediction](#ml-component-spending-prediction)
3. [AI Component: Personalized Recommendations](#ai-component-personalized-recommendations)
4. [Market Data Integration: Finnhub API](#market-data-integration-finnhub-api)
5. [Backend Architecture & Endpoints](#backend-architecture--endpoints)
6. [Frontend Implementation](#frontend-implementation)
7. [Authentication & Security](#authentication--security)
8. [Data Flow & Sequence](#data-flow--sequence)

---

## TECHNOLOGY STACK

### Backend Technologies
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js + Express.js | REST API server, route handling |
| **Database** | MongoDB Atlas (Cloud) | User data, transactions, budgets, goals storage |
| **Math/Statistics** | JavaScript Native | Linear regression, variance, standard deviation calculations |
| **HTTP Client** | node-fetch (Polyfill) | External API calls to Finnhub & CSE |
| **Authentication** | JWT (JSON Web Tokens) | Stateless token-based user authentication |
| **Environment** | dotenv | Config management (FINNHUB_API_KEY, MONGO_URI, etc.) |
| **Type Safety** | JavaScript ES6+ | Dynamic typing with careful validation |

### Frontend Technologies
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18.x | UI component library, state management |
| **Router** | React Router v6 | Client-side routing (navigate to Reports page) |
| **HTTP Client** | Fetch API (Native) | API calls with Authorization headers |
| **Styling** | CSS3 + Custom Modules | Component-specific styles (Reports.css) |
| **State** | React Hooks (useState, useEffect, useCallback, useRef) | Component state & side effects management |
| **Time Handling** | Native Date API | Real-time display, timestamp tracking |

### External APIs & Services
| Service | Purpose | Provider | Auth Method |
|---------|---------|----------|------------|
| **Finnhub API** | Live market quotes & data | Finnhub Inc. (finnhub.io) | API Key (Header) |
| **CSE API** | Sri Lanka stock exchange data | Colombo Stock Exchange | Public (No auth) |
| **MongoDB Atlas** | Database service | MongoDB Cloud | Connection String |
| **Email Service** | Transactional emails | Mailtrap SMTP | Credentials |

---

## ML COMPONENT: SPENDING PREDICTION

### What is the ML Model?

A **statistical linear regression model** that forecasts next-month spending by category using historical transaction data.

- **Model Type**: Simple Linear Regression (OLS - Ordinary Least Squares)
- **Training Data**: User's historical monthly expense aggregates
- **Features**: Time index (month sequence)
- **Target**: Monthly category spending amounts
- **Output**: Predicted next-month amount + confidence score + risk classification

### ML Model Implementation

#### Location
```
BACKEND/routes/ai.js
  → linearRegressionPredictNext()      [Lines: Prediction algorithm]
  → computeConfidence()                 [Lines: Confidence scoring]
```

#### Algorithm: Linear Regression

```javascript
const linearRegressionPredictNext = (values) => {
  // Input: Array of historical monthly expense values
  // Output: Predicted value for next month
  
  const n = values.length;
  
  // Calculate sums for least-squares formula
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    const x = i + 1;                    // Month index (1, 2, 3, ...)
    const y = values[i] || 0;           // Monthly expense
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  
  // Linear regression formula: y = mx + b
  const denominator = (n * sumXX) - (sumX * sumX);
  const slope = ((n * sumXY) - (sumX * sumY)) / denominator;
  const intercept = (sumY - (slope * sumX)) / n;
  
  // Predict for next month (n+1)
  const predicted = intercept + (slope * (n + 1));
  return Math.max(0, predicted);  // Prevent negative predictions
};
```

**Mathematical Formula**:
- Slope (m) = $\frac{n\sum xy - \sum x \sum y}{n\sum x^2 - (\sum x)^2}$
- Intercept (b) = $\frac{\sum y - m\sum x}{n}$
- Prediction = $m(n+1) + b$ where $n$ = number of historical months

#### Confidence Score Calculation

```javascript
const computeConfidence = (series) => {
  // Historical series: [Jan_amount, Feb_amount, Mar_amount, ...]
  
  if (series.length < 3) return 55;  // Low confidence with < 3 data points
  
  // Calculate coefficient of variation (relative volatility)
  const avg = series.reduce((a, b) => a + b, 0) / series.length;
  const variance = series.reduce((sum, val) => sum + ((val - avg) ** 2), 0) / series.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / avg;  // Coefficient of Variation
  
  // Transform CV to confidence (0-100%)
  // Higher CV (more volatile) = lower confidence
  const raw = 95 - (cv * 60);
  return Math.max(45, Math.min(95, Math.round(raw)));
};
```

**Interpretation**:
- **95% confidence**: Very stable spending (low CV)
- **45% confidence**: Highly volatile spending (high CV)
- Formula: Confidence = 95 - (Volatility × 60)

### ML Endpoint Details

#### GET /api/ai/predictions/spending?months=6

**Purpose**: Predict next-month expenses by category with risk scoring

**Request**:
```http
GET /api/ai/predictions/spending?months=6 HTTP/1.1
Authorization: Bearer {JWT_TOKEN}
Host: localhost:5000
```

**Query Parameters**:
| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `months` | integer | 6 | 3-12 | Historical months to use for model training |

**Response** (Success - 200):
```json
{
  "success": true,
  "model": "statistical-linear-regression",
  "generatedAt": "2026-04-21T10:30:45.123Z",
  "windowMonths": 6,
  "summary": {
    "predictedTotalExpensesNextMonth": 45,320.50,
    "budgetedTotal": 50,000.00,
    "budgetRisk": "normal"
  },
  "categories": [
    {
      "category": "Food & Dining",
      "averageMonthly": 8,250.00,
      "predictedNextMonth": 8,520.75,
      "confidence": 87,
      "budgetedAmount": 8,500.00,
      "risk": "low"
    },
    {
      "category": "Transportation",
      "averageMonthly": 6,100.00,
      "predictedNextMonth": 5,890.25,
      "confidence": 92,
      "budgetedAmount": 6,000.00,
      "risk": "low"
    },
    {
      "category": "Shopping",
      "averageMonthly": 12,500.00,
      "predictedNextMonth": 14,250.00,
      "confidence": 62,
      "budgetedAmount": 10,000.00,
      "risk": "high"
    }
  ]
}
```

**Response Fields**:
- `model`: Algorithm identifier ("statistical-linear-regression")
- `generatedAt`: ISO 8601 timestamp of prediction generation
- `windowMonths`: Number of historical months used for training
- `summary.predictedTotalExpensesNextMonth`: Sum of all category predictions
- `summary.budgetRisk`: "normal" if total predicted ≤ budgeted, else "high"
- `categories[].confidence`: 45-95% reliability score for that category's prediction
- `categories[].risk`: Risk assessment ("low" if predicted < 80% of budget, "medium" if 80-99%, "high" if ≥ 100%)

**Error Response** (500):
```json
{
  "success": false,
  "message": "Failed to generate spending prediction",
  "error": "Transaction fetch failed: [specific error]"
}
```

**Data Processing Pipeline**:
```
1. Fetch all expenses for userId in last N months
2. Aggregate by month and category
3. For each category with 2+ data points:
   a. Create monthly series [m1, m2, ..., mn]
   b. Run linear regression
   c. Calculate next month prediction
   d. Compute confidence score
   e. Compare to budget → risk classification
4. Sort categories by predicted amount (descending)
5. Return top 12 categories
```

---

## AI COMPONENT: PERSONALIZED RECOMMENDATIONS

### What is the AI Decision Layer?

An **intelligent recommendation engine** that converts ML predictions + user context (goals, savings, emergency fund) into personalized investment guidance.

- **Decision Type**: Rule-based AI with contextual scoring
- **Inputs**: Income, expenses, stability, goals, emergency coverage, budget risk
- **Outputs**: Risk profile, asset allocation, recommended monthly investment, investment picks
- **Personalization**: Each user gets unique strategy based on their financial situation

### AI Decision Logic

#### Location
```
BACKEND/routes/ai.js
  → buildMonthlySnapshot()           [Lines: Income/expense analysis]
  → buildGoalAnalysis()              [Lines: Goal obligation calculation]
  → buildRiskAndAllocation()         [Lines: Risk profile determination]
```

#### Step 1: Monthly Financial Snapshot

```javascript
const buildMonthlySnapshot = (transactions, monthsList) => {
  // Aggregate transactions into monthly income/expense
  const monthlyIncomeSeries = [Jan, Feb, Mar, ...];    // By month
  const monthlyExpenseSeries = [Jan, Feb, Mar, ...];   // By month
  
  // Calculate key metrics
  const avgIncome = average(monthlyIncomeSeries);
  const avgExpenses = average(monthlyExpenseSeries);
  const avgNetSavings = avgIncome - avgExpenses;
  
  // Stability Score (0-100): How consistent are savings?
  const netStdDev = standardDeviation(monthlyNetSeries);
  const variabilityRatio = netStdDev / Math.abs(avgNetSavings);
  const stabilityScore = Math.round(100 - (variabilityRatio * 50));  // Clamped 20-95
  
  // Savings Rate (%): What % of income goes to savings?
  const savingsRate = (avgNetSavings / avgIncome) * 100;
  
  return { avgIncome, avgExpenses, avgNetSavings, stabilityScore, savingsRate };
};
```

**Key Metrics Explained**:
- **Stability Score** (20-95): Lower ratio → more stable → higher score
  - Formula: Score = 100 - (std_dev / abs_avg_savings) × 50
  - **95**: Income and savings are very predictable
  - **50**: Moderate month-to-month variation
  - **20**: Highly unpredictable (freelancer, variable income)

- **Savings Rate** (%): Percentage of income saved after expenses
  - Formula: (Monthly_Net_Savings / Monthly_Income) × 100
  - **25%+**: Healthy, can afford aggressive investments
  - **10-25%**: Moderate, balanced approach
  - **<10%**: Limited savings capacity, conservative required

#### Step 2: Goal Analysis & Obligations

```javascript
const buildGoalAnalysis = (goals, avgExpenses) => {
  // Emergency Fund Coverage: How many months of expenses covered?
  const emergencyCurrent = sum(emergencyGoals.currentAmount);
  const emergencyCoverageMonths = emergencyCurrent / avgExpenses;
  
  // Upcoming Goals: Which goals need funding in next 6 months?
  const upcomingGoals = goals
    .filter(goal => targetDate within 180 days && status is active/paused)
    .map(goal => ({
      remainingAmount: targetAmount - currentAmount,
      monthlyRequired: remainingAmount / monthsUntilTarget,
      isNearTerm: targetDate within 180 days
    }));
  
  // Total Monthly Obligation for Goals
  const requiredForGoalsMonthly = sum(upcomingGoals.monthlyRequired);
  
  return { emergencyCoverageMonths, upcomingGoals, requiredForGoalsMonthly };
};
```

**Emergency Coverage Interpretation**:
- **≥6 months**: Strong financial resilience
- **3-6 months**: Adequate cushion
- **<3 months**: Vulnerable to sudden expenses

#### Step 3: Risk Profile Classification

```javascript
const buildRiskAndAllocation = ({
  avgNetSavings,
  savingsRate,
  stabilityScore,
  emergencyCoverageMonths,
  nearTermGoalCount
}) => {
  // Risk Profile Rules
  let riskProfile = 'Conservative';
  
  if (avgNetSavings > 0 
      && savingsRate >= 18 
      && stabilityScore >= 70 
      && emergencyCoverageMonths >= 3) {
    riskProfile = 'Aggressive';  // Can handle high volatility
  } else if (avgNetSavings > 0 
             && savingsRate >= 10 
             && stabilityScore >= 50) {
    riskProfile = 'Moderate';    // Balanced approach
  }
  
  // Asset Allocation by Risk Profile
  const allocationMap = {
    Conservative: { cash: 45, fixedIncome: 35, equities: 15, alternatives: 5 },
    Moderate:     { cash: 25, fixedIncome: 30, equities: 35, alternatives: 10 },
    Aggressive:   { cash: 10, fixedIncome: 20, equities: 55, alternatives: 15 }
  };
  
  let allocation = allocationMap[riskProfile];
  
  // Adjust for Near-Term Goals (keep more cash liquid)
  if (nearTermGoalCount > 0) {
    allocation.cash += 10;
    allocation.equities -= 10;
  }
  
  return { riskProfile, allocation };
};
```

**Risk Profile Decision Matrix**:

| Profile | Conditions | Allocation |
|---------|-----------|-----------|
| **Aggressive** | Savings ≥18%, Stability ≥70, Emergency ≥3mo | 10% Cash, 20% Fixed, 55% Equities, 15% Alternatives |
| **Moderate** | Savings ≥10%, Stability ≥50, Positive net | 25% Cash, 30% Fixed, 35% Equities, 10% Alternatives |
| **Conservative** | Otherwise (low savings, unstable, no emergency fund) | 45% Cash, 35% Fixed, 15% Equities, 5% Alternatives |

**Asset Classes Explained**:
- **Cash**: Savings accounts, money market funds → Liquidity, 0-2% returns
- **Fixed Income**: Bonds, T-Bills (NDBIB), Bank deposits → Stable, 4-8% returns (SL context)
- **Equities**: Stocks, ETFs (JKH, SPY, QQQ) → Growth, 8-15%+ returns (higher volatility)
- **Alternatives**: Gold (GLD), commodities → Inflation hedge, 5-7% returns

### AI Endpoint Details

#### GET /api/ai/recommendations/personalized?months=6

**Purpose**: Generate personalized investment strategy based on user's financial profile

**Request**:
```http
GET /api/ai/recommendations/personalized?months=6 HTTP/1.1
Authorization: Bearer {JWT_TOKEN}
Host: localhost:5000
```

**Query Parameters**:
| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `months` | integer | 6 | 3-12 | Historical months to analyze |

**Response** (Success - 200):
```json
{
  "success": true,
  "generatedAt": "2026-04-21T10:35:20.456Z",
  "profile": {
    "riskProfile": "Moderate",
    "averageMonthlyIncome": 125,000.00,
    "averageMonthlyExpenses": 95,000.00,
    "averageMonthlyNetSavings": 30,000.00,
    "savingsRate": 24.0,
    "stabilityScore": 78,
    "emergencyCoverageMonths": 4.75,
    "requiredForGoalsMonthly": 5,000.00,
    "recommendedInvestMonthly": 17,500.00
  },
  "allocation": {
    "cash": 25,
    "fixedIncome": 30,
    "equities": 35,
    "alternatives": 10
  },
  "upcomingGoals": [
    {
      "name": "Home Down Payment",
      "targetDate": "2027-06-30",
      "remainingAmount": 2,500,000.00,
      "monthlyRequired": 45,454.55,
      "isNearTerm": true
    },
    {
      "name": "Vehicle Purchase",
      "targetDate": "2026-12-31",
      "remainingAmount": 800,000.00,
      "monthlyRequired": 72,727.27,
      "isNearTerm": true
    }
  ],
  "recommendations": [
    {
      "bucket": "fixedIncome",
      "symbol": "NDBIB",
      "reason": "balance risk with predictable returns",
      "suggestedMonthlyAmount": 5,250.00
    },
    {
      "bucket": "equities",
      "symbol": "JKH.N0000",
      "reason": "local diversified conglomerate exposure",
      "suggestedMonthlyAmount": 6,125.00
    },
    {
      "bucket": "equities",
      "symbol": "SPY",
      "reason": "broad US market growth exposure",
      "suggestedMonthlyAmount": 6,125.00
    }
  ],
  "tips": [
    {
      "icon": "📊",
      "title": "Personalized Allocation Plan",
      "description": "Based on your Moderate profile, suggested split is Cash 25%, Fixed Income 30%, Equities 35%, Alternatives 10%."
    },
    {
      "icon": "🎯",
      "title": "Near-Term Goals Priority",
      "description": "2 goal(s) due within ~6 months. Keep higher cash buffer before increasing equity risk."
    },
    {
      "icon": "📊",
      "title": "Savings Stability",
      "description": "Your stability score is 78/100 with average net savings 30000.00 per month."
    }
  ]
}
```

**Response Fields**:
- `profile.riskProfile`: Classification (Aggressive, Moderate, Conservative)
- `profile.stabilityScore`: Income/savings consistency (20-95)
- `allocation`: Percentage allocation across asset classes
- `upcomingGoals`: Goals due within ~180 days with monthly funding requirement
- `recommendations`: Investment picks tailored to user's profile
- `tips`: Actionable AI insights about user's financial situation

---

## MARKET DATA INTEGRATION: FINNHUB API

### Finnhub API Overview

**Provider**: Finnhub Inc. (https://finnhub.io)  
**Service**: Real-time and reference market data for stocks, ETFs, forex, crypto  
**Authentication**: API Key (query parameter)  
**Rate Limits**: Free tier: 60 requests/minute  
**Pricing**: Freemium (free tier available for development)

### Integration Architecture

#### Configuration

**Environment Variable**:
```env
# BACKEND/.env
FINNHUB_API_KEY=d6v6239r01qig546l4f0d6v6239r01qig546l4fg
```

**API Endpoint Base**:
```
https://finnhub.io/api/v1/
```

#### Supported Symbols

**Sri Lanka Equities** (via local CSE reference):
```javascript
const marketWatchlist = {
  sriLanka: [
    { symbol: 'JKH.N0000', name: 'John Keells Holdings', type: 'equity', currency: 'LKR' },
    { symbol: 'COMB.N0000', name: 'Commercial Bank PLC', type: 'equity', currency: 'LKR' },
    { symbol: 'NDBIB', name: 'Sri Lanka T-Bills', type: 'fixed-income', currency: 'LKR' }
  ],
  ...
};
```

**International Assets** (from Finnhub):
```javascript
  abroad: [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'etf', currency: 'USD' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'etf', currency: 'USD' },
    { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'commodity-etf', currency: 'USD' }
  ]
```

### Fallback Strategy: Multi-Layer Data Sourcing

The system implements a **resilient data layer** with automatic fallback:

```
Level 1: Finnhub Live API (if FINNHUB_API_KEY configured & provider available)
           ↓ (if unavailable)
Level 2: Colombo Stock Exchange (CSE) API (for SL equities)
           ↓ (if both unavailable)
Level 3: Static Reference Data (built-in fallback, always works)
```

#### Fallback Data Structure

```javascript
const fallbackMarketData = {
  sriLanka: [
    { 
      symbol: 'JKH.N0000', 
      name: 'John Keells Holdings', 
      type: 'equity', 
      currency: 'LKR', 
      note: 'Reference snapshot (fallback)' 
    },
    { 
      symbol: 'NDBIB', 
      name: 'Sri Lanka T-Bills', 
      type: 'fixed-income', 
      currency: 'LKR', 
      note: 'Reference range 12-18% p.a.' 
    }
  ],
  abroad: [
    { 
      symbol: 'SPY', 
      name: 'SPDR S&P 500 ETF', 
      type: 'etf', 
      currency: 'USD', 
      note: 'Reference snapshot (fallback)' 
    }
  ]
};
```

### Finnhub Endpoint: Single Symbol Quote

#### GET /api/ai/market/quote?symbol=SPY

**Backend Route** (BACKEND/routes/ai.js):
```javascript
router.get('/market/quote', authenticateToken, async (req, res) => {
  const symbol = req.query.symbol.toUpperCase();
  const apiKey = process.env.FINNHUB_API_KEY;
  
  // Call Finnhub API
  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
  );
  
  const quote = await response.json();
  
  // Response includes: c (current), h (high), l (low), o (open), pc (previous close), d (change), t (timestamp)
});
```

**Finnhub API Request**:
```http
GET https://finnhub.io/api/v1/quote?symbol=SPY&token=d6v6239r01qig546l4f0d6v6239r01qig546l4fg HTTP/1.1
```

**Finnhub Response** (raw):
```json
{
  "c": 452.50,           // Current price (close)
  "h": 455.75,           // High (day)
  "l": 450.25,           // Low (day)
  "o": 451.00,           // Open (day)
  "pc": 449.75,          // Previous close
  "d": 2.75,             // Change (in currency)
  "dp": 0.61,            // Change percent
  "t": 1713696000        // UNIX timestamp
}
```

**Backend Response** (transformed):
```json
{
  "success": true,
  "source": "finnhub-live",
  "data": {
    "symbol": "SPY",
    "current": 452.50,
    "high": 455.75,
    "low": 450.25,
    "open": 451.00,
    "previousClose": 449.75,
    "change": 2.75,
    "changePercent": 0.61,
    "fetchedAt": "2026-04-21T10:40:30.123Z"
  }
}
```

**Frontend Consumption**:
```javascript
const formatChangePercent = (value) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;  // "+0.61%"
};

const getChangeClass = (value) => value >= 0 ? 'positive' : 'negative';
// CSS applies green color for positive, red for negative
```

### Finnhub Endpoint: Market Watchlist

#### GET /api/ai/market/watchlist

**Purpose**: Fetch market data for all watched symbols (SL + international)

**Backend Process**:
```
1. Check if FINNHUB_API_KEY is configured
2. Attempt to fetch live quotes for each symbol:
   - For SL equities: Try Finnhub first, fallback to CSE API
   - For international: Finnhub only
3. Enrich response with live data or fallback note
4. Return combined watchlist with source metadata
```

**Response Example**:
```json
{
  "success": true,
  "source": "finnhub-watchlist",
  "data": {
    "sriLanka": [
      {
        "symbol": "JKH.N0000",
        "name": "John Keells Holdings",
        "type": "equity",
        "currency": "LKR",
        "note": "Live market quote",
        "live": true,
        "current": 145.50,
        "high": 147.25,
        "low": 144.75,
        "open": 145.00,
        "previousClose": 144.50,
        "change": 1.00,
        "changePercent": 0.69,
        "fetchedAt": "2026-04-21T10:35:15.456Z"
      },
      {
        "symbol": "NDBIB",
        "name": "Sri Lanka T-Bills",
        "type": "fixed-income",
        "currency": "LKR",
        "note": "Reference range 12-18% p.a.",
        "live": false,
        "reason": "no-live-data"
      }
    ],
    "abroad": [
      {
        "symbol": "SPY",
        "name": "SPDR S&P 500 ETF",
        "type": "etf",
        "currency": "USD",
        "note": "Live market quote",
        "live": true,
        "current": 452.50,
        "changePercent": 0.61,
        "fetchedAt": "2026-04-21T10:40:30.789Z"
      }
    ]
  }
}
```

**Source Status Badges** (Frontend):
```
"Live" Data    → Green badge (from Finnhub API)
"Fallback"     → Gray badge (static reference data)
"Live: 4/6"    → Shows 4 live quotes out of 6 total symbols
```

---

## BACKEND ARCHITECTURE & ENDPOINTS

### Server Setup & Route Registration

#### File: BACKEND/server.js

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS: Allow frontend origins
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/reports', require('./routes/reportsEnhanced'));
app.use('/api/ai', require('./routes/ai'));            // ← AI/ML endpoints

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT);
```

### Complete AI/ML Endpoint Map

#### Route File: BACKEND/routes/ai.js

| HTTP Method | Endpoint | Authentication | Purpose | ML/AI Type |
|-----------|----------|----------------|---------|-----------|
| **GET** | `/api/ai/predictions/spending?months=6` | JWT Bearer | Forecast next-month expenses by category | **ML** (Linear Regression) |
| **GET** | `/api/ai/recommendations/personalized?months=6` | JWT Bearer | Personalized investment strategy | **AI** (Rule-based Decision) |
| **GET** | `/api/ai/market/watchlist` | JWT Bearer | Multi-symbol market data with fallback | **External API** (Finnhub) |
| **GET** | `/api/ai/market/quote?symbol=SPY` | JWT Bearer | Single symbol live quote | **External API** (Finnhub) |

### Authentication Mechanism

```javascript
const authenticateToken = (req, res, next) => {
  // Extract token from "Authorization: Bearer {token}" header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  // Verify JWT signature using secret
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    // Attach decoded user data to request
    req.user = user;  // { id, email, ... }
    next();
  });
};
```

**JWT Token Structure**:
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { id: "user_123", email: "user@example.com", iat: 1713696000 }
Signature: HMAC-SHA256(Header.Payload, JWT_SECRET)
```

**Token Usage in Requests**:
```http
GET /api/ai/predictions/spending?months=6 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Host: localhost:5000
```

### Data Models Used

#### Transaction Model
```javascript
// Used in spending prediction
const TransactionSchema = {
  userId: ObjectId,
  type: 'income' | 'expense',
  amount: Number,
  category: String,
  date: Date,
  description: String
};
```

#### Budget Model
```javascript
// Used to compare predicted vs budgeted
const BudgetSchema = {
  userId: ObjectId,
  categories: [
    {
      category: String,
      budgetedAmount: Number
    }
  ]
};
```

#### Goal Model
```javascript
// Used for emergency fund and goal analysis
const GoalSchema = {
  userId: ObjectId,
  name: String,
  category: 'emergency_fund' | 'savings' | 'investment',
  currentAmount: Number,
  targetAmount: Number,
  targetDate: Date,
  status: 'active' | 'paused' | 'completed'
};
```

---

## FRONTEND IMPLEMENTATION

### React Component: Reports.js

**Location**: `frontend/src/components/Reports.js`  
**Size**: ~800 lines  
**Dependencies**:
- React 18 hooks (useState, useEffect, useCallback, useRef)
- React Router (useNavigate)
- Fetch API (native)

### API Integration Flow

#### Step 1: User Authentication

```javascript
// Get JWT token from localStorage
const token = localStorage.getItem('token');

// Headers for all API calls
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

#### Step 2: Fetch Investment Predictions

```javascript
const fetchInvestmentPredictions = async () => {
  const token = localStorage.getItem('token');
  
  try {
    // 1. Fetch ML spending predictions
    const spendingData = await fetch(
      '/api/ai/predictions/spending?months=6',
      { headers: { 'Authorization': `Bearer ${token}` } }
    ).then(r => r.json());
    
    // 2. Fetch AI personalized recommendations
    const personalizedData = await fetch(
      '/api/ai/recommendations/personalized?months=6',
      { headers: { 'Authorization': `Bearer ${token}` } }
    ).then(r => r.json());
    
    // 3. Fetch market watchlist
    const marketData = await fetch(
      '/api/ai/market/watchlist',
      { headers: { 'Authorization': `Bearer ${token}` } }
    ).then(r => r.json());
    
    // Process and set state
    setInvestmentPredictions({ spendingData, personalizedData, marketData });
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### Step 3: Process Market Data

```javascript
const buildMarketInvestments = (items, icon, monthlyIncome) => {
  return items.map((item) => ({
    icon,
    name: item.name,
    symbol: item.symbol,
    type: item.type,
    description: item.live 
      ? 'Live quote connected from market provider.'
      : (item.note || 'Reference data'),
    live: Boolean(item.live),
    currentPrice: item.current,
    changePercent: item.changePercent,
    currency: item.currency
  }));
};

// Build two investment lists: SL and International
const sriLanka = buildMarketInvestments(marketData.data.sriLanka, '🇱🇰', monthlyIncome);
const international = buildMarketInvestments(marketData.data.abroad, '🌍', monthlyIncome);
```

#### Step 4: Auto-Refresh Mechanism

```javascript
// Auto-refresh every 60 seconds on Overview tab
useEffect(() => {
  if (activeTab !== 'overview') return;
  
  const refreshInterval = setInterval(() => {
    fetchInvestmentPredictions(true);  // silent = true (no loading spinner)
  }, 60000);  // 60 seconds
  
  return () => clearInterval(refreshInterval);
}, [activeTab]);
```

### UI Components & Display Elements

#### Market Source Status Badge

```jsx
<span className={`market-source-badge ${sourceStatus.toLowerCase()}`}>
  {sourceStatus} Data
</span>
<span className="market-source-meta">
  {liveCount}/{totalCount} live quotes
</span>
<span className="market-source-meta">
  Updated: {lastRefresh.toLocaleTimeString()}
</span>
```

**CSS Classes** (Reports.css):
```css
.market-source-badge.live {
  background-color: #10b981;  /* Green */
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
}

.market-source-badge.fallback {
  background-color: #6b7280;  /* Gray */
  color: white;
}

.positive {
  color: #10b981;  /* Green for positive change */
}

.negative {
  color: #ef4444;  /* Red for negative change */
}
```

#### Financial Profile Display

```jsx
<div className="financial-profile">
  <div className="profile-stat">
    <span className="stat-label">Monthly Income:</span>
    <span className="stat-value">{formatCurrency(monthlyIncome)}</span>
  </div>
  <div className="profile-stat">
    <span className="stat-label">Risk Profile:</span>
    <span className={`stat-value risk-${riskProfile.toLowerCase()}`}>
      {riskProfile}
    </span>
  </div>
  <div className="profile-stat">
    <span className="stat-label">Stability Score:</span>
    <span className="stat-value">{stabilityScore}/100</span>
  </div>
</div>
```

#### Investment Capital Planner Form

```jsx
<form className="capitalizer-form" onSubmit={(e) => {
  e.preventDefault();
  
  const amount = Number(capitalizeAmount);
  const duration = getDurationMonths(investmentDuration);
  const selected = allInvestmentOptions.find(o => o.symbol === selectedCompany);
  const rate = getInvestmentRate(selected);
  
  // Calculate compound interest
  const projectedInterest = amount * (rate / 100) * (duration / 12);
  const projectedTotal = amount + projectedInterest;
  
  setCapitalizationResult({
    amountValue: amount,
    months: duration,
    selected,
    rate,
    projectedInterest,
    projectedTotal
  });
}}>
  <input 
    type="number" 
    value={capitalizeAmount} 
    onChange={(e) => setCapitalizeAmount(e.target.value)}
    placeholder="Amount to invest"
  />
  <select value={investmentDuration} onChange={(e) => setInvestmentDuration(e.target.value)}>
    <option value="3m">3 Months</option>
    <option value="6m">6 Months</option>
    <option value="12m">12 Months</option>
  </select>
  <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
    {allInvestmentOptions.map(opt => (
      <option key={opt.symbol} value={opt.symbol}>{opt.name}</option>
    ))}
  </select>
  <button type="submit">Calculate Returns</button>
</form>
```

---

## AUTHENTICATION & SECURITY

### JWT Token Management

#### Token Generation (Login)
```javascript
// BACKEND/controllers/authController.js
const token = jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

#### Token Storage (Frontend)
```javascript
// After login, store token
localStorage.setItem('token', token);

// Include in all API requests
const headers = {
  'Authorization': `Bearer ${token}`
};
```

#### Token Validation (Backend)
```javascript
jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) {
    // Token expired or invalid
    return res.status(403).json({ message: 'Invalid token' });
  }
  // Token valid, extract user ID
  req.user = decoded;
});
```

### Environment Security

**BACKEND/.env** (Never commit to version control):
```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/database?tls=true

# JWT Secret (min 32 characters)
JWT_SECRET=your_jwt_secret_here_min_32_chars

# Finnhub API Key
FINNHUB_API_KEY=d6v6239r01qig546l4f0d6v6239r01qig546l4fg

# Email Service
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_USER=ad02554d28b30e
EMAIL_PASSWORD=bf0d3d8439cf4c

# Server
PORT=5000
```

**Best Practices**:
- Store `.env` in `.gitignore`
- Use strong JWT_SECRET (min 32 characters)
- Rotate API keys regularly
- Use HTTPS in production
- Implement rate limiting on API endpoints

### CORS Configuration

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

**In Production**:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## DATA FLOW & SEQUENCE

### Complete User Journey: From Login to Investment Recommendation

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY SEQUENCE                        │
└─────────────────────────────────────────────────────────────────────┘

1. USER AUTHENTICATION
   ┌──────────────┐
   │ Frontend     │ POST /api/auth/login (email, password)
   │ Login Page   │────────────────────────────────────────────→ Backend
   └──────────────┘                                              |
                                                                 ↓
                                                       ┌──────────────────┐
                                                       │ MongoDB: User    │
                                                       │ Lookup & Verify  │
                                                       └──────────────────┘
                                                                 │
                                                                 ↓
                                                       Generate JWT Token
                                                                 │
                     ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
   ┌──────────────┐
   │ Frontend     │ Store Token: localStorage.setItem('token', jwt)
   │ Logged In    │ Navigate to Reports page
   └──────────────┘


2. ML SPENDING PREDICTION
   ┌──────────────┐
   │ Frontend     │ GET /api/ai/predictions/spending?months=6
   │ Reports Tab  │ + Authorization: Bearer {JWT}
   └──────────────┘────────────────────────────────────────────→ Backend
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ 1. Extract userId    │
                                                       │    from JWT payload  │
                                                       └──────────────────────┘
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ 2. Fetch all user's  │
                                                       │    transactions      │
                                                       │    (last 6 months)   │
                                                       └──────────────────────┘
                                                                 │
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ 3. Aggregate by      │
                                                       │    month & category  │
                                                       │    [Jan, Feb, Mar...]│
                                                       └──────────────────────┘
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ 4. LINEAR REGRESSION │
                                                       │    Calculate slope & │
                                                       │    intercept         │
                                                       │    Predict next mo.  │
                                                       └──────────────────────┘
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ 5. CONFIDENCE SCORE  │
                                                       │    std_dev / avg     │
                                                       │    45-95% range      │
                                                       └──────────────────────┘
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ 6. RISK CLASSIFICATION
                                                       │    predicted vs budget│
                                                       │    low/medium/high   │
                                                       └──────────────────────┘
                                                                 │
                     ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
   ┌──────────────────────────┐
   │ Frontend displays:       │
   │ • Predicted expenses     │
   │ • Confidence per category│
   │ • Budget risk alerts     │
   │ • AI tip: "Shopping may  │
   │   exceed budget by 42%"  │
   └──────────────────────────┘


3. AI PERSONALIZED RECOMMENDATIONS
   ┌──────────────┐
   │ Frontend     │ GET /api/ai/recommendations/personalized?months=6
   │ Reports Tab  │────────────────────────────────────────────→ Backend
   └──────────────┘
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ STEP 1: INCOME ANALYSIS
                                                       │ Aggregate income &   │
                                                       │ expense by month     │
                                                       │ Calculate:           │
                                                       │  • avgIncome         │
                                                       │  • avgExpenses       │
                                                       │  • netSavings        │
                                                       │  • savingsRate %     │
                                                       │  • stabilityScore    │
                                                       └──────────────────────┘
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ STEP 2: GOAL ANALYSIS │
                                                       │ Fetch user's goals:  │
                                                       │  • Emergency fund $$ │
                                                       │    → coverage months │
                                                       │  • Upcoming goals    │
                                                       │    → monthly funding │
                                                       └──────────────────────┘
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ STEP 3: RISK PROFILE │
                                                       │ IF savingsRate≥18% && │
                                                       │    stabilityScore≥70 │
                                                       │    emergency≥3mo     │
                                                       │    net_savings > 0   │
                                                       │   THEN Aggressive    │
                                                       │   ELSE Moderate/     │
                                                       │        Conservative  │
                                                       └──────────────────────┘
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ STEP 4: ALLOCATION   │
                                                       │ Assign buckets:      │
                                                       │ • Cash: 25%          │
                                                       │ • FixedIncome: 30%   │
                                                       │ • Equities: 35%      │
                                                       │ • Alternatives: 10%  │
                                                       └──────────────────────┘
                                                                 |
                                                                 ↓
                                                       ┌──────────────────────┐
                                                       │ STEP 5: RECOMMENDATIONS
                                                       │ Match profile to      │
                                                       │ investment picks:     │
                                                       │ • NDBIB (Fixed)       │
                                                       │ • JKH (Equity-SL)     │
                                                       │ • SPY (Equity-US)     │
                                                       │ Calculate monthly $   │
                                                       │ for each bucket       │
                                                       └──────────────────────┘
                                                                 |
                     ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
   ┌──────────────────────────┐
   │ Frontend displays:       │
   │ • Risk Profile: Moderate │
   │ • Allocation chart       │
   │ • Recommended picks:     │
   │   NDBIB: 5,250/mo        │
   │   JKH: 6,125/mo          │
   │   SPY: 6,125/mo          │
   │ • AI tips on goals, cash │
   └──────────────────────────┘


4. MARKET DATA (FINNHUB)
   ┌──────────────┐
   │ Frontend     │ GET /api/ai/market/watchlist
   │ Reports Tab  │────────────────────────────────────────────→ Backend
   └──────────────┘
                                                                 |
                                                                 ↓
                                                    Check: Is FINNHUB_API_KEY set?
                                                                 |
                              Yes ↙                              ↖ No
                                 |                                |
                                 ↓                                ↓
                    For each symbol,        Return fallback data:
                    call Finnhub:           • JKH.N0000 (static)
                    https://finnhub.io/     • COMB.N0000 (static)
                    api/v1/quote?           • SPY (static)
                    symbol=SPY&             • QQQ (static)
                    token=...               • GLD (static)
                                                                 |
                         SL Symbols:                             |
                         JKH.N0000 ──→ Finnhub API ───→ Live: 145.50
                         COMB.N0000 ─→ Finnhub API ───→ Live: 89.25
                         NDBIB ────→ CSE API ────→ Reference: 12-18% p.a.
                                                                 |
                         International:                          |
                         SPY ─────→ Finnhub API ───→ Live: 452.50, +0.61%
                         QQQ ─────→ Finnhub API ───→ Live: 380.75, +1.23%
                         GLD ─────→ Finnhub API ───→ Live: 2135.50, -0.42%
                                                                 |
                                  ↙               ↖
                                 All live quotes merged
                                                                 |
                     ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
   ┌──────────────────────────┐
   │ Frontend displays:       │
   │ ✅ LIVE DATA (5/6)      │
   │ • JKH: 145.50 (+0.69%)  │
   │ • SPY: 452.50 (+0.61%)  │
   │ 🟡 FALLBACK (1/6)       │
   │ • NDBIB: Ref 12-18%     │
   │ Last Updated: 10:40 AM  │
   │ [Refresh] [PDF]         │
   └──────────────────────────┘


5. AUTO-REFRESH (Every 60 seconds)
   ┌──────────────┐
   │ Frontend     │
   │ (watching    │
   │  overview    │
   │  tab)        │ 60 seconds later...
   └──────────────┘
                    Same flow as Step 3-4 (silent refresh)
                    Update UI with latest predictions & quotes
                    "Updated: 10:41 AM"
```

---

## SUMMARY: TECHNOLOGY BREAKDOWN

### What's "Real AI/ML"?

| Layer | Type | Technology | Algorithm |
|-------|------|-----------|-----------|
| **ML** | Predictive | Linear Regression | OLS (Ordinary Least Squares) |
| **AI** | Decision Engine | Rule-based Expert System | Conditional scoring & classification |
| **Integration** | External Data | Finnhub API | REST + Fallback Strategy |
| **Frontend** | UI Rendering | React Hooks | Event-driven state updates |

### Production Readiness Checklist

- ✅ Stateless authentication (JWT)
- ✅ MongoDB Atlas (cloud database)
- ✅ Finnhub API with fallback resilience
- ✅ Error handling & 60-second auto-refresh
- ✅ User-specific data isolation (userId in JWT)
- ✅ No hardcoded secrets (all in .env)
- ✅ CORS configured for frontend origin
- ✅ Explainable predictions (confidence scores, risk labels)

### Next Steps for Enhancement

1. **Add Caching**: Cache Finnhub quotes for 5-10 minutes to reduce API calls
2. **Implement Rate Limiting**: Prevent abuse on public endpoints
3. **Add Logging**: Track all API calls and predictions for audit trail
4. **Extend ML**: Train on more historical data, add seasonal factors
5. **Sentiment Analysis**: Incorporate news sentiment for market predictions
6. **Vector Search**: Add MongoDB Atlas Search for transaction discovery
7. **Alerting**: Email users when budget risk goes high or investment milestones hit

---

**Document Version**: 1.0  
**Last Updated**: April 21, 2026  
**Author**: Finance Tracker Development Team
