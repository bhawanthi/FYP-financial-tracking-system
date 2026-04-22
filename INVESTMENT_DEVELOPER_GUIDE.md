# 💰 Investment Capital Planner - Developer Implementation Guide

## Overview

The Investment Capital Planner is a complete investment calculator system with:
- **Frontend Component:** React-based UI with multi-currency support
- **Backend Service:** Node.js service handling calculations
- **REST API:** 10+ endpoints for investment operations
- **Database Ready:** Place for saving investment history

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  InvestmentCapitalPlanner.js + CSS Styling          │
└────────────────┬────────────────────────────────────┘
                 │ HTTP/AXIOS
┌────────────────▼────────────────────────────────────┐
│              BACKEND (Express.js)                    │
│  /api/investments/*  routes                         │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│            BUSINESS LOGIC SERVICE                    │
│  investmentPlannerService.js                        │
│  - Calculations                                     │
│  - Company Data                                     │
│  - Assessment Logic                                │
│  - Report Generation                               │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│            DATABASE (Optional)                      │
│  - User History                                     │
│  - Saved Calculations                              │
│  - Investment Preferences                          │
└─────────────────────────────────────────────────────┘
```

---

## File Structure

```
Finance_Tracker/
├── BACKEND/
│   ├── services/
│   │   └── investmentPlannerService.js    ✨ Core service
│   ├── routes/
│   │   └── investments.js                 ✨ API endpoints
│   └── server.js                          ✏️ (UPDATED)
│
├── frontend/
│   └── src/
│       └── components/
│           ├── InvestmentCapitalPlanner.js    ✨ React component
│           └── styles/
│               └── InvestmentCapitalPlanner.css ✨ Styling
│
├── INVESTMENT_CAPITAL_PLANNER_GUIDE.md         ✨ User guide
└── INVESTMENT_QUICK_REFERENCE.md               ✨ Quick ref
```

---

## Installation & Setup

### Step 1: Backend Setup

#### 1a. Verify Routes Integration
```bash
# File: BACKEND/server.js
# Check line 49-50:
app.use('/api/investments', require('./routes/investments'));
```

#### 1b. Verify Service Availability
```bash
# File: BACKEND/services/investmentPlannerService.js
# Should be created (check size > 10KB)
```

#### 1c. Test Backend
```bash
cd BACKEND
npm install  # If not already done
npm start
```

Visit: `http://localhost:5000/api/investments/companies`
Should return 200 + JSON array of companies

### Step 2: Frontend Setup

#### 2a. Add Component Import
```javascript
// File: frontend/src/App.js
import InvestmentCapitalPlanner from './components/InvestmentCapitalPlanner';
```

#### 2b. Add Route
```javascript
// File: frontend/src/App.js (in your Routes):
<Route path="/investment-planner" element={<InvestmentCapitalPlanner />} />
```

#### 2c. Add Navigation Link
```javascript
// File: frontend/src/components/Navigation.js (or Sidebar.js):
<Link to="/investment-planner">💰 Investment Capital Planner</Link>
```

#### 2d. Start Frontend
```bash
cd frontend
npm install  # If needed
npm start
```

### Step 3: Verify Installation

```bash
# ✅ Backend API endpoint works
curl http://localhost:5000/api/investments/companies

# ✅ Frontend loads component
Visit: http://localhost:3000/investment-planner

# ✅ Component calculates
1. Enter 10000
2. Select "3m"
3. Select "Commercial Bank PLC"
4. Click Calculate
5. Should show results
```

---

## API Reference

### Base URL
```
http://localhost:5000/api/investments
```

### Authentication
```
Headers: Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

#### 1. GET /companies
**Get all investment companies**

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/investments/companies
```

Response:
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": "commercial-bank-plc",
      "name": "Commercial Bank PLC",
      "symbol": "COMB.N0000",
      "type": "Bank",
      "interestRate": 10,
      "riskLevel": "Low",
      "minInvestment": 1000,
      "description": "...",
      "creditRating": "A"
    }
  ]
}
```

#### 2. GET /companies/:id
**Get specific company**

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/investments/companies/commercial-bank-plc
```

#### 3. POST /calculate
**Calculate investment returns**

```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "currency": "LKR",
    "duration": "3m",
    "companyId": "commercial-bank-plc"
  }' \
  http://localhost:5000/api/investments/calculate
```

Response:
```json
{
  "success": true,
  "data": {
    "calculation": {
      "company": "Commercial Bank PLC",
      "investmentAmount": 10000,
      "currency": "LKR",
      "duration": "3m",
      "interestRate": 10,
      "simpleInterest": {
        "interest": 250,
        "total": 10250
      },
      "compoundInterest": {
        "interest": 252.5,
        "total": 10252.5
      },
      "extraGain": 2.5
    },
    "assessment": {
      "type": "success",
      "message": "✅ Safe investment with good returns",
      "advice": ["Good choice for balanced portfolio"],
      "rating": 4,
      "overallStatement": "Looks good for your profile"
    }
  }
}
```

#### 4. POST /compare
**Compare multiple investments**

```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "currency": "LKR",
    "duration": "3m",
    "companyIds": ["commercial-bank-plc", "hsbc-bank", "ceybank-etf"]
  }' \
  http://localhost:5000/api/investments/compare
```

#### 5. POST /recommendations
**Get personalized recommendations**

```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "investmentAmount": 50000,
    "riskTolerance": "medium"
  }' \
  http://localhost:5000/api/investments/recommendations
```

#### 6. POST /convert
**Convert currencies**

```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "fromCurrency": "LKR",
    "toCurrency": "USD"
  }' \
  http://localhost:5000/api/investments/convert
```

#### 7. GET /exchange-rates
**Get current exchange rates**

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/investments/exchange-rates
```

#### 8. POST /report
**Generate detailed report**

```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "calculation": { /* calculation object */ },
    "assessment": { /* assessment object */ }
  }' \
  http://localhost:5000/api/investments/report
```

#### 9. POST /save
**Save calculation to history**

```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "calculation": { /* calculation object */ },
    "assessment": { /* assessment object */ }
  }' \
  http://localhost:5000/api/investments/save
```

#### 10. GET /history
**Get user's calculation history**

```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/investments/history
```

---

## Component Integration Examples

### Example 1: Direct Component Usage
```javascript
// In any React component
import InvestmentCapitalPlanner from './components/InvestmentCapitalPlanner';

function App() {
  return (
    <div>
      <InvestmentCapitalPlanner />
    </div>
  );
}
```

### Example 2: Tab Integration (like Reports)
```javascript
import InvestmentCapitalPlanner from './components/InvestmentCapitalPlanner';

function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('overview')}>Overview</button>
        <button onClick={() => setActiveTab('investment')}>💰 Investment Planner</button>
      </div>
      
      {activeTab === 'investment' && <InvestmentCapitalPlanner />}
    </div>
  );
}
```

### Example 3: Modal Popup
```javascript
import InvestmentCapitalPlanner from './components/InvestmentCapitalPlanner';

function Dashboard() {
  const [showPlanner, setShowPlanner] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPlanner(true)}>
        💰 Open Investment Planner
      </button>
      
      {showPlanner && (
        <div className="modal" onClick={() => setShowPlanner(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setShowPlanner(false)}>×</button>
            <InvestmentCapitalPlanner />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Service Usage (Backend)

### Direct Service Usage
```javascript
const investmentService = require('./services/investmentPlannerService');

// Get all companies
const companies = investmentService.getAllCompanies();

// Calculate returns
const calculation = investmentService.calculateReturns({
  amount: 10000,
  currency: 'LKR',
  duration: '3m',
  companyId: 'commercial-bank-plc'
});

// Generate assessment
const assessment = investmentService.generateAssessment(calculation);

// Convert currency
const converted = investmentService.convertCurrency(10000, 'LKR', 'USD');

// Generate report
const report = investmentService.generateReport(calculation, assessment);
```

---

## Customization Guide

### Adding New Company

**File:** `BACKEND/services/investmentPlannerService.js`

```javascript
this.companies = [
  // ... existing companies
  {
    id: 'dialog-mobile',
    name: 'Dialog Mobile PLC',
    symbol: 'DLMB.CM',
    type: 'Telecom',
    interestRate: 7.5,
    riskLevel: 'Medium',
    minInvestment: 3000,
    description: 'Telecom company with growth potential',
    creditRating: 'BBB-',
    yields: { '3m': 5, '6m': 6.5, 'annual': 7.5 }
  }
  // ...
];
```

### Changing Interest Rate

```javascript
// Option 1: Direct modification
const bank = this.companies.find(c => c.id === 'commercial-bank-plc');
bank.interestRate = 11; // New rate

// Option 2: Fetch from API
router.get('/companies', auth, async (req, res) => {
  // Fetch from real API
  const companies = await fetchFromBankAPI();
  res.json(companies);
});
```

### Updating Exchange Rates

**File:** `BACKEND/services/investmentPlannerService.js`

```javascript
this.exchangeRates = {
  LKR: 1,
  USD: 305.0,  // Updated
  EUR: 335.0,  // Updated
  GBP: 270.0   // Updated
};

// Or fetch from live API:
async getExchangeRates() {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/LKR');
  const data = await response.json();
  return data.rates;
}
```

### Customizing Assessment Logic

**File:** `BACKEND/services/investmentPlannerService.js`

```javascript
generateAssessment(calculation, userProfile = {}) {
  // Add custom business logic here
  if (calculation.investmentAmount > 1000000) {
    assessment.advice.push('Consider premium banking options');
  }
  
  // Add risk-based recommendations
  if (userProfile.loanStatus === 'active') {
    assessment.advice.push('Ensure emergency fund available');
  }
  
  return assessment;
}
```

---

## Frontend Customization

### Change Colors
**File:** `frontend/src/components/styles/InvestmentCapitalPlanner.css`

```css
/* Change primary gradient */
.btn-primary {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  color: white;
}

/* Change header background */
.ip-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### Change Form Layout
```css
/* Make form single column on desktop */
.ip-form-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Stack buttons vertically */
.ip-controls {
  flex-direction: column;
}

.ip-controls button {
  width: 100%;
}
```

### Localization (LKR/USD)
**File:** `frontend/src/components/InvestmentCapitalPlanner.js`

```javascript
// Set default currency by region
const getDefaultCurrency = () => {
  const userLocale = navigator.language;
  if (userLocale.includes('en-LK')) return 'LKR';
  if (userLocale.includes('en-US')) return 'USD';
  if (userLocale.includes('en-GB')) return 'GBP';
  return 'LKR'; // Default
};

const [currency, setCurrency] = useState(getDefaultCurrency());
```

---

## Database Integration

### Create Investment History Model

**File:** `BACKEND/models/Investment.js`

```javascript
const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  calculation: {
    company: String,
    amount: Number,
    currency: String,
    duration: String,
    interestRate: Number,
    projectedInterest: Number,
    projectedTotal: Number
  },
  assessment: {
    message: String,
    advice: [String],
    rating: Number
  },
  status: {
    type: String,
    enum: ['calculated', 'invested', 'completed'],
    default: 'calculated'
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Investment', InvestmentSchema);
```

### Update Save/Retrieve Methods

```javascript
// In routes/investments.js
const Investment = require('../models/Investment');

router.post('/save', auth, async (req, res) => {
  try {
    const investment = new Investment({
      userId: req.user.id,
      calculation: req.body.calculation,
      assessment: req.body.assessment
    });
    await investment.save();
    res.json({ success: true, data: investment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.id })
      .sort({ savedAt: -1 })
      .limit(10);
    res.json({ success: true, data: investments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## Testing

### Unit Tests (Backend Service)

```javascript
// test/investment.test.js
const investmentService = require('../services/investmentPlannerService');

describe('Investment Service', () => {
  it('should calculate simple interest correctly', () => {
    const result = investmentService.calculateSimpleInterest(10000, 10, 0.25);
    expect(result.interest).toBe(250);
    expect(result.total).toBe(10250);
  });

  it('should get company by ID', () => {
    const company = investmentService.getCompanyById('commercial-bank-plc');
    expect(company.name).toBe('Commercial Bank PLC');
    expect(company.interestRate).toBe(10);
  });

  it('should convert currencies', () => {
    const usd = investmentService.convertCurrency(10000, 'LKR', 'USD');
    expect(usd).toBeCloseTo(32.97, 2);
  });
});
```

### Component Tests (Frontend)

```javascript
// test/InvestmentCapitalPlanner.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import InvestmentCapitalPlanner from '../components/InvestmentCapitalPlanner';

describe('InvestmentCapitalPlanner', () => {
  it('renders component', () => {
    render(<InvestmentCapitalPlanner />);
    expect(screen.getByText(/Investment Capital Planner/)).toBeInTheDocument();
  });

  it('calculates returns on button click', () => {
    render(<InvestmentCapitalPlanner />);
    const calculateBtn = screen.getByText(/Calculate Return/);
    fireEvent.click(calculateBtn);
    // Add assertions
  });
});
```

---

## Deployment Checklist

- [ ] Backend service tested
- [ ] API endpoints verified
- [ ] Frontend component renders
- [ ] Integration test passed
- [ ] Images/icons optimized
- [ ] Documentation reviewed
- [ ] Error handling tested
- [ ] Currency conversion verified
- [ ] Mobile responsiveness checked
- [ ] Performance optimized

---

## Troubleshooting

### Issue: 404 Not Found on API
```
Solution:
1. Check server.js has the route: 
   app.use('/api/investments', require('./routes/investments'));
2. Verify investments.js file exists
3. Restart backend: npm start
4. Test: curl http://localhost:5000/api/investments/companies
```

### Issue: Component Not Loading
```
Solution:
1. Check file path: frontend/src/components/InvestmentCapitalPlanner.js
2. Verify import: import InvestmentCapitalPlanner from './components/InvestmentCapitalPlanner';
3. Check CSS import: import './styles/InvestmentCapitalPlanner.css';
4. Console for errors: F12 → Console
```

### Issue: Calculations Wrong
```
Solution:
1. Verify formula in service:
   SI = P × R × T
   CI = P × (1+R)^T - P
2. Check rates are percentages (10, not 0.10)
3. Check duration conversion (3m = 0.25 years)
4. Debug: console.log calculation values
```

---

## Next Improvements

- [ ] Real-time interest rate API integration
- [ ] Investment portfolio dashboard
- [ ] Recurring investment calculator
- [ ] Tax impact calculator
- [ ] Inflation adjustment
- [ ] Risk return scatter plot
- [ ] Mobile app integration
- [ ] Email report delivery
- [ ] Investment alerts
- [ ] Social sharing features

---

**Version:** 1.0  
**Updated:** 2024  
**Status:** Production Ready  
**Support:** See INVESTMENT_CAPITAL_PLANNER_GUIDE.md
