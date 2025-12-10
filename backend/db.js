const mongoose = require ("mongoose");

mongoose.connect("mongodb+srv://admin:NQTmongodb.net/paytm") //YOUR CONNECTION URL


const userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    password: String,

})


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,    // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type : Number,
        required: true
    }
}) 

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    Account
}
