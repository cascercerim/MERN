const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public //public routes you do not need a token for

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "-password"
        );
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server.error");
    }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public

router.post(
    "/",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid credentials" }] });
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            // get payload which includes user id
            const payload = {
                user: {
                    id: user.id
                }
            };

            // sign token
            jwt.sign(
                // pass in payload
                payload,
                // pass in secret
                config.get("jwtToken"),
                // expiration which is optional
                { expiresIn: 360000000 },
                // inside the callback function we will get either error or token
                (err, token) => {
                    if (err) throw err;
                    // if we dont get an error we will send token back to client
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    });

module.exports = router;
