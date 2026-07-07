import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { catchAsync } from "../modules/utils/catchAsync";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { jwtUtils } from "../modules/utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
        role: Role;
        status?:UserStatus
      };
    }
  }
}


export const auth = (...requireRole: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies.accessToken ? 
      req.cookies.accessToken:
      req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization?.split(" ")[1]
      : req.headers.authorization 

    if (!token) {
      throw new Error("You are not loged out");
    }

    const verifyToken = jwtUtils.verifyToken(token, 
      config.jwt_access_secret);
    
     
    if (!verifyToken.success) {
      throw new Error(verifyToken.error);
    }

    const { id, email, role } = verifyToken.data as JwtPayload;
   
    if (requireRole.length && !requireRole.includes(role)) {
      throw new Error(
        "Forbiden you dont have permission to acess this resource",
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        role,
      },
    });

    if (!user) {
      throw new Error("user not found");
    }

    
    req.user = {
      id,
      email,
      role,
    };

    
    next()
  });
};