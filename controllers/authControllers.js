const User = require("../models/User");
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
        const newUser = new User({ name, email, password , role:1});
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
                role:1
            }
        })
    } catch (error) {
        // errorHandler(error)
        console.log(error)
         return res.status(500).json({msg:"Technical error occured"})
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
                role:user.role || 1
            }
        })
    } catch (error) {
        // errorHandler(error)
        console.log(error)
         return res.status(500).json({msg:"Technical error occured"})
    }

}

module.exports.get_user = (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
}