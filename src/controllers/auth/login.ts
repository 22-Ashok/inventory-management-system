import dotenv from "dotenv";
dotenv.config();
import type {Request, Response, NextFunction} from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/appError";

export async function login(req:Request, res:Response, next:NextFunction) {
    try{
      const {email, password} = req.body;
      console.log(email);

      // when user sends the email and password -> validate the email and password -> check the flag -> force to generate the new password -> store into db -> send the jwt
      const user = await prisma.user.findUnique({
        where:{
          email,
        }
      }); 

      if(!user){
        throw new ApiError(400, "user not found")
      }
      
      console.log("user password:", user.password)
      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch){
         throw new ApiError(400, "Invalid credentials");
      }

      if(!user.is_password_set){
          // make the call for generate the new password
          const restrictedToken = jwt.sign({userId: user.id, intent: 'PASSWORD_SETUP'}, process.env.JWT_SECRET_KEY as string, {expiresIn:"60m"});
          return res.status(201).json({
            action: "REQUIRE_PASSWORD_CHANGE",
            intent: 'PASSWORD_SETUP',
            message: "Temporary password accepted. Please set a permanent password.",
            token: restrictedToken,
            email: user.email
          })
      }

      // generate the final token
      const token = jwt.sign({userId: user.id, role:user.role}, process.env.JWT_SECRET_KEY as string, {expiresIn:"7d"});
      return res.status(200).json({
        status:"success",
        message:"Login successful",
        token:token,
        user:{
          id:user.id,
          f_name:user.f_name,
          l_name:user.l_name, 
          email:user.email,
          contact:user.contact,
          role:user.role,
          lastActive:user.lastActive
        }
      })
    }

    catch(error){
        next(error);
    }
}