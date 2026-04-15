const jwt = require('jsonwebtoken')
const { User } = require('../models')

// Csak bejelentkezett felhasználók ellenőrzése
exports.protect = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({ success: false, msg: "Nincs jogod ehhez az útvonalhoz!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')

        if (!req.user) {
            return res.status(401).json({ success: false, msg: "Felhasználó nem található!" });
        }

        next()
    } catch (error) {
        res.status(401).json({ success: false, msg: "Érvénytelen token" });
    }
}

// Role alapú jogosultság middleware
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, msg: "Nincs jogod ehhez az útvonalhoz!" });
        }
        next();
    }
}