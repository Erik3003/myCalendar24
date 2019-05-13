const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    title: {
      type: String,
      required: true
    },
    date: {
        type: Date,
        required: true
    },
    enddate: {
      type: Date,
      required: false
    },
    description: {
        type: String,
        required: false
    }
  }, {
    versionKey: false
  });
  
  
  module.exports = mongoose.model('Appointment', AppointmentSchema);