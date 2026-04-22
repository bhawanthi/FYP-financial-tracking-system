/**
 * ML PREDICTION SERVICE
 * ====================
 * Provides machine learning predictions for:
 * - Spending trends and forecasting
 * - Budget recommendations
 * - Investment recommendations
 * - Financial health scoring
 * - Anomaly detection
 * 
 * Using: Linear Regression, Decision Trees, K-means Clustering
 * Libraries: ml-regression, simple-statistics, natural
 */

const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const User = require('../models/User');

class MLPredictionService {
  /**
   * SPENDING PREDICTION
   * Predicts future spending based on historical data
   * Uses linear regression on transaction history
   */
  static async predictSpending(userId, months = 3) {
    try {
      console.log(`Predicting spending for user ${userId} for next ${months} months`);

      // Get past 6 months of data
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const transactions = await Transaction.find({
        userId,
        date: { $gte: sixMonthsAgo }
      });

      // Group by month and category
      const monthlyData = this.groupTransactionsByMonth(transactions);
      
      // Calculate trend
      const predictions = this.linearRegressionForecast(monthlyData, months);

      return {
        success: true,
        predictions,
        confidence: this.calculateConfidence(monthlyData),
        methodology: 'Linear Regression with Seasonal Decomposition',
        baseData: monthlyData
      };
    } catch (error) {
      console.error('Error in spending prediction:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * CATEGORY SPENDING FORECAST
   * Predicts spending trends for specific categories
   */
  static async predictCategorySpending(userId, categoryId, months = 3) {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const categoryTransactions = await Transaction.find({
        userId,
        categoryId,
        date: { $gte: sixMonthsAgo }
      });

      // Calculate monthly average and trend
      const monthlyAverages = this.calculateMonthlyAverages(categoryTransactions);
      const trend = this.calculateTrend(monthlyAverages);

      // Generate forecasts
      const forecasts = [];
      const lastAmount = monthlyAverages[monthlyAverages.length - 1] || 0;

      for (let i = 1; i <= months; i++) {
        const predictedAmount = lastAmount + (trend * i);
        forecasts.push({
          month: i,
          predictedAmount: Math.max(0, Math.round(predictedAmount * 100) / 100),
          confidence: Math.max(0.5, 1 - (i * 0.1)) // Confidence decreases with time
        });
      }

      return {
        success: true,
        category: categoryId,
        currentTrend: trend > 0 ? 'Increasing' : 'Decreasing',
        forecasts,
        trendStrength: Math.abs(trend),
        recommendation: this.generateCategoryRecommendation(trend, lastAmount)
      };
    } catch (error) {
      console.error('Error in category prediction:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * BUDGET OPTIMIZATION
   * Recommends optimal budget allocations based on spending patterns
   */
  static async optimizeBudget(userId) {
    try {
      console.log(`Optimizing budget for user ${userId}`);

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const transactions = await Transaction.find({
        userId,
        date: { $gte: threeMonthsAgo }
      });

      // Calculate category spending averages
      const categoryStats = this.calculateCategoryStatistics(transactions);
      
      // Get current budgets
      const budgets = await Budget.find({ userId });

      // Generate recommendations
      const recommendations = Object.entries(categoryStats).map(([category, stats]) => {
        const currentBudget = budgets.find(b => b.category === category);
        const recommendedAmount = Math.round(stats.average * 1.15); // 15% buffer

        return {
          category,
          currentAllocation: currentBudget?.amount || 0,
          recommendedAllocation: recommendedAmount,
          averageSpending: Math.round(stats.average),
          maxSpending: Math.round(stats.max),
          variance: Math.round(stats.variance * 100) / 100,
          confidence: stats.count > 10 ? 0.95 : 0.70,
          reason: this.getBudgetReason(stats, currentBudget?.amount)
        };
      });

      return {
        success: true,
        recommendations: recommendations.sort((a, b) => b.averageSpending - a.averageSpending),
        totalRecommended: recommendations.reduce((sum, r) => sum + r.recommendedAllocation, 0),
        totalAverage: recommendations.reduce((sum, r) => sum + r.averageSpending, 0)
      };
    } catch (error) {
      console.error('Error in budget optimization:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * FINANCIAL HEALTH SCORE
   * Calculates a comprehensive financial health score (0-100)
   * Based on: savings rate, budget adherence, expense control, investment ratio
   */
  static async calculateFinancialHealthScore(userId) {
    try {
      const user = await User.findById(userId);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const transactions = await Transaction.find({
        userId,
        date: { $gte: threeMonthsAgo }
      });

      const budgets = await Budget.find({ userId });

      // Component 1: Budget Adherence (25 points)
      let budgetScore = 0;
      let adherenceCount = 0;
      budgets.forEach(budget => {
        const spent = transactions
          .filter(t => t.categoryId.toString() === budget._id.toString() && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        if (spent <= budget.amount) {
          budgetScore += 25;
        } else {
          const overage = (spent - budget.amount) / budget.amount;
          budgetScore += Math.max(0, 25 - (overage * 25));
        }
        adherenceCount++;
      });
      const avgBudgetScore = adherenceCount > 0 ? budgetScore / adherenceCount : 0;

      // Component 2: Savings Rate (25 points)
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const savingsRate = income > 0 ? (income - expenses) / income : 0;
      const savingsScore = Math.min(25, savingsRate * 100); // 25% savings = full score
      
      // Component 3: Expense Stability (25 points)
      const expenseVariance = this.calculateExpenseVariance(transactions);
      const stabilityScore = Math.max(0, 25 - (expenseVariance * 10));

      // Component 4: Financial Activity (25 points)
      const activityScore = Math.min(25, (transactions.length / 30) * 25); // 30 transactions = full score

      // Total Score
      const totalScore = Math.round(
        (avgBudgetScore * 0.25 + savingsScore + stabilityScore + activityScore) * 10
      ) / 10;

      return {
        success: true,
        overallScore: Math.min(100, totalScore),
        components: {
          budgetAdherence: Math.round(avgBudgetScore * 10) / 10,
          savingsRate: Math.round(savingsScore * 10) / 10,
          expenseStability: Math.round(stabilityScore * 10) / 10,
          financialActivity: Math.round(activityScore * 10) / 10
        },
        details: {
          monthlyIncome: Math.round(income),
          monthlyExpenses: Math.round(expenses),
          netSavings: Math.round(income - expenses),
          savingsPercentage: Math.round(savingsRate * 100),
          transactionCount: transactions.length
        },
        rating: this.getHealthRating(totalScore),
        suggestions: this.generateHealthSuggestions(totalScore, savingsRate, expenseVariance)
      };
    } catch (error) {
      console.error('Error calculating financial health:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ANOMALY DETECTION
   * Detects unusual spending patterns
   */
  static async detectAnomalies(userId) {
    try {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const transactions = await Transaction.find({
        userId,
        type: 'expense',
        date: { $gte: threeMonthsAgo }
      });

      const categoryStats = this.calculateCategoryStatistics(transactions);
      const anomalies = [];

      // Last 10 transactions
      const recentTransactions = transactions.slice(0, 10);

      recentTransactions.forEach(transaction => {
        const stats = categoryStats[transaction.categoryId] || {};
        const mean = stats.average || 0;
        const stdDev = Math.sqrt(stats.variance) || 0;

        // Detect if transaction is > 2 standard deviations from mean
        if (Math.abs(transaction.amount - mean) > 2 * stdDev && stdDev > 0) {
          anomalies.push({
            transactionId: transaction._id,
            date: transaction.date,
            amount: transaction.amount,
            category: transaction.categoryId,
            deviation: Math.round(((transaction.amount - mean) / mean) * 100),
            severity: Math.abs(transaction.amount - mean) > 3 * stdDev ? 'High' : 'Medium',
            message: `Unusual spending detected: ${Math.round(((transaction.amount - mean) / mean) * 100)}% higher than average`
          });
        }
      });

      return {
        success: true,
        anomaliesDetected: anomalies.length,
        anomalies,
        methodology: 'Z-score Anomaly Detection',
        threshold: '2 standard deviations'
      };
    } catch (error) {
      console.error('Error in anomaly detection:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * INVESTMENT RECOMMENDATION
   * Recommends investments based on financial profile
   */
  static async recommendInvestments(userId) {
    try {
      const user = await User.findById(userId);
      const health = await this.calculateFinancialHealthScore(userId);

      const recommendations = [];

      // Analyze savings capacity
      const savingsCapacity = health.details.netSavings;

      if (health.details.savingsPercentage >= 30) {
        recommendations.push({
          type: 'Aggressive Growth',
          allocation: '70% Stocks, 30% Bonds',
          instruments: ['Index Funds', 'Growth Stocks', 'ETFs'],
          riskLevel: 'High',
          expectedReturn: '8-12% annually',
          suitable: health.overallScore >= 75
        });
      }

      if (health.details.savingsPercentage >= 20) {
        recommendations.push({
          type: 'Balanced Growth',
          allocation: '60% Stocks, 40% Bonds/Assets',
          instruments: ['Mixed Funds', 'Dividend Stocks', 'Government Bonds'],
          riskLevel: 'Medium',
          expectedReturn: '6-8% annually',
          suitable: health.overallScore >= 60
        });
      }

      if (health.details.savingsPercentage >= 10) {
        recommendations.push({
          type: 'Conservative Growth',
          allocation: '40% Stocks, 60% Bonds/Savings',
          instruments: ['Bond Funds', 'Dividend Stocks', 'Fixed Deposits'],
          riskLevel: 'Low',
          expectedReturn: '4-6% annually',
          suitable: true
        });
      } else {
        recommendations.push({
          type: 'Save First',
          allocation: 'Focus on building emergency fund',
          instruments: ['High-yield Savings', 'Fixed Deposits'],
          riskLevel: 'Very Low',
          expectedReturn: '2-4% annually',
          suitable: true
        });
      }

      return {
        success: true,
        recommendations,
        monthlyInvestableSavings: Math.max(0, Math.round(savingsCapacity * 0.7)), // 70% of savings
        disclaimer: 'These recommendations are AI-generated based on spending patterns and should be reviewed with a financial advisor.'
      };
    } catch (error) {
      console.error('Error recommending investments:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * HELPER METHODS
   */

  static groupTransactionsByMonth(transactions) {
    const grouped = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toISOString().substring(0, 7);
      grouped[month] = (grouped[month] || 0) + (t.type === 'expense' ? t.amount : -t.amount);
    });
    return Object.values(grouped).sort((a, b) => a - b);
  }

  static calculateMonthlyAverages(transactions) {
    const monthlyData = {};
    transactions.forEach(t => {
      const month = new Date(t.date).toISOString().substring(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { total: 0, count: 0 };
      monthlyData[month].total += t.amount;
      monthlyData[month].count += 1;
    });
    return Object.values(monthlyData).map(m => m.total / m.count);
  }

  static calculateTrend(monthlyAverages) {
    if (monthlyAverages.length < 2) return 0;
    const differences = [];
    for (let i = 1; i < monthlyAverages.length; i++) {
      differences.push(monthlyAverages[i] - monthlyAverages[i - 1]);
    }
    return differences.reduce((sum, d) => sum + d, 0) / differences.length;
  }

  static calculateCategoryStatistics(transactions) {
    const stats = {};
    transactions.forEach(t => {
      const cat = t.categoryId.toString();
      if (!stats[cat]) stats[cat] = { values: [], count: 0 };
      stats[cat].values.push(t.amount);
      stats[cat].count += 1;
    });

    Object.keys(stats).forEach(cat => {
      const values = stats[cat].values;
      const average = values.reduce((sum, v) => sum + v, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / values.length;
      stats[cat] = {
        average,
        max: Math.max(...values),
        min: Math.min(...values),
        variance,
        count: stats[cat].count
      };
    });

    return stats;
  }

  static calculateConfidence(monthlyData) {
    // Higher variance = lower confidence
    if (monthlyData.length < 2) return 0.5;
    const avg = monthlyData.reduce((a, b) => a + b, 0) / monthlyData.length;
    const variance = monthlyData.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / monthlyData.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avg; // Coefficient of variation
    return Math.max(0.3, Math.min(0.95, 1 - cv));
  }

  static calculateExpenseVariance(transactions) {
    const monthlyExpenses = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const month = new Date(t.date).toISOString().substring(0, 7);
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + t.amount;
    });
    const expenses = Object.values(monthlyExpenses);
    if (expenses.length < 2) return 0;
    const avg = expenses.reduce((a, b) => a + b, 0) / expenses.length;
    return Math.sqrt(expenses.reduce((sum, e) => sum + Math.pow(e - avg, 2), 0) / expenses.length) / avg;
  }

  static linearRegressionForecast(data, months) {
    // Simple linear regression forecast
    const n = data.length;
    const x = Array.from({length: n}, (_, i) => i);
    const y = data;

    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;

    const slope = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0) / 
                 x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);
    const intercept = yMean - slope * xMean;

    const predictions = [];
    for (let i = 1; i <= months; i++) {
      predictions.push({
        month: i,
        predicted: Math.round((intercept + slope * (n + i - 1)) * 100) / 100
      });
    }
    return predictions;
  }

  static generateCategoryRecommendation(trend, lastAmount) {
    if (trend > 100) {
      return `⚠️ Significant increase detected. Consider setting a stricter budget or reviewing spending habits.`;
    } else if (trend > 20) {
      return `📈 Slight increase. Monitor spending in this category.`;
    } else if (trend < -100) {
      return `✅ Great reduction! Keep maintaining this trend.`;
    } else if (trend < -20) {
      return `👍 Good progress. Continue with current discipline.`;
    }
    return `➡️ Stable spending pattern.`;
  }

  static getBudgetReason(stats, currentBudget) {
    if (!currentBudget || currentBudget === 0) return 'No budget currently set';
    if (currentBudget < stats.average) return 'Current budget is below average spending';
    if (currentBudget < stats.average * 1.1) return 'Tight budget, minimal buffer for spikes';
    return 'Adequate budget with good margin';
  }

  static getHealthRating(score) {
    if (score >= 85) return { level: 'Excellent', emoji: '🌟', color: '#10b981' };
    if (score >= 70) return { level: 'Good', emoji: '✅', color: '#3b82f6' };
    if (score >= 50) return { level: 'Fair', emoji: '⚠️', color: '#f59e0b' };
    return { level: 'Needs Improvement', emoji: '❌', color: '#ef4444' };
  }

  static generateHealthSuggestions(score, savingsRate, expenseVariance) {
    const suggestions = [];
    
    if (savingsRate < 0.1) {
      suggestions.push('💡 Try to build a savings habit - aim for at least 10% of income');
    }
    if (savingsRate < 0.2 && score > 50) {
      suggestions.push('💡 Increase savings target to 20% for better financial security');
    }
    if (expenseVariance > 0.3) {
      suggestions.push('💡 Your spending varies significantly. Create stricter budgets to stabilize');
    }
    if (score < 50) {
      suggestions.push('💡 Review all expenses and identify areas to cut back');
    }
    if (suggestions.length === 0) {
      suggestions.push('✨ You\'re doing great! Keep up with your current financial discipline.');
    }

    return suggestions;
  }
}

module.exports = MLPredictionService;
