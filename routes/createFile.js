const { Router } = require('express');
const createfileController = require('../controllers/createfileController');
const router = Router();
const auth = require('../middleware/auth');



router.post('/createFile/:userId/:mongoFolderKey',auth,createfileController.create_file);
router.get('/readFile/:userId/:mongoFolderKey/:fileName',auth,createfileController.read_file);
router.put('/updateFile/:userId/:mongoFolderKey/:fileName',auth,createfileController.update_file);
router.delete('/deleteFile/:userId/:mongoFolderKey/:fileName',auth,createfileController.delete_file);




module.exports = router;