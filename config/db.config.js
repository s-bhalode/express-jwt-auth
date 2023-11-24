const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path : '../.env'});
const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI, {
    // useNewUrlParser : true,
    // useUnifiedTopology : true,
    // useCreateIndex : true,
    // useFindAndModify : false
}).then(() => {
    console.log("Successfully connected to DB");
}).catch((error) => {
    console.log("connection failed...");
    console.error(error);
    process.exit(1);
})

module.exports = {
    url : MONGO_URI
}
