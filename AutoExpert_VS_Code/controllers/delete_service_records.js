const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { ServiceRecord } = require('../models');
const router = express.Router();

// Törlés route
router.delete('/service_records/:id', protect, authorize('user', 'admin'), async (req, res) => {
    try {
        const record = await ServiceRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ success: false, msg: 'Nincs ilyen service record' });

        // User csak a saját autójához tartozó rekordot törölheti
        if (req.user.role === 'user' && record.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Ehhez nincs jogod' });
        }

        await record.deleteOne();
        res.json({ success: true, msg: 'Service record sikeresen törölve', data: record });

    } catch (error) {
        res.status(500).json({ success: false, msg: error.message });
    }
});

module.exports = router;