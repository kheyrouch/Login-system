const express = require("express");
const morgan = require('morgan')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const userRouter = require('./routers/user');
const apiErrorHandler = require('./middleware/errorHandler');
// Load env variables
dotenv.config({ path: `${__dirname}/config/config.env`})
const PORT = process.env.PORT || 4000;

// create express app
const app = express();

// configure body-paser
app.use(bodyParser.json())

// logging request info
app.use(morgan('dev'));

// loading Routes
app.use(userRouter);

// Loading errorHandler middleware
app.use(apiErrorHandler);

// connect to the database
mongoose.connect(`${process.env.MONGODB_URI}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true

},(err)=>{
    if(err){
        console.error(err)
    } else {
        //Lunching the server
        app.listen(PORT, function (){
            console.log(`app listening on port ${PORT}`);
        })
    }
} )
