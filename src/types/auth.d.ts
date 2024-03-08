import { Request } from "express";

export interface RegisterRequest extends Request {
    body: {
        email: string;
        name: string;
        username:string;
        password:string;
    };
}


export interface SignInRequest extends Request {
    body: {
        email: string;
        name: string;
        username:string;
    };
}


