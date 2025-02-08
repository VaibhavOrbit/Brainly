import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = (req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers.token;
    const decoded = jwt.verify(token as string, JWT_PASSWORD);

    if(decoded){

        if(typeof decoded === "string"){
            res.status(403).json({
                message:"You're not logged in"
            })
            return;
        }
       
        req.userId = (decoded as JwtPayload ).id;
        next()
    } 
    else{

        res.status(403).json({
            message:"You're not logged in"
        })
    }
} 