# 📡 Reports API - Testing & Examples Guide

## Overview

This guide provides real examples of how to use all Report and Bank Ratings endpoints.

---

## Prerequisites

```bash
# Get your auth token
TOKEN="your_jwt_token_here"

# Base URL
BASE_URL="http://localhost:5000"
```

---

## 1. COMPREHENSIVE REPORT

### Get Full Financial Report

```bash
curl -X GET \
  "$BASE_URL/api/reports/comprehensive?dateRange=30d" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Query Parameters:**
- `dateRange` (optional): "7d", "30d", "90d", "12m" (default: "30d")

**Sample Response:**
```json
{
  "success": true,
  "report": {
    "timestamp": "2024-01-20T10:30:00Z",
    "period": {
      "label": "Last 30 Days",
      "startDate": "2023-12-21T00:00:00.000Z",
      "endDate": "2024-01-20T00:00:00.000Z"
    },
    "summary": {
      "totalIncome": 150000,
      "totalExpenses": 95000,
      "netSavings": 55000,
      "savingsRate": 36,
      "transactionCount": 45,
      "averageTransactionSize": 2111
    },
    "analytics": {
      "categoryBreakdown": {
        "Groceries": 25000,
        "Transport": 15000,
        "Utilities": 12000,
        "Entertainment": 18000,
        "Other": 25000
      },
      "budgetStatus": [
        {
          "id": "budget123",
          "category": "Groceries",
          "budgetAmount": 30000,
          "spent": 25000,
          "percentageUsed": 83.33,
          "status": "under",
          "remaining": 5000
        }
      ],
      "goalsStatus": [
        {
          "id": "goal123",
          "name": "Vacation Fund",
          "targetAmount": 100000,
          "savedAmount": 45000,
          "progress": 45,
          "daysRemaining": 180,
          "status": "in-progress"
        }
      ],
      "topExpenseCategory": "Groceries",
      "largestTransaction": 5000
    },
    "mlInsights": {
      "healthScore": 78,
      "healthRating": {
        "level": "Good",
        "emoji": "✅",
        "color": "#3b82f6"
      },
      "healthComponents": {
        "budgetAdherence": 85.5,
        "savingsRate": 78.0,
        "expenseStability": 72.5,
        "financialActivity": 85.0
      },
      "spendingForecast": [
        {
          "month": 1,
          "predicted": 94000,
          "confidence": 0.85
        },
        {
          "month": 2,
          "predicted": 96000,
          "confidence": 0.80
        },
        {
          "month": 3,
          "predicted": 98000,
          "confidence": 0.75
        }
      ],
      "anomalies": [
        {
          "transactionId": "txn123",
          "date": "2024-01-15T00:00:00Z",
          "amount": 8000,
          "category": "Entertainment",
          "deviation": 150,
          "severity": "High",
          "message": "Unusual spending detected: 150% higher than average"
        }
      ],
      "recommendations": [
        {
          "type": "Balanced Growth",
          "allocation": "60% Stocks, 40% Bonds/Assets",
          "instruments": ["Mixed Funds", "Dividend Stocks"],
          "riskLevel": "Medium",
          "expectedReturn": "6-8% annually",
          "suitable": true
        }
      ]
    },
    "metadata": {
      "calculationMethod": "Linear Regression with Statistical Analysis",
      "confidentTransactions": 45,
      "reportGeneratedAt": "2024-01-20T10:30:00Z",
      "dataIntegrity": "Complete"
    }
  }
}
```

---

## 2. SPENDING FORECAST

### Get 3-Month Spending Predictions

```bash
curl -X GET \
  "$BASE_URL/api/reports/spending-forecast" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Sample Response:**
```json
{
  "success": true,
  "forecast": {
    "success": true,
    "predictions": [
      {
        "month": 1,
        "predicted": 94000
      },
      {
        "month": 2,
        "predicted": 96000
      },
      {
        "month": 3,
        "predicted": 98000
      }
    ],
    "confidence": 0.85,
    "methodology": "Linear Regression with Seasonal Decomposition",
    "baseData": [90000, 92000, 94000, 93000, 95000, 96000]
  },
  "generatedAt": "2024-01-20T10:30:00Z"
}
```

---

## 3. FINANCIAL HEALTH SCORE

### Get Detailed Health Assessment

```bash
curl -X GET \
  "$BASE_URL/api/reports/health-score" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Sample Response:**
```json
{
  "success": true,
  "health": {
    "success": true,
    "overallScore": 78,
    "components": {
      "budgetAdherence": 85.5,
      "savingsRate": 78.0,
      "expenseStability": 72.5,
      "financialActivity": 85.0
    },
    "details": {
      "monthlyIncome": 150000,
      "monthlyExpenses": 95000,
      "netSavings": 55000,
      "savingsPercentage": 36,
      "transactionCount": 45
    },
    "rating": {
      "level": "Good",
      "emoji": "✅",
      "color": "#3b82f6"
    },
    "suggestions": [
      "You're doing great! Keep up with your current financial discipline.",
      "Consider increasing savings to 40% for better financial security."
    ]
  },
  "generatedAt": "2024-01-20T10:30:00Z"
}
```

---

## 4. BUDGET OPTIMIZATION

### Get Budget Recommendations

```bash
curl -X GET \
  "$BASE_URL/api/reports/budget-optimization" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Sample Response:**
```json
{
  "success": true,
  "optimization": {
    "success": true,
    "recommendations": [
      {
        "category": "Groceries",
        "currentAllocation": 25000,
        "recommendedAllocation": 28750,
        "averageSpending": 25000,
        "maxSpending": 28000,
        "variance": 1250.5,
        "confidence": 0.95,
        "reason": "Current budget is below average spending"
      },
      {
        "category": "Entertainment",
        "currentAllocation": 15000,
        "recommendedAllocation": 22500,
        "averageSpending": 18000,
        "maxSpending": 24000,
        "variance": 2100.3,
        "confidence": 0.85,
        "reason": "Adequate budget with good margin"
      }
    ],
    "totalRecommended": 125000,
    "totalAverage": 110000
  },
  "generatedAt": "2024-01-20T10:30:00Z"
}
```

---

## 5. INVESTMENT RECOMMENDATIONS

### Get Personalized Investment Strategy

```bash
curl -X GET \
  "$BASE_URL/api/reports/investment-recommendations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Sample Response:**
```json
{
  "success": true,
  "recommendations": {
    "success": true,
    "recommendations": [
      {
        "type": "Balanced Growth",
        "allocation": "60% Stocks, 40% Bonds/Assets",
        "instruments": ["Mixed Funds", "Dividend Stocks", "Government Bonds"],
        "riskLevel": "Medium",
        "expectedReturn": "6-8% annually",
        "suitable": true
      },
      {
        "type": "Conservative Growth",
        "allocation": "40% Stocks, 60% Bonds/Savings",
        "instruments": ["Bond Funds", "Dividend Stocks", "Fixed Deposits"],
        "riskLevel": "Low",
        "expectedReturn": "4-6% annually",
        "suitable": true
      }
    ],
    "monthlyInvestableSavings": 38500,
    "disclaimer": "These recommendations are AI-generated..."
  },
  "generatedAt": "2024-01-20T10:30:00Z"
}
```

---

## 6. ANOMALY DETECTION

### Get Unusual Spending Patterns

```bash
curl -X GET \
  "$BASE_URL/api/reports/anomalies" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Sample Response:**
```json
{
  "success": true,
  "anomalies": {
    "success": true,
    "anomaliesDetected": 2,
    "anomalies": [
      {
        "transactionId": "txn123",
        "date": "2024-01-15T00:00:00Z",
        "amount": 8000,
        "category": "Entertainment",
        "deviation": 150,
        "severity": "High",
        "message": "Unusual spending detected: 150% higher than average"
      },
      {
        "transactionId": "txn124",
        "date": "2024-01-10T00:00:00Z",
        "amount": 35000,
        "category": "Shopping",
        "deviation": 200,
        "severity": "High",
        "message": "Unusual spending detected: 200% higher than average"
      }
    ],
    "methodology": "Z-score Anomaly Detection",
    "threshold": "2 standard deviations"
  },
  "generatedAt": "2024-01-20T10:30:00Z"
}
```

---

## 7. BANK RATINGS - SEARCH

### Search Bank by Name

```bash
curl -X GET \
  "$BASE_URL/api/bank-ratings/search?bankName=Commercial+Bank+of+Ceylon" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Sample Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-20T10:30:00Z",
  "bankRating": {
    "bankName": "Commercial Bank of Ceylon",
    "country": "Sri Lanka",
    "creditRating": "BB+",
    "outlook": "Positive",
    "lastUpdated": "2024-01-18T00:00:00Z",
    "financialStrength": 7.8,
    "customerTrustScore": 8.3,
    "riskLevel": "Moderate",
    "npl": 2.1,
    "cet1Ratio": 12.5,
    "roi": 1.5,
    "roe": 11.8,
    "description": "Leading private commercial bank with strong growth trajectory",
    "regulatoryApproval": "Sri Lanka Central Bank regulated",
    "services": ["Retail Banking", "Corporate Banking", "Digital Banking"],
    "branches": 270,
    "atms": 520,
    "officeNumber": "+94 11 2461000",
    "website": "www.combank.lk",
    "riskScore": 24.5,
    "recommendation": {
      "level": "Safe",
      "emoji": "🟢",
      "advice": "Good choice with minimal risk"
    },
    "investmentSuitability": "Suitable - Lower Medium Quality"
  },
  "metadata": {
    "source": "Moody's Analytics / Central Bank of Sri Lanka",
    "website": "https://www.moodys.com",
    "rateTheBankWebsite": "https://www.ratethebank.com",
    "lastFetch": "2024-01-20T10:30:00Z"
  }
}
```

---

## 8. BANK RATINGS - LIST

### Get All Available Banks

```bash
curl -X GET \
  "$BASE_URL/api/bank-ratings/list" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Sample Response:**
```json
{
  "success": true,
  "count": 5,
  "banks": [
    {
      "name": "Bank of Ceylon",
      "creditRating": "B+",
      "country": "Sri Lanka"
    },
    {
      "name": "Commercial Bank of Ceylon",
      "creditRating": "BB+",
      "country": "Sri Lanka"
    },
    {
      "name": "Standard Chartered",
      "creditRating": "A",
      "country": "Sri Lanka"
    },
    {
      "name": "HSBC Bank PLC",
      "creditRating": "AA",
      "country": "Sri Lanka"
    },
    {
      "name": "Sampath Bank PLC",
      "creditRating": "BB",
      "country": "Sri Lanka"
    }
  ],
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

## 9. BANK RATINGS - COMPARE

### Compare Multiple Banks

```bash
curl -X GET \
  "$BASE_URL/api/bank-ratings/compare?banks=HSBC,Standard+Chartered,Commercial+Bank+of+Ceylon" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Bank comparison functionality",
  "requestedBanks": ["HSBC", "Standard Chartered", "Commercial Bank of Ceylon"],
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

## 10. EXPORT - PDF

### Export Report as PDF

```bash
curl -X GET \
  "$BASE_URL/api/reports/export/pdf?dateRange=30d" \
  -H "Authorization: Bearer $TOKEN" \
  -o financial-report.pdf
```

**Parameters:**
- `dateRange` (optional): "7d", "30d", "90d", "12m"

---

## 11. EXPORT - EXCEL

### Export Report as Excel

```bash
curl -X GET \
  "$BASE_URL/api/reports/export/excel?dateRange=30d" \
  -H "Authorization: Bearer $TOKEN" \
  -o financial-report.xlsx
```

**Parameters:**
- `dateRange` (optional): "7d", "30d", "90d", "12m"

---

## Testing with Postman

### 1. Create Collection
- Import to Postman
- Set base URL variable: `{{base_url}}`
- Set token variable: `{{token}}`

### 2. Environment Variables
```json
{
  "base_url": "http://localhost:5000",
  "token": "your_jwt_token_here"
}
```

### 3. Pre-request Script
```javascript
// Auto-refresh token if needed
if (pm.environment.get('token_expires') < Date.now()) {
  // Refresh token logic
}
```

---

## JavaScript/Fetch Examples

### Get Comprehensive Report
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch(
  'http://localhost:5000/api/reports/comprehensive?dateRange=30d',
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.report);
```

### Search Bank
```javascript
const bankName = 'Commercial Bank of Ceylon';
const token = localStorage.getItem('authToken');

const response = await fetch(
  `http://localhost:5000/api/bank-ratings/search?bankName=${bankName}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

if (response.ok) {
  const data = await response.json();
  console.log(data.bankRating);
} else {
  console.error('Bank not found');
}
```

### Get Health Score
```javascript
const token = localStorage.getItem('authToken');

const response = await fetch(
  'http://localhost:5000/api/reports/health-score',
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(`Health Score: ${data.health.overallScore}/100`);
console.log(`Rating: ${data.health.rating.level}`);
```

---

## Axios Examples

### Setup
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
});
```

### Get All Data
```javascript
const [reportData, healthData, forecasts] = await Promise.all([
  api.get('/api/reports/comprehensive'),
  api.get('/api/reports/health-score'),
  api.get('/api/reports/spending-forecast')
]);
```

---

## Error Handling

### Common Errors & Solutions

**401 Unauthorized**
```javascript
if (response.status === 401) {
  // Token expired, redirect to login
  window.location.href = '/login';
}
```

**404 Not Found**
```javascript
if (response.status === 404) {
  // Resource not found
  console.error('Bank not found - use /list to see available banks');
}
```

**500 Server Error**
```javascript
if (response.status === 500) {
  // Server error, check backend logs
  console.error('Server error:', response.data.message);
}
```

---

## Rate Limiting

Current implementation has no rate limiting. For production, add:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Performance Tips

1. **Cache Results**
   - Cache health score for 1 hour
   - Cache bank ratings for 24 hours

2. **Pagination**
   - Limit transactions to 1000 per request
   - Use offset/limit for large datasets

3. **Compression**
   - Enable gzip compression
   - Minify JSON responses

---

## Testing Checklist

- [ ] Test all endpoints with valid token
- [ ] Test with invalid/expired token (should return 401)
- [ ] Test with invalid date range (should default to 30d)
- [ ] Test with non-existent bank (should return 404)
- [ ] Test PDF export functionality
- [ ] Test Excel export functionality
- [ ] Test anomaly detection with outliers
- [ ] Test predictions with small dataset (<6 months)
- [ ] Test health score with no budget
- [ ] Test recommendations with zero savings

---

## Debugging Tips

### Enable Verbose Logging
```bash
# Backend
DEBUG=* npm start

# Frontend (in console)
localStorage.setItem('debug', '*');
```

### Check Network Requests
1. Open Browser DevTools
2. Go to Network tab
3. Check request/response headers and bodies

### Backend Logs
```bash
tail -f BACKEND/logs/*.log
```

---

**Happy Testing!** 🚀
