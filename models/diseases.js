const mongoose = require("mongoose");
const validator = require("validator");

const diseaseSchema = new mongoose.Schema({
    title:{
        type:String,
        
    },
    
    summary:{
        type:String,
        
     },
     symptoms:{
         type:Array,
        
     },
    
})
const Disease = new mongoose.model('Disease',diseaseSchema);
module.exports = Disease;