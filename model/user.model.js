const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_name : {
        type : String,
        default : null
    },
    user_email : {
        type: String,
        unique : true,
    },
    user_password : {
        type: String
    },
    user_token: {
        type: String
    }
})


module.exports = mongoose.model("user", userSchema);