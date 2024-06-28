const express = require('express')
const userRouter = require("./user.route")
const accountRouter = require('./account.route')
const router = express.Router();


router.use("/user", userRouter);
router.use("/account",accountRouter)
module.exports = router;