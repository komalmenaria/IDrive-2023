const { Router } = require('express');
const authController = require('../controllers/authControllers');
const router = Router();
const auth = require('../middleware/auth');

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.get('/user', auth, authController.get_user);
router.post('/email-send',  authController.emailSend);
router.post('/change-password',  authController.changePassword);
router.get('/get_user_storage/:userId',  authController.get_user_storage);



module.exports = router;