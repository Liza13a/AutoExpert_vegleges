const express = require('express'); 
const { ServiceRecord } = require("../models");
const router = express.Router(); 

// Egy adott szervizhez tartozó összes szerviz történet lekérése
router.get('/repair_shops/:shopId/service_records', async (req, res) => {
    try {
        const records = await ServiceRecord.find({ repair_shop_id: req.params.shopId })
            .populate('car_config_id', 'brand model engine_type')
            .populate('employee_id', 'full_name position');

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 