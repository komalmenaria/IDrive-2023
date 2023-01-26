const { Router } = require('express');
const folderController = require('../controllers/folderControllers');
const router = Router();
const auth = require('../middleware/auth');


router.get('/folders/:id', auth, folderController.get_folders);
router.post('/createfolder/:id/:parentFolder', auth, folderController.create_folder);
// router.put('/folder/:id', auth, folderController.update_folder);
router.delete('/deletefolder/:id/:folderName', auth, folderController.delete_folder);


module.exports = router;