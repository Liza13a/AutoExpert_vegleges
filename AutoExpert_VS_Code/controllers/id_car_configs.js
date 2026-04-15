const express = require('express');
const { protect,authorize  } = require("../middleware/auth");
const { CarConfig } = require("../models");
const router = express.Router();

// PATCH adott ID-jű autó konfiguráció frissítése
router.patch('/car_configs/:id', protect, authorize('user', 'admin'), async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true, runValidators: true };
        const result = await CarConfig.findByIdAndUpdate(id, updatedData, options);
        if (result) {
            res.send(result);
        } else {
            res.status(404).json({ message: `${id} azonosítóval nem létezik autó konfiguráció!` });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 