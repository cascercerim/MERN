const express = require("express");
const router = express.Router();
const gravater = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
// @route   POST api/users
// @desc    register user
// @access  Public //public routes you do not need a token for
router.post(
    "/",
    [
        check("name", "Name is required")
            .not()
            .isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check(
            "password",
            "Please enter a password with 6 or more characters"
        ).isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "User already exists" }] });
            }

            const avatar = gravater.url(email, {
                s: "200",
                r: "pg",
                d: "mm"
            });

            // create user 
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // hash password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            // save user into the db
            await user.save();

            // get payload which includes user id
            const payload = {
                user: {
                    id: user.id
                }
            };

            // signe token 
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
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
