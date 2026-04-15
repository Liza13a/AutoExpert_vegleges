const express = require('express'); 
const { protect,authorize  } = require("../middleware/auth");
const { CarConfig, RepairShop, Employee, ServiceRecord } = require("../models");
const router = express.Router(); 

// Új ServiceRecord létrehozása
router.post('/service_records', protect, authorize('user', 'admin'), async (req, res) => {
    try {
        let { car_config_id, repair_shop_id, employee_id, service_date, description, cost } = req.body;

        repair_shop_id = Number(repair_shop_id);
        employee_id = Number(employee_id);
        cost = Number(cost);

        // Ellenőrzés, hogy minden adat megvan
        if (car_config_id == null || repair_shop_id == null || employee_id == null || !service_date || !description || cost == null) {
            return res.status(400).json({ success: false, msg: "Hiányos adatok!" });
        }

        // Ellenőrzés: CarConfig létezik-e
        const car = await CarConfig.findOne({ _id: car_config_id });
        if (!car) return res.status(404).json({ success: false, msg: "Nincs ilyen autó konfiguráció!" });

        // Ellenőrzés: RepairShop létezik-e
        const shop = await RepairShop.findOne({ _id: repair_shop_id });
        if (!shop) return res.status(404).json({ success: false, msg: "Nincs ilyen szerviz!" });

        // Ellenőrzés: Employee létezik-e
        const employee = await Employee.findOne({ _id: employee_id });
        if (!employee) return res.status(404).json({ success: false, msg: "Nincs ilyen alkalmazott!" });

        // Új rekord létrehozása
        const newRecord = await ServiceRecord.create({
            car_config_id,
            repair_shop_id,
            employee_id,
            service_date,
            description,
            cost
        });

        res.status(201).json({ success: true, data: newRecord });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: error.message });
    }
});

module.exports = router;