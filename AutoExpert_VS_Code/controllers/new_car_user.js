const express = require('express'); 
const { protect,authorize  } = require("../middleware/auth");
const { CarConfig } = require("../models");

const router = express.Router(); 

// Új autó hozzáadása felhasználóhoz 
router.post('/car_configs', protect, authorize('user', 'admin'), async (req, res) => {
    try {
        const { brand, model, engine_type } = req.body;
        if (!brand || !model || !engine_type) {
            return res.status(400).json({ success: false, msg: "Minden autó adatot meg kell adni!" });
        }

        const newCar = await CarConfig.create({
            user_id: req.user._id, 
            brand,
            model,
            engine_type
        });

        res.status(201).json({ success: true, car: newCar });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, msg: "Már létezik ilyen autó!" });
        }
        res.status(400).json({ success: false, msg: error.message });
    }
});

module.exports = router; 