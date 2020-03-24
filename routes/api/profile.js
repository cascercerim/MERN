const express = require('express');
const router = express.Router();

// @route   GET api/profile
// @desc    Test route
// @access  Public //public routes you do not need a token for 
router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;