import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { dataToUpdateInterface, followRequest, updateUserRequest } from "../types/user";
import { uploadProfileImage } from "../storage/storage";

const prisma = new PrismaClient();

export const updateUser = async (req: updateUserRequest, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);

    const { name, username, bio} = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const dataToUpdate: dataToUpdateInterface = {};
      if (name != undefined) {
        dataToUpdate.name = name;
      }
      if (username != undefined) {
        dataToUpdate.username = username;
      }
    
      if (bio != undefined) {
        dataToUpdate.bio = bio;
      }
      if (req.file != undefined) {
        const userImage = req.file;
        const imageUrl = await uploadProfileImage(userImage);
        dataToUpdate.userImage=imageUrl;

      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      return res.status(200).json({ message: "user updated",updatedUser:updatedUser });
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      return res.status(200).json({ user: user });
    } else {
      return res.status(404).json({ message: "user not found" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getFollowedBy = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);

    const users = await prisma.user.findMany({
      where: {
        following: {
          some:{
            state:"accepted",
            followedById:userId
          }
        },
      },
    });
    return res.status(200).json({ users: users });

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getFollowings = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);

    const users = await prisma.user.findMany({
      where: {
        followedBy: {
          some:{
            state:"accepted",
            followingId:userId
          }
        },
      },
    });

    return res.status(200).json({ users: users });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};



export const getPendingFollowers = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);

    const users = await prisma.user.findMany({
      where: {
        following: {
          some:{
            state:"pending",
            followedById:userId
          }
        },
      },
    });

    return res.status(200).json({ users: users });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};



export const follow = async (req: followRequest, res: Response) => {
  try {
    const {followerId,followedId}=req.body

    const created_follow_request=prisma.followRequest.create({
      data:{
        followingId:followerId,
        followedById:followedId,
        notificationId:5
      }
    })

   

    return res.status(200).json({message:"follow request sent" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


export const acceptFollow = async (req: followRequest, res: Response) => {
  try {
    const {followerId,followedId}=req.body

    const follow_request=prisma.followRequest.updateMany({
      where:{
        followingId:followerId,
        followedById:followedId
      },
      data:{
        state:"accepted"
      }
    })

   

    return res.status(200).json({message:"follow accepted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


export const declineFollow = async (req: followRequest, res: Response) => {
  try {
    const {followerId,followedId}=req.body

    const follow_request=prisma.followRequest.updateMany({
      where:{
        followingId:followerId,
        followedById:followedId
      },
      data:{
        state:"declined"
      }
    })

   

    return res.status(200).json({message:"follow declined" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};



export const deletefollow = async (req: followRequest, res: Response) => {
  try {
    const {followerId,followedId}=req.body

    const follow_request=prisma.followRequest.deleteMany({
      where:{
        followingId:followerId,
        followedById:followedId
      }
    })

   

    return res.status(200).json({message:"follow deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};