const { Router } = require('express');
const billController = require('../controllers/billControllers');
const router = Router();
const auth = require('../middleware/auth');

router.post('/checkout/:userId',auth, billController.checkout);
router.post('/payment/:userId',auth, billController.payment);




module.exports = router;