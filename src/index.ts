
declare global{
    namespace Express{
        export interface Request {
            userId?:string;
        }
    }
}


import express from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
const app = express();
import { ContentModel, LinkModel, UserModel } from './db';
import { userMiddleware } from "./middleware";
import { random } from "./utlis";

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
      
        userId:req.userId,
        tags:[]
    });

    res.json({
        message:"content added"
    })

})


app.get("/api/user/my/content", userMiddleware,async(req, res)=>{
      
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
  
        userId: req.userId
    })

    res.json({
        message: "Deleted"
    })

})


app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
            const existingLink = await LinkModel.findOne({
                userId: req.userId
            });

            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            const hash = random(10);
            await LinkModel.create({
                userId: req.userId,
                hash: hash
            })

            res.json({
                hash
            })
    } else {
        await LinkModel.deleteOne({
            userId: req.userId
        });

        res.json({
            message: "Removed link"
        })
    }
})
// Important

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    })

    console.log(link);
    const user = await UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })

})


app.listen(2000, () => console.log("Server Started"));
