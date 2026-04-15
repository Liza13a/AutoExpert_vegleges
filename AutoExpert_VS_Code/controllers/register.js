const { User } = require("../models");
const express = require('express');
const router = express.Router();

// Token küldéséhez
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true
    };
    res.status(statusCode).cookie('token', token, options).json({ success: true, token });
};

// Új felhasználó regisztráció
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.create({ name, email, password, role });
        sendTokenResponse(user, 200, res);
    } catch (error) {
        if (error.code === 11000 && error.keyValue?.email) {
            return res.status(409).json({ success: false, msg: "Ez az email már foglalt!" });
        }
        res.status(400).json({ success: false, msg: error.message });
    }
});

module.exports = router;