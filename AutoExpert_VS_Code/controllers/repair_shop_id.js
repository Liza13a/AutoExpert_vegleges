const express = require('express'); 
const { CarConfig } = require("../models");
const router = express.Router(); 


// Egy adott szerviz autóinak lekérdezése
router.get('/repair_shops/:shopId/car_configs', async (req, res) => {
    try {
        const data = await CarConfig.find({ repairShopId: req.params.shopId });
        if (data.length === 0) return res.status(404).json({ message: 'Nincs ilyen autó konfiguráció ebben a szervizben.' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 