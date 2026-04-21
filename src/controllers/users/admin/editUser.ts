import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../../../utils/appError";
import { prisma } from "../../../lib/prisma";
import type { EditUserBodyType, EditUserParamType } from "../../../schemas/editUserSchema";

export async function editUser(
    req:Request,
    res:Response, 
    next:NextFunction) {

    try{
       // get the role and id from the global request object
       const user = req.user;

       if(!user){
         throw new ApiError(401, "Unauthorized. Please log in.");
       }

       // checks the role of the user
       if(user.role !== "ADMIN"){
            throw new ApiError(403, "Access denied. Admins only.");
       }

       const body = req.body as unknown as EditUserBodyType;
       const params = req.params as unknown as EditUserParamType;

       const cleanedData = Object.fromEntries(Object.entries(body).filter(([_, value]) => value !== undefined));

       // finding user by their id and update the user details
       const updateUser = await prisma.user.update({
         where: { id: params.id },
         data: cleanedData,
       });

       res.status(200).json({
            status:true,
            message:"User updated successfully",
            error:null
       })
    }

    catch(error) {
        next(error);
    }
}