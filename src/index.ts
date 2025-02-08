import express from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
const app = express();
import { ContentModel, UserModel } from './db';
import { userMiddleware } from "./middleware";

app.use(express.json());

app.post("/api/user/signup", async (req, res) => {
    const { username, password, email } = req.body;

    try {
        await UserModel.create({
            username:username,
            password:password,
            email:email
        });

        res.json({
            message: "User signed up"
        })

    } 
    catch (e) {
        res.status(411).json({
            message: "User already exists"
        });
    }
})


app.post("/api/user/signin", async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    })

    if(existingUser){
        const token = jwt.sign({
            id:existingUser.id
        }, JWT_PASSWORD)

        res.json({
            token
        })
    }

    else{
        res.status(403).json({
            message:"incorrect credentials"
        })
    }
})


app.post("/api/user/content",userMiddleware, async(req, res)=>{
    const {title, link} = req.body;

    ContentModel.create({
        title,
        link,
        // @ts-ignore
        userId:req.userId,
        tags:[]
    });

    res.json({
        message:"content added"
    })

})


app.get("/api/user/my/content", userMiddleware,async(req, res)=>{
        // @ts-ignore
        const userId = req.userId;
        const content = await ContentModel.find({
            userId:userId
        }).populate("userId", "username")

        res.json({
            content
        })

})


app.delete("/api/user/content/delete", userMiddleware, async(req, res)=>{
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        // @ts-ignore
        userId: req.userId
    })

    res.json({
        message: "Deleted"
    })

})




app.listen(2000, () => console.log("Server Started on port 2000"));
