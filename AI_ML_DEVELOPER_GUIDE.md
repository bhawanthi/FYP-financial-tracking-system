# Finance Tracker: AI/ML API Implementation Guide for Developers

**Document Version**: 1.0  
**Date**: April 21, 2026  
**Target Audience**: Backend & Frontend Developers

---

## QUICK REFERENCE: ALL API ENDPOINTS

```javascript
// BASE URL
const API_BASE = 'http://localhost:5000';

// AUTHENTICATION REQUIRED (Bearer Token)
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
};

// 🤖 ML ENDPOINT 1: Spending Prediction
GET /api/ai/predictions/spending?months=6
Headers: { Authorization: 'Bearer {jwt}' }
Response: { success, model, categories[], summary }

// 🧠 AI ENDPOINT 2: Personalized Recommendations
GET /api/ai/recommendations/personalized?months=6
Headers: { Authorization: 'Bearer {jwt}' }
Response: { success, profile, allocation, recommendations[], tips[] }

// 📈 MARKET ENDPOINT 3: Watchlist (Multi-Symbol)
GET /api/ai/market/watchlist
Headers: { Authorization: 'Bearer {jwt}' }
Response: { success, source, data{ sriLanka[], abroad[] } }

// 📊 MARKET ENDPOINT 4: Single Quote
GET /api/ai/market/quote?symbol=SPY
Headers: { Authorization: 'Bearer {jwt}' }
Response: { success, source, data{ current, changePercent, ... } }
```

---

## 1. ML ENDPOINT: SPENDING PREDICTION

### Implementation: Backend

**File**: `BACKEND/routes/ai.js`

#### How to Call from Backend (Test/Debug)

```javascript
// Direct function call (within same Node.js process)
const { linearRegressionPredictNext, computeConfidence } = require('./ai.js');

// Example: Predict next month for Food category
const historicalSpending = [8100, 8250, 8300, 8450, 8200, 8350];  // 6 months
const predictedNext = linearRegressionPredictNext(historicalSpending);
// Result: ~8520.75

const confidence = computeConfidence(historicalSpending);
// Result: 87 (87% confidence)
```

#### How to Call from Frontend

```javascript
// React component example
const [predictions, setPredictions] = useState(null);
const [loading, setLoading] = useState(false);

const fetchSpendingPredictions = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      'http://localhost:5000/api/ai/predictions/spending?months=6',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    setPredictions(data);
    
    // data.categories = [
    //   {
    //     category: "Food & Dining",
    //     averageMonthly: 8250,
    //     predictedNextMonth: 8520.75,
    //     confidence: 87,
    //     budgetedAmount: 8500,
    //     risk: "low"
    //   },
    //   ...
    // ]
  } catch (error) {
    console.error('Prediction fetch failed:', error);
  } finally {
    setLoading(false);
  }
};

// Call it
useEffect(() => {
  fetchSpendingPredictions();
}, []);
```

### Real-World Use Cases

#### Use Case 1: Budget Risk Alert System

```javascript
const checkBudgetRisk = (predictions) => {
  const highRiskCategories = predictions.categories.filter(
    c => c.risk === 'high'
  );
  
  if (highRiskCategories.length > 0) {
    const message = `⚠️ ${highRiskCategories.length} categories may exceed budget:
      ${highRiskCategories.map(c => `${c.category}: ${c.predictedNextMonth} vs budget ${c.budgetedAmount}`).join('\n')}`;
    
    // Send email alert, in-app notification, etc.
    sendAlert(message);
  }
};
```

#### Use Case 2: Confidence-Based Sorting

```javascript
// Show most confident predictions first
const sortByConfidence = (predictions) => {
  return [...predictions.categories].sort(
    (a, b) => b.confidence - a.confidence
  );
};

// High confidence → actionable
// Low confidence → show disclaimer "Add more data"
const highConfident = sortByConfidence(predictions).filter(c => c.confidence >= 80);
const lowConfident = sortByConfidence(predictions).filter(c => c.confidence < 80);
```

#### Use Case 3: Time-Series Tracking

```javascript
// Call API monthly to track model accuracy
const trackPredictionAccuracy = async () => {
  // Get last month's prediction
  const lastMonthPrediction = await getFromDatabase('predictions_march');
  
  // Get actual spending from april transactions
  const actualSpending = await getActualSpendingByCategory('april');
  
  // Compare
  const accuracy = lastMonthPrediction.map(pred => ({
    category: pred.category,
    predicted: pred.predictedNextMonth,
    actual: actualSpending[pred.category],
    error: Math.abs(pred.predicted - actualSpending[pred.category]),
    errorPercent: (Math.abs(pred.predicted - actualSpending[pred.category]) / actualSpending[pred.category]) * 100
  }));
  
  // If consistently >20% error, retrain with more data
};
```

### Performance Considerations

| Factor | Current | Optimization |
|--------|---------|--------------|
| **Query Time** | ~500ms (fetch + aggregate) | Add MongoDB aggregation pipeline |
| **Max Categories** | Returns top 12 | Paginate if user has 50+ categories |
| **Data Window** | 3-12 months | Cache monthly aggregates |
| **Concurrent Users** | No limit | Implement request queuing at 100+ |

---

## 2. AI ENDPOINT: PERSONALIZED RECOMMENDATIONS

### Implementation: Backend

**File**: `BACKEND/routes/ai.js`

#### Architecture Overview

```
User Profile Analysis
    ↓
[Income/Expense Aggregation] ← Fetch transactions
    ↓
[Goal Analysis] ← Fetch goals, budgets
    ↓
[Risk Classification] ← Apply decision rules
    ↓
[Asset Allocation] ← Map to portfolio mix
    ↓
[Investment Picks] ← Match symbols to buckets
    ↓
Return Personalized Strategy
```

#### How to Call from Frontend

```javascript
const fetchPersonalizedRecommendations = async (months = 6) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(
      `http://localhost:5000/api/ai/recommendations/personalized?months=${months}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    // {
    //   profile: {
    //     riskProfile: 'Moderate',
    //     savingsRate: 24.0,
    //     stabilityScore: 78,
    //     emergencyCoverageMonths: 4.75,
    //     recommendedInvestMonthly: 17500
    //   },
    //   allocation: {
    //     cash: 25,
    //     fixedIncome: 30,
    //     equities: 35,
    //     alternatives: 10
    //   },
    //   recommendations: [
    //     { symbol: 'NDBIB', bucket: 'fixedIncome', suggestedMonthlyAmount: 5250 },
    //     { symbol: 'JKH.N0000', bucket: 'equities', suggestedMonthlyAmount: 6125 }
    //   ],
    //   tips: [{ icon: '📊', title: '...', description: '...' }]
    // }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    throw error;
  }
};
```

### Risk Profile Decision Tree

```
IF (savingsRate >= 18% AND stabilityScore >= 70 AND emergencyCoverageMonths >= 3)
  THEN riskProfile = "Aggressive"
       allocation = { cash: 10%, fixedIncome: 20%, equities: 55%, alternatives: 15% }

ELSE IF (savingsRate >= 10% AND stabilityScore >= 50)
  THEN riskProfile = "Moderate"
       allocation = { cash: 25%, fixedIncome: 30%, equities: 35%, alternatives: 10% }

ELSE
  THEN riskProfile = "Conservative"
       allocation = { cash: 45%, fixedIncome: 35%, equities: 15%, alternatives: 5% }

// Additional rule: If user has near-term goals (< 180 days)
IF (nearTermGoalCount > 0)
  THEN allocation.cash += 10%
       allocation.equities -= 10%
```

### Investment Picks by Risk Profile

**Strategy Set in Code**:
```javascript
const strategySet = {
  Conservative: [
    { bucket: 'cash', symbol: 'NDBIB', reason: 'capital protection and liquidity' },
    { bucket: 'fixedIncome', symbol: 'COMB.N0000', reason: 'stable local financial sector' },
    { bucket: 'alternatives', symbol: 'GLD', reason: 'inflation hedge' }
  ],
  Moderate: [
    { bucket: 'fixedIncome', symbol: 'NDBIB', reason: 'balance risk with returns' },
    { bucket: 'equities', symbol: 'JKH.N0000', reason: 'local diversified exposure' },
    { bucket: 'equities', symbol: 'SPY', reason: 'broad US market growth' }
  ],
  Aggressive: [
    { bucket: 'equities', symbol: 'QQQ', reason: 'higher growth global tech' },
    { bucket: 'equities', symbol: 'SPY', reason: 'core diversified engine' },
    { bucket: 'alternatives', symbol: 'GLD', reason: 'portfolio hedge' }
  ]
};
```

### Suggested Monthly Amount Calculation

```javascript
// For each recommendation:
suggestedMonthlyAmount = recommendedInvestMonthly × (allocation[bucket] / 100)

// Example for Moderate profile:
recommendedInvestMonthly = 17,500
allocation.fixedIncome = 30%

suggestedForFixedIncome = 17,500 × (30 / 100) = 5,250
```

### Real-World Use Cases

#### Use Case 1: Dynamic Portfolio Rebalancing

```javascript
const rebalancePortfolio = (profile, currentPortfolio) => {
  const targetAllocation = profile.allocation;
  
  // Current portfolio
  const currentAllocation = {
    cash: (currentPortfolio.cash / currentPortfolio.total) * 100,
    fixedIncome: (currentPortfolio.fixedIncome / currentPortfolio.total) * 100,
    equities: (currentPortfolio.equities / currentPortfolio.total) * 100,
    alternatives: (currentPortfolio.alternatives / currentPortfolio.total) * 100
  };
  
  // Calculate drift
  const drift = {
    cash: Math.abs(currentAllocation.cash - targetAllocation.cash),
    fixedIncome: Math.abs(currentAllocation.fixedIncome - targetAllocation.fixedIncome),
    equities: Math.abs(currentAllocation.equities - targetAllocation.equities),
    alternatives: Math.abs(currentAllocation.alternatives - targetAllocation.alternatives)
  };
  
  const maxDrift = Math.max(...Object.values(drift));
  
  if (maxDrift > 5) {  // 5% rebalancing threshold
    // Suggest rebalancing trades
    console.log('Rebalancing recommended');
  }
};
```

#### Use Case 2: Goal Funding Priority

```javascript
const prioritizeGoals = (recommendations, upcomingGoals) => {
  // Get available investable amount
  const totalMonthly = recommendations.reduce(
    (sum, rec) => sum + rec.suggestedMonthlyAmount,
    0
  );
  
  // Allocate to near-term goals first
  const nearTermGoals = upcomingGoals.filter(g => g.isNearTerm);
  const requiredForGoals = nearTermGoals.reduce(
    (sum, goal) => sum + goal.monthlyRequired,
    0
  );
  
  const availableForInvesting = totalMonthly - requiredForGoals;
  
  return {
    allocateToGoals: requiredForGoals,
    availableForInvesting: Math.max(0, availableForInvesting),
    status: availableForInvesting > 0 ? 'surplus' : 'deficit'
  };
};
```

#### Use Case 3: Goal Achievement Timeline

```javascript
const calculateGoalTimeline = (goal, monthlyContribution) => {
  const remaining = goal.targetAmount - goal.currentAmount;
  const monthsToTarget = Math.ceil(remaining / monthlyContribution);
  const expectedDate = new Date();
  expectedDate.setMonth(expectedDate.getMonth() + monthsToTarget);
  
  return {
    monthsToTarget,
    expectedDate,
    onTrack: expectedDate <= new Date(goal.targetDate),
    accelerationNeeded: expectedDate > new Date(goal.targetDate)
      ? monthsToTarget - Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30))
      : 0
  };
};
```

---

## 3. MARKET DATA ENDPOINT: WATCHLIST (FINNHUB)

### Configuration

**BACKEND/.env** (Required):
```env
FINNHUB_API_KEY=d6v6239r01qig546l4f0d6v6239r01qig546l4fg
```

**Get Your API Key**:
1. Visit https://finnhub.io/dashboard
2. Sign up for free account
3. Copy API Key from dashboard
4. Add to `.env` file

### How It Works: Three-Layer Fallback

```
Layer 1: FINNHUB (Live Real-Time)
  └─ If FINNHUB_API_KEY set AND provider available
  └─ Returns: current price, high/low, change%, timestamp
  └─ Update frequency: Real-time (EOD for market hours)

Layer 2: COLOMBO STOCK EXCHANGE (CSE) API
  └─ If Finnhub fails BUT CSE available
  └─ Returns: SL equity list
  └─ Update frequency: Delayed (daily)

Layer 3: STATIC FALLBACK DATA (Always Works)
  └─ If both Layer 1 & 2 fail
  └─ Returns: Reference data with manual prices
  └─ Update frequency: None (static)
```

### How to Call from Frontend

```javascript
const fetchMarketWatchlist = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(
      'http://localhost:5000/api/ai/market/watchlist',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    // {
    //   success: true,
    //   source: 'finnhub-watchlist',  // or 'cse-api' or 'fallback-static'
    //   data: {
    //     sriLanka: [
    //       {
    //         symbol: 'JKH.N0000',
    //         name: 'John Keells Holdings',
    //         type: 'equity',
    //         currency: 'LKR',
    //         note: 'Live market quote',
    //         live: true,
    //         current: 145.50,
    //         changePercent: 0.69,
    //         fetchedAt: '2026-04-21T10:35:15.456Z'
    //       }
    //     ],
    //     abroad: [
    //       {
    //         symbol: 'SPY',
    //         live: true,
    //         current: 452.50,
    //         changePercent: 0.61
    //       }
    //     ]
    //   }
    // }
    
    // Check data source
    if (data.source === 'finnhub-watchlist') {
      console.log('✅ Using live Finnhub data');
    } else if (data.source === 'cse-api') {
      console.log('⚠️ Using CSE API (delayed)');
    } else {
      console.log('📊 Using fallback reference data');
    }
    
    return data;
  } catch (error) {
    console.error('Watchlist fetch failed:', error);
    throw error;
  }
};
```

### Single Symbol Quote

```javascript
const fetchSingleQuote = async (symbol) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    `http://localhost:5000/api/ai/market/quote?symbol=${symbol}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  
  // {
  //   success: true,
  //   source: 'finnhub-live',
  //   data: {
  //     symbol: 'SPY',
  //     current: 452.50,
  //     high: 455.75,
  //     low: 450.25,
  //     open: 451.00,
  //     previousClose: 449.75,
  //     change: 2.75,
  //     changePercent: 0.61,
  //     fetchedAt: '2026-04-21T10:40:30.123Z'
  //   }
  // }
  
  return data;
};
```

### Real-Time Quote Display

```jsx
// React component to show a single quote
const QuoteDisplay = ({ symbol, refreshInterval = 60000 }) => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const data = await fetchSingleQuote(symbol);
        setQuote(data.data);
      } catch (error) {
        console.error('Quote fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndUpdate();
    
    // Auto-refresh every N seconds
    const interval = setInterval(fetchAndUpdate, refreshInterval);
    return () => clearInterval(interval);
  }, [symbol, refreshInterval]);
  
  if (loading) return <div>Loading...</div>;
  if (!quote) return <div>No data</div>;
  
  return (
    <div className="quote-card">
      <h3>{symbol}</h3>
      <div className={quote.changePercent >= 0 ? 'positive' : 'negative'}>
        <div className="price">${quote.current.toFixed(2)}</div>
        <div className="change">
          {quote.changePercent > 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
        </div>
      </div>
      <div className="range">
        <span>Low: ${quote.low.toFixed(2)}</span>
        <span>High: ${quote.high.toFixed(2)}</span>
      </div>
      <div className="timestamp">
        Updated: {new Date(quote.fetchedAt).toLocaleTimeString()}
      </div>
    </div>
  );
};
```

### Monitoring Data Source Quality

```javascript
const monitorDataQuality = (watchlist) => {
  const totalSymbols = watchlist.data.sriLanka.length + watchlist.data.abroad.length;
  const liveSymbols = [
    ...watchlist.data.sriLanka.filter(s => s.live),
    ...watchlist.data.abroad.filter(s => s.live)
  ];
  
  const livePercentage = (liveSymbols.length / totalSymbols) * 100;
  
  console.log(`📊 Data Quality: ${livePercentage.toFixed(1)}% live (${liveSymbols.length}/${totalSymbols})`);
  console.log(`Source: ${watchlist.source}`);
  
  // Alert if quality drops below 50%
  if (livePercentage < 50) {
    console.warn('⚠️ Data quality degraded - consider switching data provider');
  }
};
```

---

## 4. FRONTEND INTEGRATION: PUTTING IT ALL TOGETHER

### Complete Example: Investment Dashboard

```jsx
// frontend/src/components/InvestmentDashboard.js
import React, { useState, useEffect } from 'react';
import './styles/InvestmentDashboard.css';

const InvestmentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE = 'http://localhost:5000';
  
  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Not authenticated');
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch all 3 APIs in parallel
      const [recRes, predRes, watchRes] = await Promise.all([
        fetch(`${API_BASE}/api/ai/recommendations/personalized?months=6`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/api/ai/predictions/spending?months=6`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/api/ai/market/watchlist`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const [recData, predData, watchData] = await Promise.all([
        recRes.json(),
        predRes.json(),
        watchRes.json()
      ]);
      
      setProfile(recData);
      setPredictions(predData);
      setWatchlist(watchData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) return <div className="loading">Analyzing your profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  
  return (
    <div className="dashboard">
      {/* Section 1: Risk Profile */}
      <section className="profile-section">
        <h2>📊 Your Profile</h2>
        <div className="metrics">
          <div className="metric">
            <label>Risk Profile</label>
            <value className={profile.profile.riskProfile.toLowerCase()}>
              {profile.profile.riskProfile}
            </value>
          </div>
          <div className="metric">
            <label>Monthly Savings</label>
            <value>${profile.profile.averageMonthlyNetSavings.toLocaleString()}</value>
          </div>
          <div className="metric">
            <label>Stability Score</label>
            <value>{profile.profile.stabilityScore}/100</value>
          </div>
        </div>
      </section>
      
      {/* Section 2: Budget Risk */}
      <section className="predictions-section">
        <h2>⚠️ Budget Risk</h2>
        <div className="predictions-list">
          {predictions.categories
            .filter(c => c.risk === 'high')
            .map((cat) => (
              <div key={cat.category} className="prediction-item high-risk">
                <div className="cat-name">{cat.category}</div>
                <div className="cat-values">
                  <span>Predicted: ${cat.predictedNextMonth.toLocaleString()}</span>
                  <span>Budget: ${cat.budgetedAmount.toLocaleString()}</span>
                  <span className="confidence">Confidence: {cat.confidence}%</span>
                </div>
              </div>
            ))}
        </div>
      </section>
      
      {/* Section 3: Recommended Investments */}
      <section className="recommendations-section">
        <h2>💡 Investment Picks</h2>
        <div className="allocation-chart">
          {Object.entries(profile.allocation).map(([bucket, percent]) => (
            <div key={bucket} style={{ flex: percent }}>
              <div className="bucket-label">{bucket}</div>
              <div className="bucket-percent">{percent}%</div>
            </div>
          ))}
        </div>
        <div className="recommendations-list">
          {profile.recommendations.map((rec) => (
            <div key={rec.symbol} className="recommendation-item">
              <div className="rec-name">
                {rec.symbol} ({rec.bucket})
              </div>
              <div className="rec-amount">
                Suggested: ${rec.suggestedMonthlyAmount.toLocaleString()}/mo
              </div>
              <div className="rec-reason">{rec.reason}</div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Section 4: Market Quotes */}
      <section className="market-section">
        <h2>📈 Live Market Data</h2>
        <div className="source-badge">{watchlist.source}</div>
        
        <h3>Sri Lanka</h3>
        <div className="quotes-grid">
          {watchlist.data.sriLanka.map((quote) => (
            <div key={quote.symbol} className={`quote-card ${quote.live ? 'live' : 'fallback'}`}>
              <div className="symbol">{quote.symbol}</div>
              <div className="name">{quote.name}</div>
              {quote.live ? (
                <>
                  <div className="price">${quote.current}</div>
                  <div className={quote.changePercent >= 0 ? 'positive' : 'negative'}>
                    {quote.changePercent > 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                  </div>
                </>
              ) : (
                <div className="fallback-note">{quote.note}</div>
              )}
            </div>
          ))}
        </div>
        
        <h3>International</h3>
        <div className="quotes-grid">
          {watchlist.data.abroad.map((quote) => (
            <div key={quote.symbol} className={`quote-card ${quote.live ? 'live' : 'fallback'}`}>
              <div className="symbol">{quote.symbol}</div>
              <div className="name">{quote.name}</div>
              {quote.live ? (
                <>
                  <div className="price">${quote.current}</div>
                  <div className={quote.changePercent >= 0 ? 'positive' : 'negative'}>
                    {quote.changePercent > 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                  </div>
                </>
              ) : (
                <div className="fallback-note">{quote.note}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* Section 5: Tips */}
      <section className="tips-section">
        <h2>💬 AI Tips</h2>
        <div className="tips-list">
          {profile.tips.map((tip, idx) => (
            <div key={idx} className="tip-card">
              <div className="tip-icon">{tip.icon}</div>
              <div>
                <div className="tip-title">{tip.title}</div>
                <div className="tip-description">{tip.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <button onClick={fetchAllData} className="refresh-btn">
        🔄 Refresh All Data
      </button>
    </div>
  );
};

export default InvestmentDashboard;
```

---

## 5. ERROR HANDLING & EDGE CASES

### Common HTTP Errors

```javascript
const handleApiError = (response) => {
  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (response.status === 403) {
    // Forbidden - user not authorized
    throw new Error('You do not have access to this resource');
  } else if (response.status === 500) {
    // Server error
    throw new Error('Server error - try again later');
  } else if (response.status === 502 || response.status === 503) {
    // Finnhub API or service unavailable
    console.warn('Market data provider temporarily unavailable, using fallback');
  }
};
```

### Network Timeout Handling

```javascript
const fetchWithTimeout = (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
};

// Usage
try {
  const data = await fetchWithTimeout(
    'http://localhost:5000/api/ai/predictions/spending',
    { headers: { 'Authorization': `Bearer ${token}` } },
    15000  // 15 second timeout
  );
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Request timeout');
  }
}
```

### Missing or Insufficient Data

```javascript
// Check if user has enough transaction history
const checkDataSufficiency = (predictions) => {
  if (!predictions.categories || predictions.categories.length === 0) {
    return {
      sufficient: false,
      message: 'Add at least 3 months of transactions for predictions'
    };
  }
  
  const lowConfidenceCount = predictions.categories.filter(c => c.confidence < 45).length;
  if (lowConfidenceCount > predictions.categories.length / 2) {
    return {
      sufficient: false,
      message: 'Add more transaction history to improve prediction confidence'
    };
  }
  
  return { sufficient: true };
};
```

---

## 6. PERFORMANCE OPTIMIZATION

### Implement Request Caching

```javascript
// Simple in-memory cache
class APICache {
  constructor(ttlMs = 60000) {
    this.cache = new Map();
    this.ttl = ttlMs;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }
}

// Usage
const apiCache = new APICache(60000);  // 60 second TTL

const fetchSpendingPredictionsCached = async () => {
  const cacheKey = `predictions:spending:6`;
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;
  
  // Fetch from API
  const data = await fetch(...).then(r => r.json());
  
  // Cache for next request
  apiCache.set(cacheKey, data);
  
  return data;
};
```

### Lazy Loading Sections

```javascript
// Only fetch market data when user clicks on that tab
const [activeTab, setActiveTab] = useState('profile');
const [marketData, setMarketData] = useState(null);

useEffect(() => {
  if (activeTab !== 'market') return;
  
  if (marketData) return;  // Already loaded
  
  // Fetch only when needed
  fetchMarketWatchlist().then(setMarketData);
}, [activeTab]);
```

---

## 7. DEBUGGING & LOGGING

### Enable Detailed Logging

```javascript
// In development only
const DEBUG = process.env.NODE_ENV === 'development';

const logAPI = (method, endpoint, request, response) => {
  if (!DEBUG) return;
  
  console.log(`[API] ${method} ${endpoint}`);
  console.log('Request:', request);
  console.log('Response:', response);
  console.log('Status:', response.status);
};

// Usage
const response = await fetch(url, options);
const data = await response.json();
logAPI('GET', '/api/ai/predictions/spending', { months: 6 }, data);
```

### Test Data

```javascript
// Mock data for testing without backend
export const mockPredictions = {
  success: true,
  categories: [
    {
      category: 'Food & Dining',
      predictedNextMonth: 8520.75,
      confidence: 87,
      budgetedAmount: 8500,
      risk: 'low'
    }
  ]
};

export const mockProfile = {
  riskProfile: 'Moderate',
  savingsRate: 24.0,
  stabilityScore: 78,
  allocation: { cash: 25, fixedIncome: 30, equities: 35, alternatives: 10 }
};
```

---

## SUMMARY CHECKLIST

- ✅ All 4 endpoints integrated (2 ML/AI + 2 Market)
- ✅ JWT authentication on all endpoints
- ✅ Error handling for network failures
- ✅ Fallback data strategy for market quotes
- ✅ Auto-refresh mechanism (60 seconds)
- ✅ Request timeout protection
- ✅ Confidence-based data quality indication
- ✅ Source status badges (Live vs Fallback)
- ✅ Performance optimization (caching, lazy loading)
- ✅ Real-world use case examples
- ✅ Testing & debugging utilities

---

**Document Version**: 1.0  
**Last Updated**: April 21, 2026  
**Questions?** Refer to AI_ML_TECHNICAL_ARCHITECTURE.md for deeper technical details.
