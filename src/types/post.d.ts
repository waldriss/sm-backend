import { Request } from "express";
import { IFile } from "./globalTypes";

export interface likeSharePostRequest extends Request {
  body: {
    postId:number;
    userId:number;
  };
}

export interface CommentPostRequest extends Request {
    body: {
      postId:number;
      userId:number;
      body:string;
    };
  }
  


  export interface CreatePostRequest extends Request {
    body: {
      userId: string;
      caption: string;
      tags: string;
      location: string;
    };
  }
  

  export interface getHomePostsRequest extends Request {
    query:{
      page?:string;
    }


  }