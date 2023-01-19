const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator')


const OtpSchema = new Schema({
   
    email: {
        type: String,
        require: [true, 'Enter enter an email'],
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']

    },
    code:{
        type:String
    },
    expireIn:{
        type:Number
    }
    
},{
    timestamps:true
})
                       

module.exports = Otp = mongoose.model('otp',OtpSchema,'emailotp');
