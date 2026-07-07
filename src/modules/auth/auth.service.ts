import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { IloginUser } from "./auth.interface"

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

    return user
    
    
}
export const authService = {
     loginUser
}