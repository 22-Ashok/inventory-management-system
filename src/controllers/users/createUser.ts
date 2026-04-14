import type {Request, Response, NextFunction} from "express";
import { prisma } from "../../lib/prisma";
import {generate} from "generate-password";
import bcrypt from "bcrypt"
import { sendStaffPasswordEmail } from "../../services/mail";
import { ApiError } from "../../utils/appError";

export async function createUser(req:Request, res:Response, next:NextFunction) {
    try{
        // 1st need to checks the user is admin or not
        const user = req.user;
        
        if(!user || user.role !== "ADMIN"){
            throw new ApiError(403, "Access denied. Admins only.");
        }

        // take input -> validate -> create user -> send the password to user email -> response 
        const{f_name, l_name, email, contact, role} = req.body;

        // generate the password
        const password = generate({
            length:8,
            numbers:true,
            symbols:true,
            uppercase:true,
            lowercase:true,
        });
        
        // hashing the password 
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data:{
                f_name,
                email,
                contact,
                role,
                password:hashedPassword,
                l_name : l_name ?? null
            }
        })

       // send the password to user email
       const response = await sendStaffPasswordEmail(email, password);
       console.log(response);
       
        res.status(201).json({
            status:"success",
            message:"User created successfully"
        })
    }

    catch(error){
        next(error);
    }
}