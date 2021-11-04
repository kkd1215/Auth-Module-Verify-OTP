const mongoose = require('mongoose');

const { Schema } = mongoose;

const AccessTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
}, {
  timestamps: {},
  collection: 'AccessToken',
  minimize: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

AccessTokenSchema.virtual('user', {
  ref: 'User', // The model to use
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

module.exports = AccessToken;