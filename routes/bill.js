const { Router } = require('express');
const billController = require('../controllers/billControllers');
const router = Router();
const auth = require('../middleware/auth');

router.post('/checkout/:userId', billController.checkout);
router.post('/payment/:userId', billController.payment);




module.exports = router;