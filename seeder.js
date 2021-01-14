const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// configure dotenv
dotenv.config({ path: `${__dirname}/config/config.env`});

// connect to the database
mongoose.connect(`${process.env.MONGODB_URI}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err)=>{
    if(err){
        console.error(err)
        process.exit(1)
    }
} )

const importData =  async (documents)=> {
    await User.create(documents)
}

//Load models
const User = require("./models/User");

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`)
)


if(process.argv[2] = '-i'){
    console.log(users);
    importData(users);
}

if(process.argv[2] = '-d'){
    // await User.deleteMany();
}

process.exit();



