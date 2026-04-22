/**
 * INVESTMENT CAPITAL PLANNER ROUTES
 * ==================================
 * API endpoints for investment calculations
 * Requires authentication
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const investmentService = require('../services/investmentPlannerService');

/**
 * GET /api/investments/companies
 * Get all available investment companies
 */
router.get('/companies', auth, (req, res) => {
  try {
    const companies = investmentService.getAllCompanies();
    res.json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/investments/companies/:id
 * Get specific company details
 */
router.get('/companies/:id', auth, (req, res) => {
  try {
    const company = investmentService.getCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }
    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/investments/calculate
 * Calculate investment returns
 * 
 * Request body:
 * {
 *   amount: number,
 *   currency: 'LKR' | 'USD' | 'EUR' | 'GBP',
 *   duration: '3m' | '6m' | 'annual',
 *   companyId: string
 * }
 */
router.post('/calculate', auth, (req, res) => {
  try {
    const { amount, currency = 'LKR', duration = 'annual', companyId } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid investment amount'
      });
    }

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required'
      });
    }

    // Calculate
    const calculation = investmentService.calculateReturns({
      amount,
      currency,
      duration,
      companyId
    });

    // Generate assessment
    const assessment = investmentService.generateAssessment(
      calculation,
      req.user?.profile || {}
    );

    res.json({
      success: true,
      data: {
        calculation,
        assessment
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/investments/compare
 * Compare multiple investments
 * 
 * Request body:
 * {
 *   amount: number,
 *   currency: 'LKR' | 'USD' | 'EUR' | 'GBP',
 *   duration: '3m' | '6m' | 'annual',
 *   companyIds: string[]
 * }
 */
router.post('/compare', auth, (req, res) => {
  try {
    const { amount, currency = 'LKR', duration = 'annual', companyIds = [] } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid investment amount'
      });
    }

    if (companyIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one company must be selected'
      });
    }

    // Compare
    const comparisons = investmentService.compareInvestments(
      { amount, currency, duration },
      companyIds
    );

    res.json({
      success: true,
      count: comparisons.length,
      data: comparisons
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/investments/assessment
 * Get assessment for a calculation
 */
router.post('/assessment', auth, (req, res) => {
  try {
    const { calculation, userProfile = {} } = req.body;

    if (!calculation) {
      return res.status(400).json({
        success: false,
        error: 'Calculation data is required'
      });
    }

    const assessment = investmentService.generateAssessment(
      calculation,
      userProfile
    );

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/investments/recommendations
 * Get recommended investments for user profile
 * 
 * Request body:
 * {
 *   investmentAmount: number,
 *   riskTolerance: 'low' | 'medium' | 'high'
 * }
 */
router.post('/recommendations', auth, (req, res) => {
  try {
    const { investmentAmount = 10000, riskTolerance = 'medium' } = req.body;

    if (investmentAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid investment amount'
      });
    }

    const recommendations = investmentService.getRecommendedInvestments({
      investmentAmount,
      riskTolerance
    });

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/investments/convert
 * Convert amount between currencies
 * 
 * Request body:
 * {
 *   amount: number,
 *   fromCurrency: string,
 *   toCurrency: string
 * }
 */
router.post('/convert', auth, (req, res) => {
  try {
    const { amount, fromCurrency = 'LKR', toCurrency = 'USD' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    const converted = investmentService.convertCurrency(
      amount,
      fromCurrency,
      toCurrency
    );

    res.json({
      success: true,
      data: {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: Math.round(converted * 100) / 100,
        convertedCurrency: toCurrency,
        rate: converted / amount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/investments/exchange-rates
 * Get current exchange rates
 */
router.get('/exchange-rates', auth, (req, res) => {
  try {
    const rates = investmentService.getExchangeRates();
    res.json({
      success: true,
      data: rates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/investments/report
 * Generate investment report
 * 
 * Request body:
 * {
 *   calculation: object,
 *   assessment: object
 * }
 */
router.post('/report', auth, (req, res) => {
  try {
    const { calculation, assessment } = req.body;

    if (!calculation || !assessment) {
      return res.status(400).json({
        success: false,
        error: 'Calculation and assessment data required'
      });
    }

    const report = investmentService.generateReport(calculation, assessment);

    res.json({
      success: true,
      data: {
        report,
        downloadUrl: `data:text/plain;charset=utf-8,${encodeURIComponent(report)}`
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/investments/save
 * Save investment calculation to user's history
 * 
 * Request body:
 * {
 *   calculation: object,
 *   assessment: object
 * }
 */
router.post('/save', auth, (req, res) => {
  try {
    const { calculation, assessment } = req.body;

    if (!calculation) {
      return res.status(400).json({
        success: false,
        error: 'Calculation data required'
      });
    }

    // TODO: Save to database
    // const investment = new Investment({
    //   userId: req.user.id,
    //   calculation,
    //   assessment,
    //   savedAt: new Date()
    // });
    // await investment.save();

    res.json({
      success: true,
      message: 'Investment calculation saved',
      data: {
        id: 'temp-id', // Replace with actual ID from DB
        calculation,
        assessment,
        savedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/investments/history
 * Get user's investment calculation history
 */
router.get('/history', auth, (req, res) => {
  try {
    // TODO: Fetch from database
    // const investments = await Investment.find({ userId: req.user.id })
    //   .sort({ savedAt: -1 })
    //   .limit(10);

    res.json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/investments/:id
 * Delete saved investment
 */
router.delete('/:id', auth, (req, res) => {
  try {
    // TODO: Delete from database
    // await Investment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Investment deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
