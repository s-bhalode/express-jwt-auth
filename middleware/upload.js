const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const dotenv = require('dotenv');
dotenv.config({path:'../.env'});


const s3 = new aws.S3({
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_KEY,
    Bucket : process.env.AWS_BUCKET_NAME
});

const upload = multer({
    storage : multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString())
        }
    })
});

module.exports = upload;