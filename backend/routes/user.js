const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const { User, Account } = require("../db");
const userRouter = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string().min(3)
})

userRouter.post("/signup", async (req,res) => {
    const createPayload = req.body;
    const parsedPayload = signupSchema.safeParse(createPayload);
    if(!parsedPayload){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        username: createPayload.username
    })
    if(existingUser){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const user = await User.create({
        username: createPayload.username,
        firstname: createPayload.firstname,
        lastname: createPayload.lastname,
        password: createPayload.password
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })
    
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "user created successfully",
        token: token
    })
})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

userRouter.post("/signin", async(req, res) => {
    const createPayload = req.body;
    const updatePayload = signinSchema.safeParse(createPayload);
    if(!updatePayload){
        return res.status(411).json({
            message: "incorrect inputs"
        })
    }
    const user = await User.findOne({   
        username: createPayload.username,
        password: createPayload.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
            
        }, JWT_SECRET)

        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateUser = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
})

userRouter.put("/", authMiddleware, async(req, res) => {
    const updateBody = req.body;
    const { success } = updateUser.safeParse(updateBody);
    if(!success) {
        return res.status(411).json({
            message: "error while updating information"
        })
    }
    // upadting the user according to parameters passed based on id
    
    await User.updateOne({_id: req.userId}, req.body) 

        return res.status(200).json({
            message: "Updated successfully"
    })
})


userRouter.get("/bulk", async (req, res) => {
    var filter = req.query.filter || "";   //either user sends firstname or lastname as query parameter or nothing i.e empty

    const users = await User.find({
    $or: [
        {
        firstname: {
            $regex: filter,
        },
        
        },
        {
        lastname: {
            $regex: filter,
        }
        }
    ]
})
res.json({
    user: users.map((user) => ({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        _id: user._id
    }))
})

})


module.exports = userRouter;