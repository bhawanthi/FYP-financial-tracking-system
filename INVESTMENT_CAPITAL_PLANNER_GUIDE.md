# 💰 Investment Capital Planner - Complete Guide

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [How to Use](#how-to-use)
- [Currency Support (LKR, USD, EUR, GBP)](#currency-support)
- [Installation & Integration](#installation--integration)
- [API Documentation](#api-documentation)
- [Investment Calculations](#investment-calculations)
- [Troubleshooting](#troubleshooting)

---

## Overview

The **Investment Capital Planner** is an interactive financial tool that helps users:
- Calculate projected returns on investments
- Compare simple vs. compound interest
- Get AI-powered investment assessments
- Choose from 8+ investment vehicles (Banks, Stocks, Bonds, ETFs)
- Support multiple currencies (LKR, USD, EUR, GBP)
- Export reports as PDF or text

**Key Statistics:**
- 8+ Investment Options
- 4 Currency Support (LKR🇱🇰, USD🇺🇸, EUR🇪🇺, GBP🇬🇧)
- Real-time Interest Rates
- Compound Interest Calculations
- Risk-based Assessments

---

## Features

### 1. **Multi-Currency Support**
- **LKR** (Sri Lankan Rupees) - Default
- **USD** (US Dollar)
- **EUR** (Euro)
- **GBP** (British Pound)

### 2. **Investment Options**
```javascript
// Available Investment Vehicles:
1. Commercial Bank PLC        - 10% p.a. | Low Risk
2. HSBC Bank PLC              - 8.5% p.a. | Very Low Risk
3. Standard Chartered Bank     - 9% p.a. | Low Risk
4. Sampath Bank PLC            - 8% p.a. | Low Risk
5. Bank of Ceylon              - 7.5% p.a. | Low Risk
6. Dialog Axiata PLC           - 6.5% p.a. | Medium Risk
7. Colombo Stock ETF           - 11% p.a. | Medium Risk
8. Government Bond (3-Year)    - 5.5% p.a. | Very Low Risk
```

### 3. **Duration Options**
- **3 Months** (Quarterly)
- **6 Months** (Semi-annual)
- **Annual** (1 Year)

### 4. **Calculation Methods**
- **Simple Interest Calculator**: Principal × Rate × Time
- **Compound Interest Calculator**: Principal × (1 + Rate)^Time - Principal
- **Automatic Comparison**: Visual difference between both methods

### 5. **Risk Assessment**
- **Very Low Risk**: Government bonds, large banks
- **Low Risk**: Established commercial banks
- **Medium Risk**: Telecom, ETF funds
- **Rating System**: 5-star risk evaluation

### 6. **Export Capabilities**
- 📄 Print/Save as Text file
- 📊 Download as PDF (with styling)
- 📈 Share reports with financial advisors

---

## How to Use

### Step 1: Enter Investment Amount
```
1. Click on the "Amount to invest" input field
2. Enter the amount you plan to invest (e.g., 10000)
3. Select currency from dropdown (LKR, USD, EUR, GBP)
4. System shows minimum investment requirement
```

**Example:**
```
Amount: 10000
Currency: USD 🇺🇸
```

### Step 2: Select Investment Duration
```
1. Choose one of three options:
   ✓ 3 Months  (smallest gains, quick returns)
   ✓ 6 Months  (balanced gains)
   ✓ Annual    (maximum gains with longer lock-in)
```

**Timeline:**
- **3 Months**: Great for testing investment strategies
- **6 Months**: Good balance between safety and returns
- **Annual**: Best for commitments with predictable income

### Step 3: Choose Investment Company
```
1. Click on "Choose a company" dropdown
2. Browse through 8+ investment options
3. Each shows:
   - Company name (e.g., HSBC Bank PLC)
   - Trading symbol (e.g., HSBC.CM)
   - Interest rate (e.g., 8.5%)
   - Risk level (Very Low, Low, Medium)
```

**Selection Criteria:**
```
Conservative Investor?     → HSBC or Government Bond
Balanced Investor?         → Commercial Bank PLC or Standard Chartered
Aggressive Investor?       → Colombo Stock ETF or Dialog Axiata
```

### Step 4: Calculate Returns
```
1. Click the "💰 Calculate Return" button
2. System processes calculations automatically
3. View results including:
   ✓ Simple interest projections
   ✓ Compound interest projections
   ✓ AI assessment & advice
   ✓ Risk evaluation
```

### Step 5: Review Results
The calculation results include:

**📊 Results Section:**
```
Selected company:     Commercial Bank PLC
Interest rate:        10% (annual)
Investment:           LKR 10,000
Duration:             3 Months

📈 Simple Interest:
  Projected interest: LKR 250
  Projected total:    LKR 10,250

📈 Compound Interest:
  Compound interest:  LKR 252.50
  Compound total:     LKR 10,252.50

💡 Comparison:
  Simple gain:        LKR 250
  Compound gain:      LKR 252.50
  Extra (Compound):   LKR 2.50
```

### Step 6: Get AI Assessment
```
The system provides:
✅ Overall recommendation (Excellent/Good/Fair/Poor)
📌 Personalized advice (3-4 tips)
⚠️ Risk evaluation matching your profile
🎯 Suitability assessment
```

**Example Assessment:**
```
✅ Very safe investment

Advice:
1. Perfect for conservative investors
2. Excellent returns for investment period
3. Good for testing investment strategy

Overall: Looks good for your profile
Risk Level: Low
```

### Step 7: Export Report
```
1. Click "📄 Print / Save PDF" button
2. Choose save location on your computer
3. File downloaded as: investment-plan-[timestamp].txt
4. Share with financial advisor or keep records
```

---

## Currency Support

### How Currency Selection Works

#### **1. LKR (Sri Lankan Rupees)** - Default
```javascript
// Display Format: Rs 10,000.00
// Conversion Rate: 1 LKR = 1
// Use for: Local Sri Lankan investments

Example:
Amount: Rs 10,000
Total: Rs 10,250
```

#### **2. USD (US Dollars)** - International
```javascript
// Display Format: $ 10,000.00
// Conversion Rate: 1 USD = 303.5 LKR (approx)
// Use for: International investments, forex

Example:
Amount: $ 300
Total: $ 330
```

#### **3. EUR (Euros)** - European
```javascript
// Display Format: € 10,000.00
// Conversion Rate: 1 EUR = 333.85 LKR (approx)
// Use for: European investments

Example:
Amount: € 1,000
Total: € 1,085
```

#### **4. GBP (British Pounds)** - UK
```javascript
// Display Format: £ 10,000.00
// Conversion Rate: 1 GBP = 380.05 LKR (approx)
// Use for: UK investments, sterling bonds

Example:
Amount: £ 500
Total: £ 530
```

### Switching Currencies

**Step-by-Step:**

```javascript
1. Default Currency Selection:
   - Form loads with "LKR 🇱🇰" selected
   - All rates are in local currency

2. Change Currency:
   - Click currency dropdown next to amount input
   - Options: LKR 🇱🇰, USD 🇺🇸, EUR 🇪🇺, GBP 🇬🇧
   - Click to select

3. View Updated Values:
   - Input field uses new currency
   - All calculations auto-update
   - Results display in selected currency
   - Company rates convert automatically

4. Export in Selected Currency:
   - PDF export uses your selected currency
   - Report shows all amounts in chosen currency
   - Exchange rate noted in disclaimer
```

### Real Exchange Rates

For **production**, update rates in the component:

```javascript
// Current Exchange Rates (as of last update)
const exchangeRates = {
  LKR: 1,           // Base currency
  USD: 1,           // 1 USD
  EUR: 1.1,         // 1 EUR = 1.1 USD
  GBP: 0.88         // 1 GBP = 0.88 USD
};

// In LKR (multiply by 303.5):
const exchangeRatesLKR = {
  LKR: 1,
  USD: 303.5,
  EUR: 333.85,
  GBP: 267.08
};
```

### Example: Converting 10,000 to USD

```javascript
// Scenario: User has Rs 10,000, wants to invest in USD

1. Select "USD 🇺🇸" from currency dropdown
2. Convert LKR to USD: 10,000 LKR ÷ 303.5 = ~32.97 USD
3. Enter amount: 33 USD
4. Choose Commercial Bank PLC (10% annual)
5. Select 3 Months
6. Calculate:
   - Interest: 33 × 0.10 × 0.25 = $0.825
   - Total: $33.825
7. View results in USD with proper formatting

4. Results display:
   Amount: $ 33.00
   Interest (Simple): $ 0.83
   Total: $ 33.83
```

---

## Installation & Integration

### 1. Add Component to React Routes

**File:** `frontend/src/App.js`

```javascript
import InvestmentCapitalPlanner from './components/InvestmentCapitalPlanner';

// In your routes:
<Route path="/investment-planner" element={<InvestmentCapitalPlanner />} />
```

### 2. Add Navigation Link

**File:** `frontend/src/components/Navigation.js` or `Sidebar.js`

```javascript
<nav>
  {/* ... other nav items ... */}
  <Link to="/investment-planner">
    💰 Investment Capital Planner
  </Link>
</nav>
```

### 3. Update Reports Component

If integrating with existing Reports component:

```javascript
// In frontend/src/components/Reports.js
import InvestmentCapitalPlanner from './InvestmentCapitalPlanner';

// Add tab:
<div className="reports-tabs">
  <button onClick={() => setActiveTab('investment')}>
    💰 Investment Planner
  </button>
</div>

// Show component:
{activeTab === 'investment' && <InvestmentCapitalPlanner />}
```

### 4. Styles Integration

Ensure CSS file is imported:

```javascript
// In InvestmentCapitalPlanner.js
import './styles/InvestmentCapitalPlanner.css';
```

### 5. Dependencies Required

Check `package.json`:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.x",
    "axios": "^1.0.0"
  }
}
```

If missing, install:
```bash
npm install axios react-router-dom
```

### 6. Environment Variables (Optional)

**File:** `.env` in frontend root

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CURRENCY_API=https://api.exchangerate-api.com/v4/latest
```

---

## API Documentation

### Backend Integration

If you want to fetch company data from backend, create an endpoint:

**File:** `BACKEND/routes/investments.js`

```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all investment options
router.get('/companies', auth, (req, res) => {
  const companies = [
    {
      id: 'commercial-bank-plc',
      name: 'Commercial Bank PLC',
      symbol: 'COMB.N0000',
      type: 'Bank',
      interestRate: 10,
      riskLevel: 'Low',
      minInvestment: 1000,
      description: 'Leading private commercial bank'
    },
    // ... more companies
  ];
  res.json(companies);
});

// Calculate investment returns
router.post('/calculate', auth, (req, res) => {
  const { amount, currency, duration, companyId } = req.body;
  
  // Validation
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // Find company
  const company = companies.find(c => c.id === companyId);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }

  // Calculate
  const durationMap = { '3m': 0.25, '6m': 0.5, 'annual': 1 };
  const years = durationMap[duration] || 1;
  const rate = company.interestRate / 100;
  const simpleInterest = amount * rate * years;
  const compoundInterest = amount * (Math.pow(1 + rate, years) - 1);

  res.json({
    company: company.name,
    amount,
    currency,
    duration,
    simpleInterest: Math.round(simpleInterest * 100) / 100,
    compoundInterest: Math.round(compoundInterest * 100) / 100,
    riskLevel: company.riskLevel
  });
});

module.exports = router;
```

Update **server.js**:

```javascript
const investmentRoutes = require('./routes/investments');
app.use('/api/investments', investmentRoutes);
```

### Frontend API Integration

In `InvestmentCapitalPlanner.js`, replace hardcoded data:

```javascript
useEffect(() => {
  // Fetch from backend
  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/investments/companies', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCompanies(response.data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      // Fallback to hardcoded data
      initializeCompanies();
    }
  };
  
  fetchCompanies();
}, []);

// Update calculateReturns to use API:
const calculateReturns = async () => {
  const response = await axios.post('/api/investments/calculate', {
    amount: investmentAmount,
    currency,
    duration,
    companyId: selectedCompany
  }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  
  // Use response data
  setCalculation(response.data);
};
```

---

## Investment Calculations

### Formula 1: Simple Interest
```
Formula: SI = Principal × Rate × Time
         ST = Principal + SI

Where:
  SI = Simple Interest
  ST = Simple Total
  Principal = Investment Amount
  Rate = Annual Interest Rate (%)
  Time = Duration in years

Example:
  Principal: Rs 10,000
  Rate: 10% p.a.
  Time: 3 months (0.25 years)
  
  SI = 10,000 × 0.10 × 0.25 = Rs 250
  ST = 10,000 + 250 = Rs 10,250
```

### Formula 2: Compound Interest
```
Formula: CI = Principal × (1 + Rate)^Time - Principal
         CT = Principal + CI

Where:
  CI = Compound Interest
  CT = Compound Total
  Rate = Annual Interest Rate (%)
  Time = Duration in years

Example:
  Principal: Rs 10,000
  Rate: 10% p.a.
  Time: 3 months (0.25 years)
  
  CT = 10,000 × (1.10)^0.25 = Rs 10,240.06
  CI = 10,240.06 - 10,000 = Rs 240.06
```

### Monthly Compound Interest
```
Formula: CT = P × (1 + r/12)^n

Where:
  P = Principal
  r = Annual Rate (as decimal)
  n = Number of months

Example for 3 months:
  CT = 10,000 × (1 + 0.10/12)^3
  CT = 10,000 × (1.00833)^3
  CT = 10,252.50
  CI = Rs 252.50
```

### Interest Comparison Table

```
Duration  | Principal | Rate | Simple Interest | Compound Interest | Difference
----------|-----------|------|-----------------|-------------------|------------
3 Months  | 10,000    | 10%  | 250             | 252.50            | +2.50
6 Months  | 10,000    | 10%  | 500             | 506.23            | +6.23
1 Year    | 10,000    | 10%  | 1,000           | 1,100             | +100

* Compound interest always ≥ Simple interest
* Difference increases with longer duration and higher rates
```

### Risk Assessment Algorithm

```javascript
function generateAssessment(amount, interest, company, user) {
  let rating = 0;
  let advice = [];
  let type = 'success';

  // Risk-based rating (0-5)
  const riskScores = {
    'Very Low': 5,
    'Low': 4,
    'Medium': 3,
    'High': 2
  };
  
  rating = riskScores[company.riskLevel];

  // Return quality check
  const returnRatio = interest / amount;
  if (returnRatio > 0.2) {
    advice.push('Excellent returns for investment period');
  } else if (returnRatio > 0.1) {
    advice.push('Good returns for investment period');
  } else {
    advice.push('Modest returns - consider longer duration');
  }

  // Amount suitability
  if (amount < 50000) {
    advice.push('Good for testing investment strategy');
  } else if (amount < 500000) {
    advice.push('Substantial investment - good diversification');
  }

  // Final assessment
  let overallStatement = 'Looks good for your profile';
  if (rating < 3 && user.riskProfile === 'conservative') {
    type = 'warning';
    overallStatement = 'May not match your risk profile';
  }

  return { type, rating, advice, overallStatement };
}
```

---

## Troubleshooting

### Issue 1: Currency Not Converting
**Problem:** Selected currency doesn't show calculations

**Solution:**
```javascript
// Check currency rates are set
console.log('Exchange rates:', exchangeRates);

// Verify component state updates
const [currency, setCurrency] = useState('LKR');
console.log('Current currency:', currency);

// Reset component
<button onClick={() => window.location.reload()}>Reset</button>
```

### Issue 2: Company Data Not Loading
**Problem:** "Company not found" error

**Solution:**
```javascript
// Verify companies array
console.log('Companies:', companies);
console.log('Selected company ID:', selectedCompany);

// Check company exists in array
const found = companies.find(c => c.id === selectedCompany);
console.log('Company found:', found);

// Re-initialize if needed
<button onClick={() => initializeCompanies()}>Reload Companies</button>
```

### Issue 3: Calculations Incorrect
**Problem:** Results don't match manual calculations

**Solution:**
```javascript
// Verify formula: SI = P × R × T
const principal = 10000;
const rate = 0.10;  // 10%
const time = 0.25;  // 3 months
const si = principal * rate * time;
console.log('Expected SI:', si); // Should be 250

// Check compound interest: CI = P × (1+R)^T - P
const ci = principal * Math.pow(1 + rate, time) - principal;
console.log('Expected CI:', ci); // Should be ~240.06
```

### Issue 4: PDF Export Not Working
**Problem:** Print button doesn't download file

**Solution:**
```javascript
// Check browser supports download
if (!document.createElement('a').download) {
  alert('Your browser does not support downloads');
}

// Use alternative: copy to clipboard
const exportText = generateReportText();
navigator.clipboard.writeText(exportText);
alert('Report copied to clipboard!');
```

### Issue 5: Minimum Investment Validation
**Problem:** Can enter amount below minimum

**Solution:**
```javascript
// Add validation in form
<input
  type="number"
  min={selectedCompanyData?.minInvestment || 1000}
  onChange={(e) => {
    if (parseFloat(e.target.value) < minInvestment) {
      setAssessment({ type: 'error', message: 'Below minimum' });
    }
    setInvestmentAmount(e.target.value);
  }}
/>
```

### Issue 6: Styling Not Loading
**Problem:** Component looks unstyled

**Solution:**
```javascript
// Verify CSS import
import './styles/InvestmentCapitalPlanner.css';

// Check file exists at correct path
// File should be: frontend/src/components/styles/InvestmentCapitalPlanner.css

// Clear browser cache
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)

// Restart dev server
npm start
```

---

## Next Steps

### 1. **Integration with Backend**
- [ ] Create `/api/investments/companies` endpoint
- [ ] Add investment history tracking
- [ ] Save user calculations to database

### 2. **Advanced Features**
- [ ] Real-time interest rate updates
- [ ] Investment portfolio management
- [ ] Recurring investment calculator
- [ ] Tax implications calculator
- [ ] Inflation adjustment

### 3. **Enhanced Security**
- [ ] Add JWT authentication
- [ ] Validate user data on backend
- [ ] Encrypt sensitive calculations
- [ ] Implement rate limiting

### 4. **Mobile Optimization**
- [ ] Test responsive design on devices
- [ ] Add touch-friendly controls
- [ ] Optimize for slow connections

### 5. **Analytics**
- [ ] Track popular investments
- [ ] Monitor calculation accuracy
- [ ] User engagement metrics

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready
