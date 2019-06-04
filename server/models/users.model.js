const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  appointments: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment',
  }]
}, {
  versionKey: false
});

module.exports = mongoose.model('User', UserSchema);