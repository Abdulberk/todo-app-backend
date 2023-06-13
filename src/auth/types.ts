import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";


export interface User {
    _id: string;
    username: string;
    email: string;
  }
  
  
  
  declare global {
    namespace Express {
      interface Request {
        user?: {
          id: string;
        };
  
      }
    }
  }
  

  
  export interface DecodedUser extends JwtPayload {
      id: string;
      iat?: number;
      exp?: number;
  }
  
  export interface ITokenRes extends Response {
    message?: string;
    status: (statusCode: number) => {
      json: (data: any) => ITokenRes;
    };
  
  }
  
  export interface ITokenReq extends Request {
    headers: {
      authorization?: string;
    },
    user?: DecodedUser,
  
  }