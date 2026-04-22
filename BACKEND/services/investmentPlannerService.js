/**
 * INVESTMENT CAPITAL PLANNER SERVICE
 * ===================================
 * Backend service for investment calculations
 * Handles company data, interest calculations, and assessments
 */

const Investment = require('../models/Investment');
const User = require('../models/User');

class InvestmentCapitalPlannerService {
  constructor() {
    this.companies = [
      {
        id: 'commercial-bank-plc',
        name: 'Commercial Bank PLC',
        symbol: 'COMB.N0000',
        type: 'Bank',
        interestRate: 10,
        riskLevel: 'Low',
        minInvestment: 1000,
        description: 'Leading private commercial bank in Sri Lanka',
        creditRating: 'A',
        yields: { '3m': 10, '6m': 10, 'annual': 10 }
      },
      {
        id: 'hsbc-bank',
        name: 'HSBC Bank PLC',
        symbol: 'HSBC.CM',
        type: 'Bank',
        interestRate: 8.5,
        riskLevel: 'Very Low',
        minInvestment: 5000,
        description: 'Global banking leader with strong Sri Lanka presence',
        creditRating: 'AA-',
        yields: { '3m': 8.5, '6m': 8.5, 'annual': 8.5 }
      },
      {
        id: 'standard-chartered',
        name: 'Standard Chartered Bank',
        symbol: 'StdC.CM',
        type: 'Bank',
        interestRate: 9,
        riskLevel: 'Low',
        minInvestment: 2000,
        description: 'International bank with strong presence in Asia',
        creditRating: 'A',
        yields: { '3m': 9, '6m': 9, 'annual': 9 }
      },
      {
        id: 'sampath-bank',
        name: 'Sampath Bank PLC',
        symbol: 'SAMP.CM',
        type: 'Bank',
        interestRate: 8,
        riskLevel: 'Low',
        minInvestment: 1500,
        description: 'Significant player in Sri Lankan banking sector',
        creditRating: 'A-',
        yields: { '3m': 8, '6m': 8, 'annual': 8 }
      },
      {
        id: 'bank-of-ceylon',
        name: 'Bank of Ceylon',
        symbol: 'BOC.CM',
        type: 'Bank',
        interestRate: 7.5,
        riskLevel: 'Low',
        minInvestment: 1000,
        description: 'Oldest commercial bank in Sri Lanka',
        creditRating: 'A',
        yields: { '3m': 7.5, '6m': 7.5, 'annual': 7.5 }
      },
      {
        id: 'dialog-axiata',
        name: 'Dialog Axiata PLC',
        symbol: 'DIALOG.CM',
        type: 'Telecom',
        interestRate: 6.5,
        riskLevel: 'Medium',
        minInvestment: 5000,
        description: 'Leading telecom provider with dividend returns',
        creditRating: 'BBB+',
        yields: { '3m': 5, '6m': 6, 'annual': 6.5 }
      },
      {
        id: 'ceybank-etf',
        name: 'Colombo Stock Exchange ETF',
        symbol: 'ETFF.CM',
        type: 'Fund',
        interestRate: 11,
        riskLevel: 'Medium',
        minInvestment: 10000,
        description: 'Diversified stock fund tracking CSE index',
        creditRating: 'BBB',
        yields: { '3m': 8, '6m': 10, 'annual': 11 }
      },
      {
        id: 'government-bond',
        name: 'Government Bond (3-Year)',
        symbol: 'GBOND-3Y',
        type: 'Bond',
        interestRate: 5.5,
        riskLevel: 'Very Low',
        minInvestment: 100000,
        description: 'Sri Lankan Government Treasury Bond',
        creditRating: 'A',
        yields: { '3m': 5, '6m': 5.5, 'annual': 5.5 }
      }
    ];

    this.exchangeRates = {
      LKR: 1,
      USD: 303.5,
      EUR: 333.85,
      GBP: 267.08
    };
  }

  /**
   * Get all available investment companies
   */
  getAllCompanies() {
    return this.companies;
  }

  /**
   * Get company by ID
   */
  getCompanyById(id) {
    return this.companies.find(c => c.id === id);
  }

  /**
   * Validate investment amount
   */
  validateAmount(amount, company) {
    const errors = [];

    if (!amount || amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (amount < company.minInvestment) {
      errors.push(`Minimum investment for ${company.name} is ${company.minInvestment}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate simple interest
   * Formula: SI = P × R × T
   */
  calculateSimpleInterest(principal, rate, timeInYears) {
    const simpleInterest = principal * (rate / 100) * timeInYears;
    const simpleTotal = principal + simpleInterest;

    return {
      interest: Math.round(simpleInterest * 100) / 100,
      total: Math.round(simpleTotal * 100) / 100
    };
  }

  /**
   * Calculate compound interest
   * Formula: CI = P × (1 + R)^T - P
   */
  calculateCompoundInterest(principal, rate, timeInYears, compoundingPeriod = 12) {
    const rateDecimal = rate / 100;
    const n = compoundingPeriod; // compounds per year
    const t = timeInYears;

    const compoundTotal = principal * Math.pow(1 + rateDecimal / n, n * t);
    const compoundInterest = compoundTotal - principal;

    return {
      interest: Math.round(compoundInterest * 100) / 100,
      total: Math.round(compoundTotal * 100) / 100
    };
  }

  /**
   * Convert duration string to years
   */
  durationToYears(duration) {
    const durations = {
      '3m': 0.25,
      '6m': 0.5,
      'annual': 1
    };
    return durations[duration] || 1;
  }

  /**
   * Get appropriate interest rate based on duration
   * Some investments have different rates for different periods
   */
  getEffectiveRate(company, duration) {
    if (company.yields && company.yields[duration]) {
      return company.yields[duration];
    }
    return company.interestRate;
  }

  /**
   * Main calculation function
   */
  calculateReturns(investmentData) {
    const {
      amount,
      currency = 'LKR',
      duration = 'annual',
      companyId
    } = investmentData;

    // Find company
    const company = this.getCompanyById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    // Validate amount
    const validation = this.validateAmount(amount, company);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Convert duration to years
    const years = this.durationToYears(duration);

    // Get effective rate for duration
    const effectiveRate = this.getEffectiveRate(company, duration);

    // Calculate simple interest
    const simpleCalc = this.calculateSimpleInterest(amount, effectiveRate, years);

    // Calculate compound interest (monthly compounding)
    const compoundCalc = this.calculateCompoundInterest(amount, effectiveRate, years, 12);

    return {
      company: company.name,
      symbol: company.symbol,
      type: company.type,
      investmentAmount: amount,
      currency,
      duration,
      years,
      interestRate: effectiveRate,
      riskLevel: company.riskLevel,
      creditRating: company.creditRating,
      minInvestment: company.minInvestment,
      description: company.description,
      simpleInterest: {
        interest: simpleCalc.interest,
        total: simpleCalc.total
      },
      compoundInterest: {
        interest: compoundCalc.interest,
        total: compoundCalc.total
      },
      extraGain: Math.round((compoundCalc.interest - simpleCalc.interest) * 100) / 100,
      calculatedAt: new Date()
    };
  }

  /**
   * Generate investment assessment
   */
  generateAssessment(calculation, userProfile = {}) {
    let assessment = {
      type: 'success',
      message: '✅ ',
      advice: [],
      rating: 0,
      overallStatement: 'Looks good for your profile'
    };

    // Risk assessment
    const riskScores = {
      'Very Low': 5,
      'Low': 4,
      'Medium': 3,
      'High': 2
    };

    assessment.rating = riskScores[calculation.riskLevel] || 3;

    // Risk-based message
    if (calculation.riskLevel === 'Very Low') {
      assessment.message += 'Very safe investment';
      assessment.advice.push('Perfect for conservative investors');
    } else if (calculation.riskLevel === 'Low') {
      assessment.message += 'Safe investment with good returns';
      assessment.advice.push('Good choice for balanced portfolio');
    } else if (calculation.riskLevel === 'Medium') {
      assessment.message += 'Moderate risk with better returns';
      assessment.advice.push('Suitable for risk-tolerant investors');
    } else {
      assessment.type = 'warning';
      assessment.message += 'Higher risk - review carefully';
      assessment.advice.push('Only suitable if you can afford losses');
    }

    // Return quality
    const interestRatio = calculation.compoundInterest.interest / calculation.investmentAmount;
    if (interestRatio > 0.2) {
      assessment.advice.push('Excellent returns for investment period');
    } else if (interestRatio > 0.1) {
      assessment.advice.push('Good returns for investment period');
    } else if (interestRatio > 0.05) {
      assessment.advice.push('Fair returns - consider longer duration');
    } else {
      assessment.advice.push('Modest returns - review alternatives');
    }

    // Amount suitability
    if (calculation.investmentAmount < 50000) {
      assessment.advice.push('💡 Good for testing investment strategy');
    } else if (calculation.investmentAmount < 500000) {
      assessment.advice.push('💡 Substantial investment - good diversification');
    } else {
      assessment.advice.push('💡 Large investment - ensure proper diversification');
    }

    // Duration-based advice
    if (calculation.years === 0.25) {
      assessment.advice.push('⏱️ Short duration - quick returns');
    } else if (calculation.years === 0.5) {
      assessment.advice.push('⏱️ Balanced duration - medium-term growth');
    } else {
      assessment.advice.push('⏱️ Full year - maximum returns');
    }

    // Risk profile match
    if (userProfile.riskProfile === 'conservative' && calculation.riskLevel === 'Medium') {
      assessment.type = 'warning';
      assessment.overallStatement = 'May not suit conservative profile';
    } else if (userProfile.riskProfile === 'aggressive' && calculation.riskLevel === 'Very Low') {
      assessment.advice.push('🎯 Consider higher-risk options for better growth');
    }

    return assessment;
  }

  /**
   * Convert amount between currencies
   */
  convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = this.exchangeRates[fromCurrency] || 1;
    const toRate = this.exchangeRates[toCurrency] || 1;

    return (amount / fromRate) * toRate;
  }

  /**
   * Get exchange rates
   */
  getExchangeRates() {
    return this.exchangeRates;
  }

  /**
   * Get best investment for profile
   */
  getRecommendedInvestments(userProfile) {
    const recommendations = [];

    for (const company of this.companies) {
      let score = 0;

      // Risk matching
      if (userProfile.riskTolerance === 'low' && company.riskLevel === 'Very Low') {
        score += 3;
      } else if (userProfile.riskTolerance === 'medium' && company.riskLevel === 'Low') {
        score += 3;
      } else if (userProfile.riskTolerance === 'high' && company.riskLevel === 'Medium') {
        score += 3;
      }

      // Minimum investment match
      if (company.minInvestment <= userProfile.investmentAmount) {
        score += 2;
      }

      // Return potential
      score += company.interestRate / 5;

      if (score > 0) {
        recommendations.push({
          company,
          score,
          reason: this.generateRecommendationReason(company, userProfile)
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  /**
   * Generate recommendation reason
   */
  generateRecommendationReason(company, userProfile) {
    const reasons = [];

    if (company.riskLevel === userProfile.riskTolerance) {
      reasons.push(`Matches your ${userProfile.riskTolerance} risk tolerance`);
    }

    if (company.interestRate >= 9) {
      reasons.push('High returns potential');
    }

    if (company.minInvestment <= userProfile.investmentAmount) {
      reasons.push('Within your investment capacity');
    }

    return reasons.join(' • ');
  }

  /**
   * Calculate investment comparison
   */
  compareInvestments(investmentData, companyIds) {
    const comparisons = [];

    for (const companyId of companyIds) {
      try {
        const calculation = this.calculateReturns({
          ...investmentData,
          companyId
        });
        comparisons.push(calculation);
      } catch (error) {
        // Skip if error
        continue;
      }
    }

    return comparisons.sort((a, b) => b.compoundInterest.total - a.compoundInterest.total);
  }

  /**
   * Generate report
   */
  generateReport(calculation, assessment) {
    const divider = '='.repeat(50);
    const report = `
${divider}
INVESTMENT CAPITAL PLANNER REPORT
Generated: ${new Date().toLocaleString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
${divider}

📊 INVESTMENT DETAILS
${divider}
Company: ${calculation.company}
Symbol: ${calculation.symbol}
Type: ${calculation.type}
Risk Level: ${calculation.riskLevel}
Credit Rating: ${calculation.creditRating}
Description: ${calculation.description}

💰 INVESTMENT PARAMETERS
${divider}
Amount: ${calculation.currency} ${calculation.investmentAmount.toLocaleString()}
Currency: ${calculation.currency}
Duration: ${calculation.duration}
Interest Rate: ${calculation.interestRate}% p.a.
Time Period: ${calculation.years} year(s)
Minimum Investment: ${calculation.minInvestment}

📈 SIMPLE INTEREST CALCULATION
${divider}
Formula: SI = Principal × Rate × Time
Principal Amount: ${calculation.currency} ${calculation.investmentAmount.toLocaleString()}
Interest Earned: ${calculation.currency} ${calculation.simpleInterest.interest.toLocaleString()}
Total Value: ${calculation.currency} ${calculation.simpleInterest.total.toLocaleString()}

📈 COMPOUND INTEREST CALCULATION (Monthly)
${divider}
Formula: CI = Principal × (1 + Rate/12)^(12 × Time) - Principal
Principal Amount: ${calculation.currency} ${calculation.investmentAmount.toLocaleString()}
Interest Earned: ${calculation.currency} ${calculation.compoundInterest.interest.toLocaleString()}
Total Value: ${calculation.currency} ${calculation.compoundInterest.total.toLocaleString()}

💡 COMPARISON
${divider}
Simple Interest Gain: ${calculation.currency} ${calculation.simpleInterest.interest.toLocaleString()}
Compound Interest Gain: ${calculation.currency} ${calculation.compoundInterest.interest.toLocaleString()}
Extra Gain (Compound): ${calculation.currency} ${calculation.extraGain.toLocaleString()}
Difference Percentage: ${((calculation.extraGain / calculation.simpleInterest.interest) * 100).toFixed(2)}%

📋 ASSESSMENT
${divider}
${assessment.message}
Rating: ${assessment.rating}/5

Recommendations:
${assessment.advice.map((advice, i) => `${i + 1}. ${advice}`).join('\n')}

Overall: ${assessment.overallStatement}

⚠️ DISCLAIMER
${divider}
This calculator provides estimates for educational purposes only. 
Actual returns may vary based on:
- Market conditions
- Bank policies
- Economic factors
- Currency fluctuations
- Tax implications

Please consult with a qualified financial advisor before making investment decisions.

${divider}
Report Generated by Investment Capital Planner
Version 1.0 | © 2024 Finance Tracker
${divider}
    `;

    return report;
  }
}

module.exports = new InvestmentCapitalPlannerService();
