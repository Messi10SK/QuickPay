const express = require('express');
const {authMid} = require("../middleware/authMid.middleware")
const {Account} = require('../models/account.model')
const {default:mongoose} = require('mongoose')

const router = express.Router();

router.get('/balance',authMid, async (req,res)=>{
    const account = await Account.findOne({
        userId :req.userId
    });

    res.json({
        balance:account.balance
    })

});///////////


router.post('/transfer', authMid, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;
    console.log("Transfer request received:", req.body);

    try {
        // Fetch the accounts within the transaction
        const account = await Account.findOne({ userId: req.userId }).session(session);
        console.log("Fetched account for user:", req.userId, account);

        // Convert amount to a number if it's not already
        const transferAmount = Number(amount);
        console.log("Transfer amount:", transferAmount);

        // Check if account exists and has sufficient balance
        if (!account) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Account not found"
            });
        }

        console.log("Account balance:", account.balance);

        if (account.balance < transferAmount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        console.log("Fetched recipient account:", toAccount);

        // Check if recipient account exists
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid account"
            });
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -transferAmount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: transferAmount } }).session(session);

        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Transfer error:", error);
        res.status(500).json({
            message: "Transfer failed",
            error: error.message,
        });
    } finally {
        session.endSession();
    }
});

module.exports = router;