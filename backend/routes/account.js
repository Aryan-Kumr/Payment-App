const express = require("express");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require('mongoose');
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })
    res.json({
        balance: account.balance
    })
})

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession()

    session.startTransaction()

    const toUser = req.body.toUser
    const amount = req.body.amount

    const account = await Account.findOne({
        userId: req.userId  
    }).session(session)

    if(!account || account.balance < amount) {
        await session.abortTransaction()
        res.status(400).json({
            message: "Balance is insuficient"
        })
    }
    const toAccount = await Account.findOne({
        userId: toUser
    }).session(session)

    if(!toAccount) {
        await session.abortTransaction()
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    //performing money transfer
    await Account.updateOne({userId: req.userId }, { $inc: {balance: -amount } }).session(session)
    await Account.updateOne({userId: toUser }, { $inc: {balance: amount } }).session(session)

    //commit the transactions

    await session.commitTransaction();
    session.endSession();

    res.json({
        message: "Transfer successful"
    })
})



module.exports = router