const { Router } = require('express');
const uploadController = require('../controllers/uploadControllers');
const router = Router();
const auth = require('../middleware/auth');

router.post('/upload',auth, uploadController.upload_files);



module.exports = router;