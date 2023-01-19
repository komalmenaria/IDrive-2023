const { Router } = require('express');
const authController = require('../controllers/authControllers');
const router = Router();
const auth = require('../middleware/auth');


router.get('/MyUplodes/:id?', auth, folderController.MyUplodes);


module.exports = router;