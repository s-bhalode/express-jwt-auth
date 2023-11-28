const express = require('express');
const router = new express.Router();
const userController = require('../controller/user.controller');
const upload = require('../middleware/upload');
const aws = require('aws-sdk');
const multer = require('multer');

aws.config.update({
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_KEY,
    region : process.env.AWS_BUCKET_REGION
})

const s3 = new aws.S3();


router.post('/register', userController.signup);

router.post('/login', userController.signin);

// to upload single file
// router.post('/upload', upload.upload.single('photos'), userController.uploadSingleFile);

// to upload multiple files
// router.post('/upload', upload.upload.array('photos', 3), userController.uploadMultipleFiles);


router.post('/upload-by-presigned-url', upload.upload.single('file'), userController.uploadFile);



module.exports = router;