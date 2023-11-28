const User = require('../model/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');
const express = require('express');
const router = new express.Router();

const signup = async (req, res) => {
    try{
        const {user_name, user_email, user_password} = req.body;

        if(!user_name && user_password && user_email){
            res.status(400).send("All inputs are required!");
        }
        const oldUser = await User.findOne({user_email});
        if(oldUser){
            return res.status(409).send("User already exist. Please login");
        }
        const encrypted_password = bcrypt.hashSync(user_password, 8);

        const user = await User.create({
            user_name,
            user_email: user_email.toLowerCase(),
            user_password: encrypted_password
        });

        const token = jwt.sign({
            user_id: user._id, user_email
        },
        process.env.TOKEN_KEY,{
            expiresIn : "365d",
        });

        user.token = token;

        return res.status(201).json({user, message : `Registered successfully !!`});

    }catch(err){
        console.log(err);
        // res.status(err.status).json(err);
    }
}

const signin = async (req, res) => {
    try{
        const {user_email, user_password} = req.body;
        if(!user_email && !user_password){
            res.status(400).send("All inputs are required!");
        }
        const user = await User.findOne({user_email});
        if(user && bcrypt.compare(user_password, user.user_password)){
            const token = jwt.sign({
                user_id: user._id,
                user_email
            },
            process.env.TOKEN_KEY,{
                expiresIn: "365d"
            });
            user.token = token;
            
            if(user.token){
                return res.status(200).json("Logged in successfully !!");
            }
        }
        return res.status(400).json("Invalid Credentials");
    }catch(err){
        console.log(err);
    }
}

const uploadSingleFile = async (req, res) => {
    console.log("uploading single file");
    try{
        return res.send({
            data: req.file,
            msg : "successfully uploaded" + req.file.length + 'files !'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json("Internal server error");
    }
}

const uploadMultipleFiles = async (req, res) => {
    try{
        return res.send({
            data : req.files,
            msg : 'Successfully uploaded ' + req.files.length + ' files !'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

const uploadFile = async (req, res) => {
    try{
        const key = req.file.originalName;
        const url = await upload.createPresignedUrlWithClient(process.env.AWS_BUCKET_REGION, process.env.AWS_BUCKET_NAME, key);
        console.log(url);

        await router.post(url, uploadSingleFile);
        return res.ok();

    }catch(err){
        console.log(err);
        return res.status(500).json(err.message);
    }
}

module.exports = {
    signup,
    signin,
    uploadSingleFile,
    uploadMultipleFiles,
    uploadFile
}