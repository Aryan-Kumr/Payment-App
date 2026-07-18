const mongoose = require ("mongoose");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
// mongoose.connect("mongodb+srv://<username>:<password>@cluster0.7qkjke1.mongodb.net/tablename") //YOUR CONNECTION URL
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });


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
