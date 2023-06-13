import { Request, Response, NextFunction } from 'express';
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
import { VerifyErrors } from 'jsonwebtoken';
import { DecodedUser, ITokenReq, ITokenRes } from './types';








const verifyToken = asyncHandler(async (req: ITokenReq, res: ITokenRes, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'token bulunamadı' });

    jwt.verify(token, process.env.JWT_SECRET, (error: VerifyErrors | null, decodedUser: DecodedUser) => {
      if (error) throw error;

      req.user = decodedUser;


      next();
    });
  } catch (err: any) {
    switch (true) {
      case err instanceof jwt.TokenExpiredError:
        return res.status(401).json({ message: 'tokenin süresi dolmuş !' });
      case err instanceof jwt.JsonWebTokenError:
        return res.status(403).json({ message: 'token geçersiz !' });
      default:
        return res.status(500).json({ message: err.message as string || 'token doğrulanırken bilinmeyen bir hata oluştu !' });
    }
  }
});

export default verifyToken;
