const express = require('express');
const { protect,authorize } = require("../middleware/auth");
const { CarConfig } = require("../models");
const router = express.Router(); 

// DELETE adott ID-jű autó konfiguráció
router.delete('/car_configs/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const id = req.params.id;
        const data = await CarConfig.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({ success: false, msg: `Nincs ilyen autó konfiguráció ezzel az ID-val: ${id}` });
        }

        res.json({ success: true, msg: `A(z) ${data.brand} ${data.model} típusú autó konfiguráció sikeresen törlésre került.` });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
});

module.exports = router; 