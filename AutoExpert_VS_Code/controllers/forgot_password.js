const crypto = require('crypto');
const express = require('express');
const { User } = require('../models');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

//Jelszó újra küldése
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, msg: "Nincs ilyen felhasználó!" });
        }

        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/passwordreset/${resetToken}`;

        const message = `Kérlek kattints az alábbi linkre a jelszó visszaállításához:\n\n${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Jelszó visszaállítás',
                message,
            });

            res.status(200).json({ success: true, msg: 'Email elküldve a jelszó visszaállításhoz' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ success: false, msg: 'Email küldése sikertelen' });
        }

    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
});

module.exports = router;