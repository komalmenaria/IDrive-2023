const { Router } = require('express');
const uploadfileController = require('../controllers/uploadfileController');
const router = Router();
const auth = require('../middleware/auth');


router.get('/getfiles/:userId',auth, uploadfileController.get_files);
router.get('/getimages/:userId',auth, uploadfileController.get_images);
router.post('/uploadfiles/:userId',auth,uploadfileController.upload_files);
router.get('/getfiles_folder/:userId/:folderName',auth, uploadfileController.get_files_folder);
router.get('/getimages_folder/:userId/:folderName',auth, uploadfileController.get_images_folder);
router.post('/uploadfiles_folder/:userId/:folderName',auth,uploadfileController.upload_files_folder);




module.exports = router;