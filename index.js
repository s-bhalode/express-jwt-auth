const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config({path : './.env'});
const userRoutes = require('./routes/user.routes');
require('./config/db.config');


const port = process.env.PORT || 3005;
app.use(userRoutes);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})