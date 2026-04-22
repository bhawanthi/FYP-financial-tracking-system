import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { getUserData, clearAuthData, formatCurrency } from '../utils/auth';
import './styles/Reports.css';
import './styles/EnhancedReports.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

/**
 * ENHANCED REPORTS COMPONENT
 * ==========================
 * Displays comprehensive financial insights including:
 * 1. ML-powered spending predictions
 * 2. Financial health scoring
 * 3. Budget optimization recommendations
 * 4. Investment recommendations
 * 5. Anomaly detection
 * 6. Bank ratings integration
 * 
 * External APIs Integrated:
 * - Bank Ratings API (Moody's Analytics)
 * - ML Prediction Service (internal)
 * 
 * Data Flow:
 * User Data → Backend ML Service → Predictions & Insights → Frontend Display
 */

const EnhancedReports = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [navigate] = useState(useNavigate());

  // Report Data States
  const [reportData, setReportData] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [spendingForecast, setSpendingForecast] = useState(null);
  const [budgetOptimization, setBudgetOptimization] = useState(null);
  const [investmentRecs, setInvestmentRecs] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [bankRatings, setBankRatings] = useState(null);

  // UI States
  const [showBankSearch, setShowBankSearch] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);
  const [exportFormat, setExportFormat] = useState(null);
  const [showFullReport, setShowFullReport] = useState(false);

  // Authentication and Data Fetching
  useEffect(() => {
    const initializeReport = async () => {
      try {
        const userData = getUserData();
        if (!userData) {
          navigate('/login');
          return;
        }
        setUser(userData);

        // Fetch all report data in parallel
        const token = localStorage.getItem('authToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [
          reportRes,
          healthRes,
          forecastRes,
          optimizeRes,
          investRes,
          anomaliesRes
        ] = await Promise.all([
          axios.get(`/api/reports/comprehensive?dateRange=${dateRange}`, { headers }),
          axios.get('/api/reports/health-score', { headers }),
          axios.get('/api/reports/spending-forecast', { headers }),
          axios.get('/api/reports/budget-optimization', { headers }),
          axios.get('/api/reports/investment-recommendations', { headers }),
          axios.get('/api/reports/anomalies', { headers })
        ]);

        setReportData(reportRes.data.report);
        setHealthScore(healthRes.data.health);
        setSpendingForecast(forecastRes.data.forecast);
        setBudgetOptimization(optimizeRes.data.optimization);
        setInvestmentRecs(investRes.data.recommendations);
        setAnomalies(anomaliesRes.data.anomalies);

        setLoading(false);
      } catch (err) {
        console.error('Error loading report:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeReport();
  }, [dateRange, navigate]);

  // Bank Rating Search
  const searchBankRating = async (bankName) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/api/bank-ratings/search?bankName=${bankName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSelectedBank(response.data.bankRating);
    } catch (err) {
      console.error('Error searching bank:', err);
      setError(err.response?.data?.error || 'Bank not found');
    }
  };

  // Export Functionality
  const handleExport = async (format) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/api/reports/export/${format}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: format === 'pdf' ? 'blob' : 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  if (loading) return <div className="loading">Loading report...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="enhanced-reports-container">
      {/* Header */}
      <header className="reports-header">
        <h1>📊 Financial Intelligence Dashboard</h1>
        <p className="subtitle">ML-Powered Analytics & Insights</p>
      </header>

      {/* Controls */}
      <div className="reports-controls">
        <div className="control-group">
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="12m">Last 12 Months</option>
          </select>
        </div>

        <div className="control-group">
          <button className="btn-export" onClick={() => handleExport('pdf')}>
            📄 Export PDF
          </button>
          <button className="btn-export" onClick={() => handleExport('excel')}>
            📊 Export Excel
          </button>
        </div>

        <div className="control-group">
          <button className="btn-bank-search" onClick={() => setShowBankSearch(!showBankSearch)}>
            🏦 Rate the Bank
          </button>
        </div>
      </div>

      {/* Bank Rating Search Modal */}
      {showBankSearch && (
        <div className="bank-search-modal">
          <div className="modal-content">
            <h3>🏦 Rate the Bank - Find Bank Ratings</h3>
            <p className="info-text">
              Get credit ratings and financial health scores from Moody's Analytics
              <br />
              <a href="https://www.moodys.com" target="_blank" rel="noopener noreferrer">
                © Moody's Analytics
              </a>
            </p>
            <div className="search-box">
              <input
                type="text"
                placeholder="Enter bank name (e.g., Commercial Bank of Ceylon)"
                value={bankSearchQuery}
                onChange={(e) => setBankSearchQuery(e.target.value)}
              />
              <button onClick={() => searchBankRating(bankSearchQuery)}>Search</button>
            </div>

            {selectedBank && (
              <div className="bank-rating-details">
                <h4>{selectedBank.bankName}</h4>
                
                <div className="rating-card">
                  <div className="rating-item">
                    <span className="label">Credit Rating:</span>
                    <span className={`rating ${selectedBank.creditRating}`}>
                      {selectedBank.creditRating}
                    </span>
                  </div>
                  <div className="rating-item">
                    <span className="label">Outlook:</span>
                    <span className={`outlook ${selectedBank.outlook}`}>
                      {selectedBank.outlook}
                    </span>
                  </div>
                  <div className="rating-item">
                    <span className="label">Risk Level:</span>
                    <span>{selectedBank.riskLevel}</span>
                  </div>
                </div>

                <div className="financial-metrics">
                  <h5>Financial Strength Metrics</h5>
                  <div className="metrics-grid">
                    <div className="metric">
                      <span>Financial Strength:</span>
                      <strong>{selectedBank.financialStrength}/10</strong>
                    </div>
                    <div className="metric">
                      <span>Customer Trust Score:</span>
                      <strong>{selectedBank.customerTrustScore}/10</strong>
                    </div>
                    <div className="metric">
                      <span>NPL Ratio:</span>
                      <strong>{selectedBank.npl}%</strong>
                    </div>
                    <div className="metric">
                      <span>CET1 Ratio:</span>
                      <strong>{selectedBank.cet1Ratio}%</strong>
                    </div>
                    <div className="metric">
                      <span>ROI:</span>
                      <strong>{selectedBank.roi}%</strong>
                    </div>
                    <div className="metric">
                      <span>ROE:</span>
                      <strong>{selectedBank.roe}%</strong>
                    </div>
                  </div>
                </div>

                <div className="bank-details">
                  <h5>Institution Details</h5>
                  <p><strong>Website:</strong> {selectedBank.website}</p>
                  <p><strong>Contact:</strong> {selectedBank.officeNumber}</p>
                  <p><strong>Services:</strong> {selectedBank.services.join(', ')}</p>
                  <p><strong>Branches:</strong> {selectedBank.branches} | <strong>ATMs:</strong> {selectedBank.atms}</p>
                </div>

                <div className="recommendation">
                  <strong>Investment Suitability:</strong>
                  <p>{selectedBank.investmentSuitability}</p>
                </div>

                <button className="btn-close" onClick={() => setShowBankSearch(false)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Overview
        </button>
        <button
          className={`tab ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictions')}
        >
          🔮 Predictions
        </button>
        <button
          className={`tab ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          ❤️ Health Score
        </button>
        <button
          className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          💡 Recommendations
        </button>
        <button
          className={`tab ${activeTab === 'anomalies' ? 'active' : ''}`}
          onClick={() => setActiveTab('anomalies')}
        >
          ⚠️ Anomalies
        </button>
      </div>

      {/* Content Sections */}
      <div className="content-area">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && reportData && (
          <div className="tab-content overview">
            <div className="summary-cards">
              <div className="card income">
                <span className="amount">{formatCurrency(reportData.summary.totalIncome)}</span>
                <span className="label">Total Income</span>
              </div>
              <div className="card expense">
                <span className="amount">{formatCurrency(reportData.summary.totalExpenses)}</span>
                <span className="label">Total Expenses</span>
              </div>
              <div className="card savings">
                <span className="amount">{formatCurrency(reportData.summary.netSavings)}</span>
                <span className="label">Net Savings</span>
              </div>
              <div className="card rate">
                <span className="amount">{reportData.summary.savingsRate}%</span>
                <span className="label">Savings Rate</span>
              </div>
            </div>

            {/* Category Breakdown Chart */}
            <div className="chart-section">
              <h3>📊 Expense Breakdown by Category</h3>
              <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                <Pie
                  data={{
                    labels: Object.keys(reportData.analytics.categoryBreakdown),
                    datasets: [
                      {
                        data: Object.values(reportData.analytics.categoryBreakdown),
                        backgroundColor: [
                          '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
                          '#06b6d4', '#f97316', '#ec4899'
                        ]
                      }
                    ]
                  }}
                  options={{ responsive: true, maintainAspectRatio: true }}
                />
              </div>
            </div>

            {/* Budget Status */}
            <div className="budget-status-section">
              <h3>💰 Budget Status</h3>
              {reportData.analytics.budgetStatus.map(budget => (
                <div key={budget.id} className="budget-bar">
                  <div className="budget-info">
                    <span className="category">{budget.category}</span>
                    <span className={`status ${budget.status}`}>
                      {budget.status === 'over' ? '⚠️ Over Budget' : '✅ Within Budget'}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress ${budget.status}`}
                      style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                    />
                  </div>
                  <span className="amount">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.budgetAmount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PREDICTIONS TAB */}
        {activeTab === 'predictions' && (
          <div className="tab-content predictions">
            <h2>🔮 Spending Predictions (Next 3 Months)</h2>
            
            {spendingForecast?.predictions && (
              <div className="forecast-section">
                <div style={{ width: '100%' }}>
                  <Line
                    data={{
                      labels: spendingForecast.predictions.map(p => `Month ${p.month}`),
                      datasets: [
                        {
                          label: 'Predicted Spending',
                          data: spendingForecast.predictions.map(p => p.predicted),
                          borderColor: '#3b82f6',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                          fill: true
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: true },
                        title: { display: true, text: 'Spending Trend' }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </div>

                <div className="prediction-details">
                  <h3>Prediction Details</h3>
                  <p><strong>Methodology:</strong> {spendingForecast.methodology}</p>
                  <p><strong>Confidence Level:</strong> {(spendingForecast.confidence * 100).toFixed(1)}%</p>
                  <p className="note">
                    Note: Predictions are based on historical spending patterns. Actual results may vary.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HEALTH SCORE TAB */}
        {activeTab === 'health' && healthScore && (
          <div className="tab-content health">
            <div className="health-score-display">
              <div className="circular-score">
                <div className="score-circle" style={{ color: healthScore.rating.color }}>
                  <span className="score-number">{healthScore.overallScore}</span>
                  <span className="score-label">/ 100</span>
                </div>
                <div className="rating-badge">
                  <span className="emoji">{healthScore.rating.emoji}</span>
                  <span className="level">{healthScore.rating.level}</span>
                </div>
              </div>

              <div className="health-components">
                <h3>Score Components</h3>
                <div className="components-grid">
                  <div className="component">
                    <span>Budget Adherence</span>
                    <div className="progress-small">
                      <div style={{ width: `${healthScore.components.budgetAdherence}%` }} />
                    </div>
                    <span className="value">{healthScore.components.budgetAdherence}%</span>
                  </div>
                  <div className="component">
                    <span>Savings Rate</span>
                    <div className="progress-small">
                      <div style={{ width: `${healthScore.components.savingsRate}%` }} />
                    </div>
                    <span className="value">{healthScore.components.savingsRate}%</span>
                  </div>
                  <div className="component">
                    <span>Expense Stability</span>
                    <div className="progress-small">
                      <div style={{ width: `${healthScore.components.expenseStability}%` }} />
                    </div>
                    <span className="value">{healthScore.components.expenseStability}%</span>
                  </div>
                  <div className="component">
                    <span>Financial Activity</span>
                    <div className="progress-small">
                      <div style={{ width: `${healthScore.components.financialActivity}%` }} />
                    </div>
                    <span className="value">{healthScore.components.financialActivity}%</span>
                  </div>
                </div>
              </div>

              <div className="health-details">
                <h3>Financial Details</h3>
                <div className="details-grid">
                  <div><span>Monthly Income:</span> <strong>{formatCurrency(healthScore.details.monthlyIncome)}</strong></div>
                  <div><span>Monthly Expenses:</span> <strong>{formatCurrency(healthScore.details.monthlyExpenses)}</strong></div>
                  <div><span>Net Savings:</span> <strong>{formatCurrency(healthScore.details.netSavings)}</strong></div>
                  <div><span>Savings %:</span> <strong>{healthScore.details.savingsPercentage}%</strong></div>
                  <div><span>Transactions:</span> <strong>{healthScore.details.transactionCount}</strong></div>
                </div>
              </div>

              <div className="suggestions">
                <h3>💡 Suggestions</h3>
                <ul>
                  {healthScore.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <div className="tab-content recommendations">
            <div className="recommendations-section">
              <h2>💡 Smart Recommendations</h2>

              {/* Budget Optimization */}
              <div className="recommendation-card">
                <h3>💰 Budget Optimization</h3>
                {budgetOptimization?.recommendations && (
                  <div className="optimization-list">
                    {budgetOptimization.recommendations.slice(0, 5).map((rec, idx) => (
                      <div key={idx} className="optimization-item">
                        <div className="item-header">
                          <span className="category">{rec.category}</span>
                          <span className="confidence">
                            {rec.confidence * 100}% confident
                          </span>
                        </div>
                        <div className="allocation-info">
                          <span>Current: {formatCurrency(rec.currentAllocation)}</span>
                          <span>→</span>
                          <span>Recommended: {formatCurrency(rec.recommendedAllocation)}</span>
                        </div>
                        <p className="reason">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Investment Recommendations */}
              <div className="recommendation-card">
                <h3>📈 Investment Strategy</h3>
                {investmentRecs?.recommendations && (
                  <div className="investment-list">
                    {investmentRecs.recommendations.map((rec, idx) => (
                      <div key={idx} className={`investment-item ${rec.suitable ? 'suitable' : 'alternative'}`}>
                        <div className="investment-header">
                          <span className="type">{rec.type}</span>
                          <span className={`risk-level ${rec.riskLevel.toLowerCase()}`}>
                            {rec.riskLevel} Risk
                          </span>
                        </div>
                        <p><strong>Allocation:</strong> {rec.allocation}</p>
                        <p><strong>Instruments:</strong> {rec.instruments.join(', ')}</p>
                        <p><strong>Expected Return:</strong> {rec.expectedReturn}</p>
                        {rec.suitable && <span className="recommended">✅ Recommended</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ANOMALIES TAB */}
        {activeTab === 'anomalies' && (
          <div className="tab-content anomalies">
            <h2>⚠️ Spending Anomalies Detected</h2>
            
            {anomalies?.anomalies && anomalies.anomalies.length > 0 ? (
              <div className="anomalies-list">
                {anomalies.anomalies.map((anomaly, idx) => (
                  <div key={idx} className={`anomaly-card severity-${anomaly.severity.toLowerCase()}`}>
                    <div className="anomaly-header">
                      <span className="date">{new Date(anomaly.date).toLocaleDateString()}</span>
                      <span className={`severity ${anomaly.severity.toLowerCase()}`}>
                        {anomaly.severity} Severity
                      </span>
                    </div>
                    <p><strong>Amount:</strong> {formatCurrency(anomaly.amount)}</p>
                    <p><strong>Category:</strong> {anomaly.category}</p>
                    <p><strong>Deviation:</strong> {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}%</p>
                    <p className="message">{anomaly.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-anomalies">
                <p>✅ No significant anomalies detected in your spending patterns.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="reports-footer">
        <p>
          📊 Report generated with ML-powered insights • Data source: Moody's Analytics & internal analytics
        </p>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Updates last sync on: {reportData?.timestamp && new Date(reportData.timestamp).toLocaleString()}
        </p>
      </footer>
    </div>
  );
};

export default EnhancedReports;
