const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  investmentAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  duration: {
    type: String,
    enum: ['3m', '6m', 'annual'],
    default: 'annual'
  },
  interestRate: {
    type: Number,
    required: true
  },
  expectedReturn: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Investment', investmentSchema);
