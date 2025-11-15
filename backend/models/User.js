const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  ranking: {
    type: String,
    default: 'Beginner'
  },
  esportsPurpose: {
    type: String,
    default: ''
  },
  resetPasswordCode: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  emailVerificationCode: {
    type: String
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  newEmailVerificationCode: {
    type: String
  },
  newEmail: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique user ID
userSchema.pre('save', function(next) {
  if (!this.userId) {
    this.userId = Math.floor(Math.random() * 900000000 + 100000000).toString();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);