import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
export const authMiddleware: RequestHandler = (req, res, next) => {
  const jwtToken = req.headers.authorization?.split(' ')[1];
  if (!jwtToken) {
    return res.sendStatus(401);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET enviroment variable must be defined');
  }

  const payload = jwt.verify(
    jwtToken,
    process.env.JWT_SECRET,
  ) as jwt.JwtPayload;

  res.locals.email = payload.email;
  next();
};
