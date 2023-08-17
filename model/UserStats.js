const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  general: {
    inapp_time: {
      type: Number,
      default: 0
    },
    last_accessed_date: {
      type: Date,
      default: Date.now
    },
    levels_completed: {
      type: Number,
      default: 0
    },
    teacher_assigned: {
      type: String,
      default: "None"
    }
  },
  level1: {
    level_time: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0
    },
    avg_mistakes: {
      type: Number,
      default: 0
    }
  },
  level2: {
    level_time: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0
    },
    avg_mistakes: {
      type: Number,
      default: 0
    }
  },
  level3: {
    level_time: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0
    },
    avg_mistakes: {
      type: Number,
      default: 0
    }
  }
});

module.exports = mongoose.model('UserStats', userStatsSchema);
