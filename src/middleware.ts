import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = (req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers.token;
    const decoded = jwt.verify(token as string, JWT_PASSWORD);

    if(decoded){
        // @ts-ignore
        req.userId = decoded.id;
        next()
    }
    else{
        res.status(403).json({
            message:"You're not signed in"
        })
    }
} 