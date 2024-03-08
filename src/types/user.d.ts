import { Request } from "express";

export interface updateUserRequest extends Request {
  body: {
    name?: string;
    username?: string;
    bio?: string;
  };
}


export interface dataToUpdateInterface {
  name?: string;
  username?: string;
  userImage?: string;
  bio?: string;
}


export interface followRequest extends Request {
  body: {
   followerId:number;
   followedId:number;
  };
}
