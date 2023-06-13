const asyncHandler = require('express-async-handler');
import { Request, RequestHandler, Response } from "express";
import UserModel from "../models/User";
import generateToken from "../auth/generateToken";
const bcrypt = require('bcrypt');


interface IUserReq extends Request {
    body: {
        username: string;
        email: string;
        password: string;
    },
    user?: {
        id: string | undefined;
    }
}

interface IUserRes extends Response {
    message?: string;
    status: (statusCode: number) => {
        json: (data: any) => IUserRes;
    };

}

interface ILoginReq extends Request {
    body: {
        email: string;
        password: string;
    }
}

interface ILoginRes extends Response {
    message?: string;
    status: (statusCode: number) => {
        json: (data: any) => ILoginRes;
    };

}




const register:RequestHandler = asyncHandler(async (req: IUserReq, res: IUserRes) => {

    const {username, email, password} = req.body;
    const user = await UserModel.findOne({email})
    if(user){
        return res.status(400).json({message: "Bu email adresi zaten kullanımda"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
        username,
        email,
        password: hashedPass

    })

    await newUser.save();

  


    const token = await generateToken({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      });

        return res.status(200).json({
            user: newUser,
            token
        });





});



const login: RequestHandler = asyncHandler(async (req: ILoginReq, res: ILoginRes) => {

    try {
        const {email,password} = req.body;
    

    
       
    
        const user = await UserModel.findOne({email});


        if (!user) return res.status(404).json({message: 'bu email adresi bulunamadı'});
    
        const checkPassword = await bcrypt.compare(password, user.password);
    
        if (!checkPassword) return res.status(400).json({message: 'lütfen şifrenizi kontrol edin'});
    
    
        const newToken = await generateToken(user);
    
    
        return res.status(200).json({
            message: 'giriş başarılı',
            token :  newToken
        })
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'sunucuda bir hata oluştu, giriş yapılamadı'});
        
    }


}
);


const logout: RequestHandler = asyncHandler(async (req: Request, res: ILoginRes) => {


    return res.status(200).json({
        message: 'çıkış yapıldı'
    })

});



const getProfile: RequestHandler = asyncHandler(async (req:IUserReq, res: IUserRes) => {

    
try {
    
        const user = await UserModel.findOne({
            _id:req.user?.id
        })
    
        if(!user) return res.status(404).json({message: 'kullanıcı bulunamadı'});
    
        return res.status(200).json({
            user
    
        })
    
} catch (error) {

    return res.status(500).json({message: 'sunucuda bir hata oluştu, profil bilgileri getirilemedi'});
}


})

module.exports = { register, login, logout, getProfile };
