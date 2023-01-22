const { Router } = require('express');
const fileController = require('../controllers/fileController');
const router = Router();
const auth = require('../middleware/auth');

router.get('/getfiles/:userId/:mongoFolderKey',auth, fileController.get_files);
router.post('/uploadfiles/:userId/:mongoFolderKey',auth, fileController.upload_files);




module.exports = router;