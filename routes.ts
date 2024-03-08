import { Router } from "express";
import { registerUser, signInUser } from "./src/controllers/AuthController";
import { getUser, updateUser } from "./src/controllers/UserController";
import { upload } from "./src/storage/storage";
import { createPost, getHomePosts, getPost, updatePost } from "./src/controllers/PostController";


const express= require('express');


const routes:Router=express.Router();
routes.post("/upload",)
//--------------------User/auth routes-----------------------
routes.post("/register",registerUser);
routes.post("/signin",signInUser);
routes.get("/user/:id",getUser);

routes.post("/user/:id",upload.single('file'),updateUser);

//--------------------User/auth routes-----------------------



//--------------------     Post routes-----------------------

routes.post("/createpost",upload.single('file'),createPost);
routes.post("/updatepost/:id",upload.single('file'),updatePost)
routes.get("/homePosts/:id",getHomePosts);
routes.get("/getPost/:id",getPost)


//--------------------     Post routes-----------------------


module.exports = routes;