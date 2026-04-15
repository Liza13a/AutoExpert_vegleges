const express = require('express');
const { protect,authorize  } = require("../middleware/auth");
const { ServiceRecord } = require("../models");
const router = express.Router(); 

// Minden service record lekérése
router.get('/service_records', protect, authorize('user', 'admin'), async (req, res) => {
    try {
        const records = await ServiceRecord.find(); 
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: error.message });
    }
});

module.exports = router;