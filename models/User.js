const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add a name'],
        minlength: 4,
    },
    email: {
        type: String,
        required: [true, 'please add an email'],
        unique: [true, 'this email exists'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'please add password'],
        minlength: 8,
        select: false
    }
});

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

userSchema.methods.verifyPassword = async function verifyPassword(password){
    return await bcrypt.compare(password, this.password);
}



module.exports = mongoose.model('User', userSchema) 