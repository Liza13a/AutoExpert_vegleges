const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { ServiceRecord } = require('../models');
const router = express.Router();

router.patch('/service_records/:id', protect, authorize('user', 'admin'), async (req, res) => {
    try {
        const record = await ServiceRecord
            .findById(req.params.id)
            .populate('car_config_id'); // ✅ FONTOS

        if (!record) {
            return res.status(404).json({ success: false, msg: 'Nincs ilyen service record' });
        }

        // 🔐 USER csak saját autót módosíthat
        if (req.user.role === 'user') {
            if (!record.car_config_id) {
                return res.status(500).json({ msg: "Hibás adatkapcsolat" });
            }

            if (record.car_config_id.user_id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, msg: 'Ehhez nincs jogod' });
            }
        }

        const updatableFields = [
            'car_config_id',
            'repair_shop_id',
            'employee_id',
            'service_date',
            'description',
            'cost'
        ];

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                record[field] = req.body[field];
            }
        });

        await record.save();

        res.json({ success: true, msg: 'Service record frissítve', data: record });

    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
});

module.exports = router;