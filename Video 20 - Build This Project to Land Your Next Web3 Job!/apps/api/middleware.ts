import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try{
        //  const token = req.headers['authorization'];
        // if (!token ) {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }

        // const decoded = jwt.verify(token, JWT_PUBLIC_KEY);
        // console.log(decoded);
        // if (!decoded || !decoded.sub) {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }

        //req.userId = decoded.sub as string;

        req.userId = "hello123";
        
    next();
    }
    catch(e){
        console.log("no , ", e);
    }
}