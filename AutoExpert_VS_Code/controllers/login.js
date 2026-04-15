const { User } = require("../models");
const express = require('express');
const router = express.Router();

//Token küldéséhez
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true
    };
    res.status(statusCode).cookie('token', token, options).json({ success: true, token });
};

// Belépés
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, msg: 'Érvénytelen email vagy jelszó!' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, msg: 'Érvénytelen email vagy jelszó!' });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
});

module.exports = router;