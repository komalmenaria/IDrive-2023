const User = require("../models/User");
const Bill = require("../models/Bill");
const Razorpay = require('razorpay');
const crypto = require("crypto");

module.exports.checkout = async (req, res) => {

    try {
        let instance = new Razorpay({ key_id: process.env.KEYID, key_secret: process.env.KEYSECRET });
        const userId = req.params.userId
        const purchased_storage = parseInt(req.body.storage)
        let user = await User.findOne({ _id: userId })
        if (!user) {
            res.status(400).json({ msg: "User not found" });
        }
        const { name, email, storage, amount } = req.body;

        if (!name ) {
            return res.status(400).json({ msg: "Please enter name" });
        }
        
        if (!email ) {
            return res.status(400).json({ msg: "Please enter email" });
        }
        if (!storage ) {
            return res.status(400).json({ msg: "Please select storage" });
        }
        if (!amount ) {
            return res.status(400).json({ msg: "Please enter amount" });
        }

        const options = {
            amount: amount * 100, // in paise (100 paise = 1 INR)
            currency: 'INR',
            receipt: userId,
            payment_capture: 1
        };

        await instance.orders.create(options, async function (err, order) {
            if (err) {
                throw err
            } else {
                
                res.send(order)
                user.provided_Storage += purchased_storage
                user.save()
                const newBill = new Bill({ name, email, storage, amount:amount});
                await newBill.save()
               
               
            }
        });
      

    }
    catch (error) {
        // errorHandler(error)
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}

module.exports.payment = async (req, res) => {
    let userId = req.params.userId;
    let user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
    console.log(req.body)
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        let body = razorpay_order_id + "|" + razorpay_payment_id;


        var expectedSignature = crypto.createHmac('sha256', 'qzYLGhzGC1V5feLfZUj94Ser')
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", razorpay_signature);
        console.log("sig generated ", expectedSignature);
        var response = { "signatureIsValid": "false" }
        if (expectedSignature === razorpay_signature) {
            response = { "signatureIsValid": "true" }


        }
       
        return res.send(response);

    } catch (error) {
        res.status(500).send(error);
    }
}