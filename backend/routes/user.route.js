const express = require('express');
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken");
const zod = require("zod");
const router = express.Router();
const {User} = require('../models/user.model')
const {Account} = require("../models/account.model")
const {authMid} = require("../middleware/authMid.middleware")


dotenv.config();
const jwtsecret = process.env.JWT_SECRET;

const signupBody = zod.object({
    username: zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string()
});

router.post('/signup',async (req,res) =>{
    const {success} = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username :req.body.username,
    })


    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1+Math.random() *10000
    })

    const token = jwt.sign({
        userId
    },jwtsecret);

    res.json({
        message: "User created successfully",
        token: token
    })


});//////


const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})



router.post('/signin',async(req,res)=>{
const {success} = signinBody.safeParse(req.body)
if (!success) {
    return res.status(411).json({
        message: "Email already taken / Incorrect inputs"
    })
}

const user = await User.findOne({
    username:req.body.username,
    password:req.body.password
});


if(user){
    const token = jwt.sign({
        userId :user._id
    },jwtsecret);

    res.json({
        token :token
    })
    return
}

res.status(411).json({
    message: "Error while logging in"
})


}) ///////////////


const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})


router.put("/updatebody",authMid,async(req,res)=>{
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})///////////////


router.get("/bulk",authMid,async(req,res)=>{
const filter = req.query.filter || "";
// This retrieves the filter query parameter from the request URL.
// If filter is not provided, it defaults to an empty string ("").
const users = await User.find({
    $or:[{
        firstName:{
            $regex: filter,   
        }
    },{
        lastName:{
            $regex: filter,
        }
    }]
}) // searcghes for filter = john in firstname or lastname

res.json({
    user: users.map(user => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id
    }))
})

})/////////

router.get("/getUser", authMid, async (req, res) => {
    const user = await User.findOne({
      _id: req.userId,
    });
    res.json(user);
  });




module.exports = router;