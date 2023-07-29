const mongoose = require("mongoose");
const appointmentSchema =mongoose.Schema({
  pName:{
    type:String,
    required:true
  },
  pEmail:{
    type:String,
    required:true
  },
  dName: {
    type:String,
    required:true
  },
  aDate:{
    type:Date,
    default:Date.now
  }
});

module.exports = appointmentSchema;
