const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator')


const BillSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: [true, 'Enter enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']

    },
    storage: {
        type: Number
    },   
    amount: {
        type: Number,
        required: true
    },
    date_added: {
        type: Date,
        default: Date.now
    }
})
// mongoose.model('ModelName', mySchema)

module.exports = Bill = mongoose.model('bill', BillSchema);
