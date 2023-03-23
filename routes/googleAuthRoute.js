
const passport = require('passport');
require("../controller/googleAuthController.js")(passport)
const express = require("express")
const router = express.Router()

router.get("/login/success", (req, res) => {
    if (req.user) {
        return res.status(200).json({
            status: "success",
            message: "Successfully Loged In",
            user: req.user,
        });
    } else {
        return res.status(403).json({ error: true, message: "Not Authorized" });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        status: "fault",
        message: "Log in failure",
    });
});

router.route('/google').get(
    passport.authenticate('google', { scope: ['profile', 'email'] }
    ));

router.route('/google/callback').get(
    passport.authenticate('google', {
        successRedirect: 'https://matt-young-media-frontend-jpz8mdruo-chaitanyatyagi.vercel.app/daily-image',
        failureRedirect: '/login/failed'
    })
);

router.route('/google/success').get((req, res) => {
    return res.status(200).json({
        status: "success",
        message: "This is today's image of the day by NASA.",
        user: req.user
    })
})

router.get("/logout", (req, res) => {
    req.logout(function (error) {
        if (error) {
            return res.status(200).json({
                status: "fault",
                message: "Something went wrong!"
            })
        }
        res.redirect("https://matt-young-media-frontend-jpz8mdruo-chaitanyatyagi.vercel.app/daily-image");
    });

});

module.exports = router
