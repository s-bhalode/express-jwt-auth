const aws = require('aws-sdk');
const multer = require('multer');
const https = require('https');
const multerS3 = require('multer-s3');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({path:'../.env'});
const {getSignedUrl, S3RequestPresigner} = require('@aws-sdk/s3-request-presigner');
const {S3Client, GetObjectCommand, ListObjectsCommand, PutObjectCommand} = require('@aws-sdk/client-s3');
const { parseUrl } = require("@smithy/url-parser");
const { formatUrl } = require("@aws-sdk/util-format-url");
const { fromIni } = require("@aws-sdk/credential-providers");
const { Hash } = require("@smithy/hash-node");
const { HttpRequest } = require("@smithy/protocol-http");
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const s3 = new aws.S3({
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey : process.env.AWS_SECRET_KEY,
    Bucket : process.env.AWS_BUCKET_NAME
});


const createPresignedUrlWithClient = async (region, bucket, key) => {
    // const client = new S3Client({region: region});
    // const command = new PutObjectCommand({Bucket: bucket, Key: key});
    // return await getSignedUrl(client, command, {expiresIn: 300});

    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
    const presigner = new S3RequestPresigner({
        credentials: fromIni(),
        region,
        sha256: Hash.bind(null, "sha256"),
    });

    const signedUrlObject = await presigner.presign(
        new HttpRequest({ ...url, method: "PUT" }),
    );
    return formatUrl(signedUrlObject);
}

// const uploadViaPresignedUrl = async (url, data) => {
//     return new Promise((resolve, reject) => {
//         const req = https.request(url, {
//             method: "PUT",
//             headers: {"Content-Length" : new Blob([data].size)}
//         },
//         (res) => {
//             let resBody = "";
//             res.on("data", (chunk) => {
//                 resBody += chunk;
//             });
//             res.on("end", () => {
//                 resolve(resBody);
//             })
//         })
//         req.on("error", (err) => {
//             reject(err);
//         })
//         req.write(data);
//         req.end();
//     })
// }

// const uploadViaPresignedUrl = async (req, res) => {
//     const command = new GetObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME, 
//         // Body: req.file.buffer, 
//         Key: req.file.originalname
//     });
//     const url = await getSignedUrl(client, command, {expiresIn: 300});
//     // const response = await client.send(command);
    

//     return res.json({url : url});
// }

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();
const directory_name = '/'+year+'/'+month+'/'+day


const upload = multer({
    storage : multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME + directory_name ,
        contentType : multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb) => {
            cb(null, `${Date.now().toString()}${file.originalname}`)
        }
    })
});
// const upload = multer();

module.exports = {
    upload,
    // uploadViaPresignedUrl,
    createPresignedUrlWithClient
};