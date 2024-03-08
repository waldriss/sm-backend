import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  CommentPostRequest,
  CreatePostRequest,
  getHomePostsRequest,
  likeSharePostRequest,
} from "../types/post";
import { uploadPostImage } from "../storage/storage";

const prisma = new PrismaClient();

export const createPost = async (req: CreatePostRequest, res: Response) => {
  try {
    if (req.file != undefined) {
      const postimage = req.file;
      const imageUrl = await uploadPostImage(postimage);
      if (imageUrl) {
        const { caption, location, tags, userId } = req.body;

        const createdpost = await prisma.post.create({
          data: {
            caption: caption,
            location: location,
            tags: tags.split(","),
            posterId: parseInt(userId),
            postImage: imageUrl,
          },
        });
        return res.status(200).json({ message: "post created" });
      } else {
        return res.status(500).json({ message: "error uploading image" });
      }
    } else {
      return res.status(500).json({ message: "no image found" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req: CreatePostRequest, res: Response) => {
  try {
    const postId = parseInt(req?.params?.id);

    if (req.file != undefined) {
      const postimage = req.file;
      const imageUrl = await uploadPostImage(postimage);
      if (imageUrl) {
        const { caption, location, tags, userId } = req.body;

        const createdpost = await prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            caption: caption,
            location: location,
            tags: tags.split(","),
            postImage: imageUrl,
          },
        });

        return res.status(200).json({ message: "post updated" });
      } else {
        return res.status(500).json({ message: "error uploading image" });
      }
    } else {
      return res.status(500).json({ message: "no image found" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getHomePosts = async (req: getHomePostsRequest, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);
    const { page = "1" } = req.query;

    const offset = (parseInt(page) - 1) * 1;

    const posts = await prisma.post.findMany({
      take: +1,
      skip: +offset,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        poster: {
          select: {
            name: true,
            username: true,
          },
        },
      },
      /*where: {
        poster: {
          followedBy: {
            some: {
              followingId: userId,
            },
          },
        },
      },*/
    });

    return res.status(200).json({ posts: posts });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserPosts = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);

    const posts = await prisma.post.findMany({
      where: {
        poster: {
          id: userId,
        },
      },
    });
    return res.status(200).json({ posts: posts });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

const getLikedPosts = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);

    const posts = await prisma.post.findMany({
      where: {
        liked_posts: {
          some: {
            likerId: userId,
          },
        },
      },
    });
    return res.status(200).json({ posts: posts });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
const getSharedPosts = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req?.params?.id);

    const posts = await prisma.post.findMany({
      where: {
        shared_posts: {
          some: {
            sharerId: userId,
          },
        },
      },
    });
    return res.status(200).json({ posts: posts });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req?.params?.id);

    const post = await prisma.post.findMany({
      where: {
        id: postId,
      },
      include: {
        poster: {
          select: {
            name: true,
            username: true,
          },
        },
        liked_posts: {
          include: {
            liker: true,
          },
        },
        commented_posts:{
          include:{
            commenter:{select:{name:true,username:true,id:true}},
            
          }
        }
      },
    });
    console.log(post);
    return res.status(200).json({ post: post });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

const SharePost = async (req: likeSharePostRequest, res: Response) => {
  try {
    const { postId, userId } = req.body;

    const created_like = await prisma.share.create({
      data: {
        sharerId: userId,
        shared_postId: postId,
      },
    });
    return res.status(200).json({ message: "Post shared" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

/*

 const LikePost= async (req: likeSharePostRequest, res: Response) => {
  try {
    const {postId,userId} = req.body

    const created_like=await prisma.like.create({
      data:{
        likerId:userId,
        liked_postId:postId,
       notificationId:5

      }
    })
    return res.status(200).json({message:"Post liked"});
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


const CommentPost= async (req: CommentPostRequest, res: Response) => {
  try {
    const {postId,userId,body} = req.body

    const created_like=await prisma.comment.create({
      data:{
        commenterId:userId,
        commented_postId:postId,
       notificationId:5,
       body:body

      }
    })
    return res.status(200).json({message:"Post commented"});
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

*/
