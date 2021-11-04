const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema ({
  firstName: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: [true, 'Email should be unique'],
    lowercase: true,
    required: [true, 'Email is required'],
  },
  lastLoginAt: {
    type: Date,
    required: false,
  },
  loginOtp: {
    type: String,
    required: false,
  },
  loginToken: {
    type: String,
    required: false,
  },
  isDisabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  deletedAt: {
    type: Date,
    required: false,
    default: null,
  },
}, {
  timestamps: {},
  collection: 'User',
  minimize: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

UserSchema.virtual('id').get(function () {
  return this._id.toString();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;