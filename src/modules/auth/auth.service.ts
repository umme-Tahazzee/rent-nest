import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { IloginUser } from "./auth.interface"
import jwt, { SignOptions } from "jsonwebtoken"
import config from "../../config"
import { jwtUtils } from "../utils/jwt"


const loginUser = async(payload : IloginUser) =>{

    const {email, password} = payload
    
    const user = await prisma.user.findFirstOrThrow({
         where : {
             email
         }
    })

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if(!isPasswordMatch){
         throw new Error("Password is incorrect")
    }

    const jwtPayload = {
         user : user.id,
         name : user.name,
         email : user.email,
         role : user.role ,
         status : user.status
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload, 
        config.jwt_access_secret, 
        config.jwt_access_expires_in as SignOptions)


    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    )
    

    return {
        accessToken, refreshToken
    }
    
    
}
export const authService = {
     loginUser
}