import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import {} from '../../environment'
import { User } from "./types";




const generateToken = async (user: User): Promise<string> => {

   
  const payload: JwtPayload = {
    id: user._id,
    username: user.username,
    email: user.email,

  };


  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN,
  };


  const generatedToken: string = jwt.sign(payload, process.env.JWT_SECRET,  options);


  return generatedToken;
};

export default generateToken;
