const router = require("express").Router();
const passport = require('passport');
const User = require("../models/user").User;

router.get("/oauth/:provider", (req, res, next) => {
    passport.authenticate(req.params.provider, {
        scope: ['profile', 'email']
    })(req, res, next);
});

router.get("/oauth/:provider/callback", (req, res, next) => {
    // console.log("Callback");
    passport.authenticate(req.params.provider, {
        successRedirect: process.env.FRONTEND_URL,
        failureRedirect: process.env.FRONTEND_URL + '/login'
    })(req, res, next);
});

module.exports = router;