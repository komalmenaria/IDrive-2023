const User = require("../models/User");
const Otp = require("../models/Otp");
var nodemailer = require('nodemailer');
const config = require("config");
const AWS = require('aws-sdk');
const accessKeyId = config.get("accessKeyId");
const secretAccessKey = config.get("secretAccessKey");
const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});
// const {errorHandler} = require("../util")
const { generateHash, generateToken, compareHash } = require("../util")
module.exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ msg: "Please enter all fields" });
        }

        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ msg: "User already exists" });
        let folderName = email.split(/[@]+/);
        const folderParams = {
            Bucket: "inotebook2023",
            Key: `${folderName[0]}/`
        };
        await s3.putObject(folderParams, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Folder ${folderName[0]} created successfully `)
            }
        });
        const newUser = new User({ name, email, password, role: 1 ,storage:0,folder:`${folderName[0]}`});
        let hashPassword = await generateHash(password)
        newUser.password = hashPassword;
        await newUser.save()


        let jwtToken = await generateToken({ id: newUser._id })
        res.send({
            token: jwtToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: 1,
                storage:0
            }
        })
    } catch (error) {
        // errorHandler(error)
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }

};


module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: 'Please enter all the fileds' });
        }

        let user = await User.findOne({ email })
        if (!user) return res.status(400).json({ msg: "User doesn't exists" });

        let checkPassword = await compareHash(password, user.password)
        if (!checkPassword) {
            return res.status(401).json({ msg: "Password doesnt match" });
        }
        let jwtToken = await generateToken({ id: user._id })
        res.send({
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: 1,
                storage:0
            }
        })
    } catch (error) {
        // errorHandler(error)
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }

}

module.exports.get_user = (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
}

module.exports.emailSend = async (req, res) => {
    let data = await User.findOne({ email: req.body.email });

    try {
        if (data) {
            let otpcode = Math.floor(Math.random() * 10000) + 1;
            let otpData = new Otp({
                email: req.body.email,
                code: otpcode,
                expireIn: new Date().getTime() + 300 * 1000
            })
            let otpResponse = await otpData.save();
            mailer(otpResponse.email, otpResponse.code)

            return res.status(200).json({ msg: 'OTP Sent check your email' });
        } else {
            return res.status(400).json({ msg: 'Email id not exist' });
        }

    } catch (error) {
        // errorHandler(error)
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }

}

module.exports.changePassword = async (req, res) => {
    try {
        let data = await Otp.find({ email: req.body.email, code: req.body.otpCode });

        if (!req.body.email) {
            return res.status(400).json({ msg: 'Please enter email Id' });
        }
        else if (!req.body.otpCode) {
            return res.status(400).json({ msg: 'Please enter otp' });
        }
        else if (!req.body.password) {
            return res.status(400).json({ msg: 'Please enter new password' });
        }
        if (data) {
            let currentTime = new Date().getTime();
            let diff = data.expireIn - currentTime;
            if (diff <= 0) {
                return res.status(400).json({ msg: "OTP expired" });
            }
            else {
                let user = await User.findOne({ email: req.body.email });
                let hashPassword = await generateHash(req.body.password)

                if (!user) {
                    return res.status(400).json({ msg: "User not exist" });
                }
                user.password = hashPassword
                await user.save();
                return res.status(200).json({ msg: "Password changed successfully" });

            }
        }
        else {
            return res.status(400).json({ msg: "Invalid OTP" });
        }

    } catch (error) {
        // errorHandler(error)
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}

const mailer = (email, otp) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: 'komalmenariacpm2003@gmail.com',
            pass: 'zdzdgsfkgqjycntb'
        }

    });


    var mailOptions = {
        from: 'komalmenariacpm2003@gmailcom',
        to: email,
        subject: 'Verify OTP For Inotebook',
        text: `Your OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}