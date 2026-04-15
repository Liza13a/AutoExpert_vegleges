const express = require('express'); 
const { RepairShop } = require("../models");
const router = express.Router(); 

// Létező szervizek lekérése
router.get('/repair_shops', async  (req, res) => {
    try {
        const data = await RepairShop.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 