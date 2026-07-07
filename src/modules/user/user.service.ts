import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { RegisterInterfacePayload } from "./user.interface"
import config from "../../config"

const registerUserIntoDb = async(payload: RegisterInterfacePayload) => {
   const  {name, email, password, status} = payload
    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
       throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(
        password, Number(config.bcrypt_salt_rounds)
    )


    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
           
        }
    })
    
    
    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email
        },
        omit: {
            password: true
        },
        
    })

    return user
}

export const userService = {
      registerUserIntoDb
}