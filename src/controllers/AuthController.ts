import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { RegisterRequest, SignInRequest } from "../types/auth";
import { customclerkClient } from "..";


const prisma = new PrismaClient();

export const registerUser = async (req: RegisterRequest, res: Response) => {
  try {
    const { email, name, username,password} = req.body;

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (user) {
      
      
      return res.status(401).json({ message: "user already exist" });
    } else {
      const createduser = await prisma.user.create({
        data: { name: name, username: username, email: email },
      });
      
      const clerkCreatedUser=await customclerkClient.users.createUser({
        externalId:createduser.id.toString(),
        emailAddress: [email],
        password: password,
        username: username,
        firstName: name,
      });
     
     
      return res.status(200).json({ message: "user created" });

      
    }
  } catch (err: any) {
    console.log(err);
    
    return res.status(500).json({ message: err.message });
  }
};




export const signInUser = async (req: SignInRequest, res: Response) => {
  try {
    const { email, name, username} = req.body;

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (user) {
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: {
          name: name,
          username: username,
        },
      });

      return res.status(200).json({ message: "user updated" });
    } else {
      const createduser = await prisma.user.create({
        data: { name: name, username: username, email: email },
      });
      return res.status(200).json({ message: "user created" });

      
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
