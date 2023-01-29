const { Router } = require('express');
const createfileController = require('../controllers/createfileController');
const router = Router();
const auth = require('../middleware/auth');



router.post('/createFile_folder/:userId/:folderName',auth,createfileController.create_file_folder);
router.get('/readFile_folder/:userId/:folderName/:fileName',auth,createfileController.read_file_folder);
router.put('/updateFile_folder/:userId/:folderName/:fileName',auth,createfileController.update_file_folder);
router.delete('/deleteFile_folder/:userId/:folderName/:fileName',auth,createfileController.delete_file_folder);
router.delete('/deleteImage_folder/:userId/:folderName/:imageName',auth,createfileController.delete_image_folder);



router.post('/createFile/:userId',auth,createfileController.create_file);
router.get('/readFile/:userId/:fileName',auth,createfileController.read_file);
router.put('/updateFile/:userId/:fileName',auth,createfileController.update_file);
router.delete('/deleteFile/:userId/:fileName',auth,createfileController.delete_file);
router.delete('/deleteImage/:userId/:imageName',auth,createfileController.delete_image);




module.exports = router;