const ApiError = require('../error/ApiError');

const errorHandler = (err, req, res, next) => {

    const { message, status} = err;

        if(message === 'account error'){
            res.status(status).json({
                success: false,
                error: 'account doesnot exist'
            })
        }

        if(message === 'existant email error'){
            res.status(status).json({
                success: false,
                error: 'email exists already'
            })
        }

        if(message === 'name error'){
            res.status(status).json({
                success: false,
                error: 'name should be longer than 4 letters'
            })
        }

        
        if(message === 'invalid email error'){
            res.status(status).json({
                success: false,
                error: 'insert a valid email'
            })
        }


        if(message === 'invalid password error'){
            res.status(status).json({
                success: false,
                error: 'password should be longer than 8 characteres'
            })
        }

        if(message === 'wrong password error') {
            res.status(status).json({
                success: false,
                error: 'password is incorrect'
            })
        }

        if(message === 'invalid token') {
            res.status(status).json({
                success: false,
                error: 'you should login'
            })
        }





}

module.exports = errorHandler;
