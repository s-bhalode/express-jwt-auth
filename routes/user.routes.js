const express = require('express');
const router = new express.Router();
const userController = require('../controller/user.controller');
const upload = require('../middleware/upload');


router.post('/register', userController.signup);

router.post('/login', userController.signin);

// to upload single file
// router.post('/upload', upload.single('photos'), userController.uploadSingleFile);

// to upload multiple files
router.post('/upload', upload.array('photos', 3), userController.uploadMultipleFiles);


module.exports = router;