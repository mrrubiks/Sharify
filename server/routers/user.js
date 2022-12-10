const router = require("express").Router();
const passport = require('passport');
const User = require("../models/user").User;

router.post("/register", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(201).json({
            message: "Already logged in",
        });
    }
    else {
        User.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    res.status(409).json({
                        message: "Username already exists",
                    });
                }
                else {
                    return User.register(new User({ username: req.body.username }), req.body.password);
                }
            })
            .then((user) => {
                passport.authenticate('local')(req, res, () => {
                    res.status(200).json({
                        message: "Registered",
                    });
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Internal server error",
                });
            });
    }
});

router.post("/login", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            message: "Already logged in",
        });
    }
    else {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                res.status(500).json({
                    message: "Internal server error",
                });
            }
            else if (!user) {
                res.status(401).json({
                    message: "Unauthorized",
                });
            }
            else {
                req.logIn(user, (err) => {
                    if (err) {
                        res.status(500).json({
                            message: "Internal server error",
                        });
                    }
                    else {
                        res.status(200).json({
                            userId: user.id,
                            message: "Logged in",
                        });
                    }
                });
            }
        })(req, res);
    }
});

router.post("/logout", (req, res) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                res.status(500).json({
                    message: "Internal server error",
                });
            }
            else {
                res.status(200).json({
                    message: "Logged out",
                })
            }
        });
    }
    else {
        res.status(200).json({
            message: "Already logged out",
        });
    }
});

router.get("/isAuthenticated", (req, res) => {
    // console.log(req.user);
    if (req.isAuthenticated()) {
        res.status(200).json({
            userId: req.user._id,
            isAuthenticated: true,
        });
    }
    else {
        res.status(200).json({
            isAuthenticated: false,
        });
    }
});

router.get("/", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

module.exports = router;