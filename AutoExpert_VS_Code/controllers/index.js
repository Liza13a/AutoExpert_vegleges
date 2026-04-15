const express = require('express');
const router = express.Router();

// Különálló route fájlok behúzása
router.use(require('./login'));                    //belépés
router.use(require('./delete_car'));               // autó törlése
router.use(require('./id_car_configs'));           // autó lekérése ID alapján
router.use(require('./new_car_user'));             // új autó hozzáadása userhez
router.use(require('./new_service_record'));       // új szerviz rekord
router.use(require('./register'));                 // regisztráció
router.use(require('./repair_shop_id'));           // szerviz lekérése ID alapján
router.use(require('./repair_shops_service_records')); // szerviz történetek lekérése
router.use(require('./repair_shops'));             // összes szerviz lekérése
router.use(require('./serv_rec_request'));         //szervizörténet lekérése
router.use(require('./new_service_record'));       //új szerviztörténet
router.use(require('./forgot_password'));         // elfelejtett jelszó
router.use(require('./delete_service_records'));  // szerviztörténet törlése
router.use(require('./service_record_update'));  // szerviztörténet frissítése
module.exports = router;