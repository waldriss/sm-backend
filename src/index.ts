// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Clerk } from "@clerk/clerk-sdk-node";

const cors = require('cors');
const path= require('path');
const routes=require('../routes')
export const customclerkClient = Clerk({ secretKey:process.env.CLERK_SECRET_KEY});

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors({credentials:true}));

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use('/',routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});