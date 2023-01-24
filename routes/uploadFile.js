const { Router } = require('express');
const uploadfileController = require('../controllers/uploadfileController');
const router = Router();
const auth = require('../middleware/auth');


router.get('/getfiles/:userId/:mongoFolderKey',auth, uploadfileController.get_files);
router.post('/uploadfiles/:userId/:mongoFolderKey',auth,uploadfileController.upload_files);




module.exports = router;