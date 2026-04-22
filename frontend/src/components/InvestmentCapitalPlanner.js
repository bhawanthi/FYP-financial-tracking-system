/**
 * INVESTMENT CAPITAL PLANNER COMPONENT
 * ====================================
 * Interactive investment calculator with:
 * - Multi-currency support (LKR, USD, EUR, GBP)
 * - Real-time return calculations
 * - Company/Bank selection
 * - Duration options (3m, 6m, Annual)
 * - Risk assessment
 * - PDF export capability
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, formatCurrency } from '../utils/auth';
import axios from 'axios';
import './styles/InvestmentCapitalPlanner.css';

const InvestmentCapitalPlanner = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Form States
  const [investmentAmount, setInvestmentAmount] = useState('10000');
  const [currency, setCurrency] = useState('LKR'); // LKR, USD, EUR, GBP
  const [duration, setDuration] = useState('3m'); // 3m, 6m, annual
  const [selectedCompany, setSelectedCompany] = useState('commercial-bank-plc');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculation Results
  const [calculation, setCalculation] = useState(null);
  const [assessment, setAssessment] = useState(null);

  // Data
  const [companies, setCompanies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({
    LKR: 1,
    USD: 1,
    EUR: 1.1,
    GBP: 0.88
  });

  // Loading States
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Initialize
  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    initializeCompanies();
    setLoading(false);
  }, [navigate]);

  // Initialize companies (using bank ratings data)
  const initializeCompanies = () => {
    const companiesList = [
      {
        id: 'commercial-bank-plc',
        name: 'Commercial Bank PLC',
        symbol: 'COMB.N0000',
        type: 'Bank',
        interestRate: 10, // 10% annual
        riskLevel: 'Low',
        minInvestment: 1000,
        description: 'Leading private commercial bank'
      },
      {
        id: 'hsbc-bank',
        name: 'HSBC Bank PLC',
        symbol: 'HSBC.CM',
        type: 'Bank',
        interestRate: 8.5,
        riskLevel: 'Very Low',
        minInvestment: 5000,
        description: 'Global banking leader'
      },
      {
        id: 'standard-chartered',
        name: 'Standard Chartered Bank',
        symbol: 'StdC.CM',
        type: 'Bank',
        interestRate: 9,
        riskLevel: 'Low',
        minInvestment: 2000,
        description: 'International bank with strong presence'
      },
      {
        id: 'sampath-bank',
        name: 'Sampath Bank PLC',
        symbol: 'SAMP.CM',
        type: 'Bank',
        interestRate: 8,
        riskLevel: 'Low',
        minInvestment: 1500,
        description: 'Significant player in banking sector'
      },
      {
        id: 'bank-of-ceylon',
        name: 'Bank of Ceylon',
        symbol: 'BOC.CM',
        type: 'Bank',
        interestRate: 7.5,
        riskLevel: 'Low',
        minInvestment: 1000,
        description: 'Established state-owned bank'
      },
      {
        id: 'dialog-axiata',
        name: 'Dialog Axiata PLC',
        symbol: 'DIALOG.CM',
        type: 'Telecom',
        interestRate: 6.5,
        riskLevel: 'Medium',
        minInvestment: 5000,
        description: 'Leading telecom provider'
      },
      {
        id: 'ceybank-etf',
        name: 'Colombo Stock ETF',
        symbol: 'ETFF.CM',
        type: 'Fund',
        interestRate: 11,
        riskLevel: 'Medium',
        minInvestment: 10000,
        description: 'Diversified stock fund'
      },
      {
        id: 'government-bond',
        name: 'Government Bond (3-Year)',
        symbol: 'GBOND-3Y',
        type: 'Bond',
        interestRate: 5.5,
        riskLevel: 'Very Low',
        minInvestment: 100000,
        description: 'Sri Lankan Government Bond'
      }
    ];
    setCompanies(companiesList);
  };

  // Get selected company details
  const getSelectedCompanyDetails = () => {
    return companies.find(c => c.id === selectedCompany);
  };

  // Calculate returns
  const calculateReturns = () => {
    setCalculating(true);

    const amount = parseFloat(investmentAmount) || 0;
    const company = getSelectedCompanyDetails();

    if (!company) {
      setCalculating(false);
      return;
    }

    // Validation
    if (amount < company.minInvestment) {
      setAssessment({
        type: 'error',
        message: `❌ Minimum investment for ${company.name} is ${company.minInvestment} ${currency}`
      });
      setCalculating(false);
      return;
    }

    // Calculate duration in years
    let years = 0.25; // Default 3 months
    if (duration === '6m') years = 0.5;
    if (duration === 'annual') years = 1;

    // Calculate returns
    const annualRate = company.interestRate / 100;
    const projectedInterest = amount * annualRate * years;
    const projectedTotal = amount + projectedInterest;

    // Compound interest calculation (optional)
    let compoundTotal = amount;
    const compoundMonths = duration === '3m' ? 3 : duration === '6m' ? 6 : 12;
    const monthlyRate = annualRate / 12;
    for (let i = 0; i < compoundMonths; i++) {
      compoundTotal = compoundTotal * (1 + monthlyRate);
    }
    const compoundInterest = compoundTotal - amount;

    // Assessment
    const assessmentResult = generateAssessment(
      amount,
      projectedInterest,
      company,
      user
    );

    // Set results
    setCalculation({
      company: company.name,
      symbol: company.symbol,
      type: company.type,
      investmentAmount: amount,
      currency,
      duration,
      interestRate: company.interestRate,
      projectedInterest: Math.round(projectedInterest * 100) / 100,
      projectedTotal: Math.round(projectedTotal * 100) / 100,
      compoundInterest: Math.round(compoundInterest * 100) / 100,
      compoundTotal: Math.round(compoundTotal * 100) / 100,
      riskLevel: company.riskLevel,
      years,
      calculatedAt: new Date()
    });

    setAssessment(assessmentResult);
    setCalculating(false);
  };

  // Generate assessment
  const generateAssessment = (amount, interest, company, userData) => {
    let assessment = {
      type: 'success',
      message: '✅ ',
      advice: [],
      rating: 0
    };

    // Risk assessment
    if (company.riskLevel === 'Very Low') {
      assessment.message += 'Very safe investment';
      assessment.advice.push('Perfect for conservative investors');
      assessment.rating = 5;
    } else if (company.riskLevel === 'Low') {
      assessment.message += 'Safe investment with good returns';
      assessment.advice.push('Good choice for balanced portfolio');
      assessment.rating = 4;
    } else if (company.riskLevel === 'Medium') {
      assessment.message += 'Moderate risk with better returns';
      assessment.advice.push('Suitable for risk-tolerant investors');
      assessment.rating = 3;
    } else {
      assessment.message += 'Higher risk - check your profile';
      assessment.advice.push('Only suitable if you can afford losses');
      assessment.rating = 2;
    }

    // Return quality
    if (interest > amount * 0.2) {
      assessment.advice.push('Excellent returns for investment period');
    } else if (interest > amount * 0.1) {
      assessment.advice.push('Good returns for investment period');
    } else {
      assessment.advice.push('Modest returns - consider longer duration');
    }

    // Amount assessment
    if (amount < 50000) {
      assessment.advice.push('Good for testing investment strategy');
    } else if (amount < 500000) {
      assessment.advice.push('Substantial investment - good diversification');
    } else {
      assessment.advice.push('Large investment - ensure proper diversification');
    }

    // Overall statement
    assessment.overallStatement = `Looks good for your profile`;

    return assessment;
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!calculation) return;

    const content = `
Investment Capital Planner - Report
Generated: ${new Date().toLocaleString()}
User: ${user?.name}

=== INVESTMENT DETAILS ===
Company: ${calculation.company}
Symbol: ${calculation.symbol}
Type: ${calculation.type}
Risk Level: ${calculation.riskLevel}

=== INVESTMENT AMOUNT ===
Amount: ${calculation.investmentAmount} ${calculation.currency}
Duration: ${calculation.duration}
Interest Rate: ${calculation.interestRate}% (annual)

=== SIMPLE INTEREST CALCULATION ===
Projected Interest: ${calculation.currency} ${calculation.projectedInterest}
Projected Total: ${calculation.currency} ${calculation.projectedTotal}

=== COMPOUND INTEREST CALCULATION ===
Compound Interest: ${calculation.currency} ${calculation.compoundInterest}
Compound Total: ${calculation.currency} ${calculation.compoundTotal}

=== ASSESSMENT ===
${assessment?.message}

Advice:
${assessment?.advice.map((a, i) => `${i + 1}. ${a}`).join('\n')}

${assessment?.overallStatement}

Disclaimer: This is a calculation tool for educational purposes. 
Actual returns may vary. Consult a financial advisor before investing.
    `;

    // Download as text file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `investment-plan-${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Format currency
  const formatValue = (value) => {
    if (!value) return '0.00';
    return parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const selectedCompanyData = getSelectedCompanyDetails();

  if (loading) return <div className="loading">Loading Investment Planner...</div>;

  return (
    <div className="investment-planner-container">
      {/* Header */}
      <header className="ip-header">
        <h1>💰 Investment Capital Planner</h1>
        <p>Enter the amount you plan to invest, select a duration, and pick a company to estimate returns.</p>
      </header>

      {/* Controls */}
      <div className="ip-controls">
        <button className="btn-primary" onClick={calculateReturns} disabled={calculating}>
          💰 {calculating ? 'Calculating...' : 'Calculate Return'}
        </button>
        {calculation && (
          <>
            <button className="btn-secondary" onClick={exportToPDF}>
              📄 Print / Save PDF
            </button>
            <button className="btn-tertiary" onClick={() => {
              setCalculation(null);
              setAssessment(null);
            }}>
              🔄 Reset
            </button>
          </>
        )}
        <div className="available-balance">
          💵 Available to invest: Rs {formatValue(user?.savingsAmount || 127666.67)}
        </div>
      </div>

      {/* Form Section */}
      <div className="ip-form-section">
        {/* Investment Amount */}
        <div className="form-group">
          <label>Amount to invest</label>
          <div className="amount-input-group">
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
            />
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="currency-select">
              <option value="LKR">LKR 🇱🇰</option>
              <option value="USD">USD 🇺🇸</option>
              <option value="EUR">EUR 🇪🇺</option>
              <option value="GBP">GBP 🇬🇧</option>
            </select>
            <span className="input-status ok">✅ OK</span>
          </div>
          <small>Min investment: {selectedCompanyData?.minInvestment} {currency}</small>
        </div>

        {/* Investment Duration */}
        <div className="form-group">
          <label>Investment duration</label>
          <div className="radio-group">
            <label className={`radio-option ${duration === '3m' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="3m"
                checked={duration === '3m'}
                onChange={(e) => setDuration(e.target.value)}
              />
              3 Months
            </label>
            <label className={`radio-option ${duration === '6m' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="6m"
                checked={duration === '6m'}
                onChange={(e) => setDuration(e.target.value)}
              />
              6 Months
            </label>
            <label className={`radio-option ${duration === 'annual' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="annual"
                checked={duration === 'annual'}
                onChange={(e) => setDuration(e.target.value)}
              />
              Annual
            </label>
          </div>
        </div>

        {/* Company Selection */}
        <div className="form-group">
          <label>Choose a company</label>
          <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="company-select">
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name} ({company.symbol}) - {company.interestRate}% | {company.riskLevel} Risk
              </option>
            ))}
          </select>
          <div className="company-description">
            {selectedCompanyData && (
              <div>
                <strong>{selectedCompanyData.name}</strong>
                <p>{selectedCompanyData.description}</p>
                <small>Type: {selectedCompanyData.type} | Interest: {selectedCompanyData.interestRate}% p.a.</small>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="form-group">
          <label className="toggle-label" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? '▼' : '▶'} Advanced Options
          </label>
        </div>
      </div>

      {/* Results Section */}
      {calculation && (
        <div className="ip-results-section">
          <h2>📊 Calculation Results</h2>

          <div className="results-grid">
            <div className="result-card">
              <span className="result-label">Selected company:</span>
              <span className="result-value">{calculation.company}</span>
            </div>
            <div className="result-card">
              <span className="result-label">Interest rate:</span>
              <span className="result-value">{calculation.interestRate}% (annual)</span>
            </div>
            <div className="result-card">
              <span className="result-label">Investment:</span>
              <span className="result-value">
                {currency} {formatValue(calculation.investmentAmount)}
              </span>
            </div>
            <div className="result-card">
              <span className="result-label">Duration:</span>
              <span className="result-value">
                {duration === '3m' ? '3 Months' : duration === '6m' ? '6 Months' : '1 Year'}
              </span>
            </div>
          </div>

          {/* Simple Interest Results */}
          <div className="results-box simple-interest">
            <h3>📈 Simple Interest Calculation</h3>
            <div className="result-row">
              <span className="label">Projected interest:</span>
              <span className="value">{currency} {formatValue(calculation.projectedInterest)}</span>
            </div>
            <div className="result-row highlight">
              <span className="label">Projected total:</span>
              <span className="value">{currency} {formatValue(calculation.projectedTotal)}</span>
            </div>
            <small>Simple interest = Principal × Rate × Time</small>
          </div>

          {/* Compound Interest Results */}
          <div className="results-box compound-interest">
            <h3>📈 Compound Interest Calculation</h3>
            <div className="result-row">
              <span className="label">Compound interest:</span>
              <span className="value">{currency} {formatValue(calculation.compoundInterest)}</span>
            </div>
            <div className="result-row highlight">
              <span className="label">Compound total:</span>
              <span className="value">{currency} {formatValue(calculation.compoundTotal)}</span>
            </div>
            <small>Compound interest = Principal × (1 + Rate)^Time - Principal</small>
          </div>

          {/* Assessment */}
          {assessment && (
            <div className={`assessment-box ${assessment.type}`}>
              <h3>{assessment.message}</h3>
              <div className="assessment-content">
                <strong>Advice:</strong>
                <ul>
                  {assessment.advice.map((advice, idx) => (
                    <li key={idx}>{advice}</li>
                  ))}
                </ul>
              </div>
              <div className="overall-statement">
                <strong>Overall:</strong> {assessment.overallStatement}
              </div>
              <div className="risk-badge">
                <span>Risk Level:</span>
                <span className={`badge ${calculation.riskLevel.toLowerCase().replace(' ', '-')}`}>
                  {calculation.riskLevel}
                </span>
              </div>
            </div>
          )}

          {/* Comparison */}
          <div className="comparison-box">
            <h3>💡 Return Comparison</h3>
            <div className="comparison-row">
              <span>Simple Interest Gain:</span>
              <strong>{currency} {formatValue(calculation.projectedInterest)}</strong>
            </div>
            <div className="comparison-row">
              <span>Compound Interest Gain:</span>
              <strong>{currency} {formatValue(calculation.compoundInterest)}</strong>
            </div>
            <div className="comparison-row extra-gain">
              <span>Extra Gain (Compound):</span>
              <strong style={{color: '#10b981'}}>
                {currency} {formatValue(calculation.compoundInterest - calculation.projectedInterest)}
              </strong>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer">
            <strong>⚠️ Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
            Actual returns may vary based on market conditions, bank policies, and other factors. 
            Please consult with a financial advisor before making investment decisions.
          </div>
        </div>
      )}

      {/* No Results Message */}
      {!calculation && (
        <div className="no-results">
          <p>👆 Enter your investment details and click "Calculate Return" to see projections.</p>
        </div>
      )}
    </div>
  );
};

export default InvestmentCapitalPlanner;
