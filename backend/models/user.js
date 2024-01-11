const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
    }
    ,
    phoneOTP: String,

},
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);