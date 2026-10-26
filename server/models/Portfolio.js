import mongoose from 'mongoose';

// One document holds the whole portfolio content (same shape as the original data.js DATA object).
const PortfolioSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Portfolio', PortfolioSchema);
