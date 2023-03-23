const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const { sendMail } = require("../utils/sendMail")

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const user = await User.findOne({ email })

        if (name.length == 0 || email.length == 0 || password.length == 0) {
            return res.status(200).json({
                status: "fault",
                message: "Please fill all the details correctly !"
            })
        }

        if (user && user.length != 0) {
            return res.status(200).json({
                status: "fault",
                message: "You have already registered !"
            })
        }

        const newUser = await User.create({
            email, password, name
        })

        return res.status(200).json({
            status: "success",
            message: "Registered Successfully !",
            newUser
        })
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: "error",
            message: error
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({
            email
        })

        if (!user || user.length == 0) {
            return res.status(200).json({
                status: "fault",
                message: "No user found. Please register first !"
            })
        }

        if (user && user.password != password) {
            return res.status(200).json({
                status: "fault",
                message: "Entered password is wrong !"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        await User.updateOne({ email }, { $set: { jwt: token } })

        res.cookie('jwt', token)
        return res.status(200).json({
            status: "success",
            message: "Logged In Successfully !",
            token
        })
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: "error",
            message: error
        })
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email
        const user = await User.find({ email })
        if (user.length == 0) {
            return res.status(200).json({
                status: "fault",
                message: "No user found. Please register first !"
            })
        }
        let token = "123456"
        await User.updateOne({ email }, { resetTokenForPassword: token, resetTokenTime: Date.now() + 10 * 60 * 1000 })
        await sendMail(email, `<p>Please reset your password at this link - <a href="http://127.0.0.1:3000/reset-password?token=${token}">Click</a></p>`, "Reset Your Password",)

        return res.json(
            {
                verdict: 1,
                message: 'working'
            }
        )

    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: "error",
            message: error
        })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const password = req.body.password
        const token = req.params.token
        const user = await User.findOne({ resetTokenForPassword: token, resetTokenTime: { $gt: Date.now() } })

        if (user.length == 0) {
            return res.status(200).json({
                status: "fault",
                message: "Your link has expired !"
            })
        }

        if (password.lenght == 0) {
            return res.status(200).json({
                status: "fault",
                message: "Please enter the password !"
            })
        }

        await User.findOneAndUpdate({ resetTokenForPassword: token }, { $set: { resetTokenForPassword: "" }, $set: { resetTokenTime: "" }, $set: { password: password } })
        return res.status(200).json({
            status: "success",
            message: "Your password has been reset !"
        })
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({
            status: "error",
            message: error
        })
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('jwt')
        return res.status(200).json({
            status: "success",
            message: "You are logged out!"
        })
    }
    catch (error) {
        return res.status(400).json({
            status: "error",
            message: error
        })
    }
}