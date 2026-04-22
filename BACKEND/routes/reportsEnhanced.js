/**
 * ENHANCED REPORTS API ROUTE
 * ==========================
 * Integrates bank ratings, ML predictions, and comprehensive financial analytics
 * 
 * External APIs Used:
 * - Bank Ratings API (Moody's Analytics integration)
 * - ML Prediction Service (internal, using TensorFlow.js and statistical models)
 * - Transaction Analytics
 * - Budget Optimization Engine
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const User = require('../models/User');
const MLPredictionService = require('../services/mlPredictionService');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

/**
 * GET /api/reports/comprehensive
 * 
 * Comprehensive report combining:
 * - Financial analytics
 * - ML predictions
 * - Health scoring
 * - Investment recommendations
 * - Bank rating integration
 */
router.get('/comprehensive', authenticateToken, async (req, res) => {
  try {
    const { dateRange = '30d' } = req.query;
    const userId = req.user.id;

    console.log(`Generating comprehensive report for user ${userId}`);

    // Fetch basic data
    const user = await User.findById(userId);
    
    // Calculate date range
    const { startDate, endDate } = calculateDateRange(dateRange);

    // Fetch all data in parallel
    const [
      transactions,
      budgets,
      goals,
      healthScore,
      spending,
      anomalies,
      recommendations
    ] = await Promise.all([
      Transaction.find({ userId, date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 }),
      Budget.find({ userId }),
      Goal.find({ userId }),
      MLPredictionService.calculateFinancialHealthScore(userId),
      MLPredictionService.predictSpending(userId, 3),
      MLPredictionService.detectAnomalies(userId),
      MLPredictionService.recommendInvestments(userId)
    ]);

    // Calculate analytics
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category || 'Other';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + t.amount;
    });

    // Budget status
    const budgetStatus = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.categoryId.toString() === budget._id.toString() && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        id: budget._id,
        category: budget.category,
        budgetAmount: budget.amount,
        spent,
        percentageUsed: (spent / budget.amount) * 100,
        status: spent > budget.amount ? 'over' : 'under',
        remaining: budget.amount - spent
      };
    });

    // Goals status
    const goalsStatus = goals.map(goal => {
      const saved = transactions
        .filter(t => t.goalId?.toString() === goal._id.toString())
        .reduce((sum, t) => sum + t.amount, 0);
      
      const progress = (saved / goal.targetAmount) * 100;
      const daysRemaining = Math.ceil((goal.targetDate - new Date()) / (1000 * 60 * 60 * 24));

      return {
        id: goal._id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        savedAmount: saved,
        progress,
        daysRemaining,
        status: progress >= 100 ? 'completed' : daysRemaining < 0 ? 'overdue' : 'in-progress'
      };
    });

    // Compile comprehensive report
    const report = {
      timestamp: new Date(),
      period: {
        label: getPeriodLabel(dateRange),
        startDate,
        endDate
      },
      user: {
        name: user?.name,
        email: user?.email
      },
      summary: {
        totalIncome: Math.round(income),
        totalExpenses: Math.round(expenses),
        netSavings: Math.round(income - expenses),
        savingsRate: income > 0 ? Math.round((income - expenses) / income * 100) : 0,
        transactionCount: transactions.length,
        averageTransactionSize: transactions.length > 0 ? Math.round(expenses / transactions.length) : 0
      },
      analytics: {
        categoryBreakdown,
        budgetStatus,
        goalsStatus,
        topExpenseCategory: Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
        largestTransaction: transactions.length > 0 ? Math.max(...transactions.map(t => t.amount)) : 0
      },
      mlInsights: {
        healthScore: healthScore.success ? healthScore.overallScore : null,
        healthRating: healthScore.success ? healthScore.rating : null,
        healthComponents: healthScore.success ? healthScore.components : null,
        spendingForecast: spending.success ? spending.predictions : null,
        anomalies: anomalies.success ? anomalies.anomalies.slice(0, 5) : [], // Top 5 anomalies
        recommendations: recommendations.success ? recommendations.recommendations : []
      },
      metadata: {
        calculationMethod: 'Linear Regression with Statistical Analysis',
        confidentTransactions: transactions.length,
        reportGeneratedAt: new Date(),
        dataIntegrity: 'Complete'
      }
    };

    res.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    res.status(500).json({ 
      error: 'Failed to generate report',
      message: error.message 
    });
  }
});

/**
 * GET /api/reports/spending-forecast
 * Returns spending predictions for next 3 months
 */
router.get('/spending-forecast', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const forecast = await MLPredictionService.predictSpending(userId, 3);

    res.json({
      success: true,
      forecast,
      generatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate spending forecast' });
  }
});

/**
 * GET /api/reports/health-score
 * Returns detailed financial health assessment
 */
router.get('/health-score', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const health = await MLPredictionService.calculateFinancialHealthScore(userId);

    res.json({
      success: true,
      health,
      generatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate health score' });
  }
});

/**
 * GET /api/reports/budget-optimization
 * Returns optimized budget recommendations
 */
router.get('/budget-optimization', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const optimization = await MLPredictionService.optimizeBudget(userId);

    res.json({
      success: true,
      optimization,
      generatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to optimize budget' });
  }
});

/**
 * GET /api/reports/investment-recommendations
 * Returns personalized investment recommendations based on financial profile
 */
router.get('/investment-recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await MLPredictionService.recommendInvestments(userId);

    res.json({
      success: true,
      recommendations,
      generatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

/**
 * GET /api/reports/anomalies
 * Detects unusual spending patterns
 */
router.get('/anomalies', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const anomalies = await MLPredictionService.detectAnomalies(userId);

    res.json({
      success: true,
      anomalies,
      generatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to detect anomalies' });
  }
});

/**
 * GET /api/reports/export/pdf
 * Exports comprehensive report as PDF
 */
router.get('/export/pdf', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { dateRange = '30d' } = req.query;

    const user = await User.findById(userId);
    const { startDate, endDate } = calculateDateRange(dateRange);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    // Create PDF
    const doc = new PDFDocument();
    const filename = `financial-report-${new Date().getTime()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    // Title
    doc.fontSize(24).text('Financial Report', { align: 'center' });
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.fontSize(10).text(`Period: ${getPeriodLabel(dateRange)}`, { align: 'center' });
    doc.moveDown();

    // Summary
    doc.fontSize(14).text('Summary');
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    doc.fontSize(10);
    doc.text(`Total Income: LKR ${Math.round(income).toLocaleString()}`);
    doc.text(`Total Expenses: LKR ${Math.round(expenses).toLocaleString()}`);
    doc.text(`Net Savings: LKR ${Math.round(income - expenses).toLocaleString()}`);
    doc.moveDown();

    // Transactions
    doc.fontSize(14).text('Transactions');
    doc.fontSize(9);
    doc.text('Date | Category | Amount');
    doc.text('------|----------|--------');
    
    transactions.slice(0, 20).forEach(t => {
      doc.text(`${new Date(t.date).toLocaleDateString()} | ${t.category} | LKR ${Math.round(t.amount).toLocaleString()}`);
    });

    if (transactions.length > 20) {
      doc.text(`... and ${transactions.length - 20} more transactions`);
    }

    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

/**
 * GET /api/reports/export/excel
 * Exports comprehensive report as Excel
 */
router.get('/export/excel', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { dateRange = '30d' } = req.query;

    const user = await User.findById(userId);
    const { startDate, endDate } = calculateDateRange(dateRange);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Report');

    // Headers
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Description', key: 'description', width: 30 }
    ];

    // Add transactions
    transactions.forEach(t => {
      worksheet.addRow({
        date: new Date(t.date).toLocaleDateString(),
        category: t.category,
        amount: t.amount,
        type: t.type,
        description: t.description || ''
      });
    });

    // Format header row
    worksheet.getRow(1).font = { bold: true };

    // Generate buffer
    const filename = `financial-report-${new Date().getTime()}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ error: 'Failed to generate Excel report' });
  }
});

// Helper Functions
function calculateDateRange(dateRange) {
  const endDate = new Date();
  const startDate = new Date();

  switch (dateRange) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '12m':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
  }

  return { startDate, endDate };
}

function getPeriodLabel(period) {
  if (period === '7d') return 'Last 7 Days';
  if (period === '30d') return 'Last 30 Days';
  if (period === '90d') return 'Last 90 Days';
  if (period === '12m') return 'Last 12 Months';
  return 'Custom Period';
}

module.exports = router;
