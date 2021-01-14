const User = require('../models/User');
const jwt = require('jsonwebtoken');

const ApiError = require('../error/ApiError')

exports.createUser = async (req, res, next) => {
    const pattern = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
    const { name, email, password } = req.body;

    let user = await User.findOne({ email: email }) 

    if(user){
        return(
            next( new ApiError('existant email error', 400) )
            )
    }

    if(name.length < 4){
        return(
            next( new ApiError('name error', 400) )
            )
    }

    if(!pattern.test(email) ){
        return(
            next( new ApiError('invalid email error', 400) )
            )
    }

    if(password.length < 8) {
        return(
            next( new ApiError('invalid password error', 400) )
            )
    }

    user = await User.create({
        name: name,
        email: email,
        password: password
    })

    const payload = {
        name: user.name,
        email: user.email
    }

    const token = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY || "private key");

    res.status(201).json({
        success: true,
        data: {
            user: {
                name: user.name,
                email: user.email
            },
            token: token
        },
    });

}


exports.deleteAccount = async (req, res, next) => {
    const { email, password ,token } = req.body;

    try {
        await jwt.verify(token, process.env.JWT_PRIVATE_KEY || "private key");
    } catch (error) {
        
        return(
            next( new ApiError('invalid token', 400))
        )

    }

    let user = await User.findOne({ email: email }).select('name email password');

    if(!user) {
        return(
            next( new ApiError('account error', 404))
        )
    }

    const result = await user.verifyPassword(password);

    if(!result) {
        return(
            next(new ApiError('wrong password error', 400))
        );
    }

    user = await User.deleteOne({ email: email });

    res.status(200).json({
        success: true,
        data:{}
    })
    
}

exports.modifieUser = async (req, res, next) => {
    const { name, email, password, token } = req.body;
    const { newName, newEmail, newPassword } = req.body;

    const pattern = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

    try {
        await jwt.verify(token, process.env.JWT_PRIVATE_KEY || "private key", { expiresIn: process.env.JWT_EXPIRATION_TIME || "10m" });
    } catch (error) {
        return(
            next( new ApiError('invalid token', 400))
        )
    }

    let user = await User.findOne({ email: email }).select('name email password');

    if(!user) {
        return(
            next( new ApiError('account error', 404))
        )
    }

    const result = await user.verifyPassword(password);

    if(!result) {
        return(
            next(new ApiError('wrong password error', 400))
        );
    }

    if(newName && newName.length < 4){
        return(
            next( new ApiError('name error', 400) )
            )
    }

    if(newEmail && !pattern.test(newEmail) ){
        return(
            next( new ApiError('invalid email error', 400) )
            )
    }

    const existUser = await User.findOne({ email: newEmail });
    if(existUser && email !== newEmail){
        return(
            next( new ApiError('existant email error', 400) )
            )
    }

    if(newPassword && newPassword.length < 8) {
        return(
            next( new ApiError('invalid password error', 400) )
            )
    }


    user = await User.updateOne(
        { email: email },
        {
            name: newName || user.name,
            email: newEmail ||  user.email,
            password: newPassword || user.password 
        })
    
    res.status(201).json({
        success: true,
        data: {
            user:{
                name: user.name,
                email: user.email
            }
        }
    })




}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('name email password');

    if(!user) {
        return(
            next(new ApiError('account error', 400))
        );
    }

    const result = await user.verifyPassword(password);

    if(!result) {
        return(
            next(new ApiError('wrong password error', 400))
        );
    }

    const payload = {
        name: user.name,
        email: user.email
    }
    console.log(payload);
    const token = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY || "private key");

    res.status(200).json({
        success: true,
        data: {
            name: user.name,
            email: user.email
        },
        token: token
    })

}

exports.logout = (req, res) => {
    
}

