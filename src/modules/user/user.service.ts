import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { RegisterInterfacePayload } from "./user.interface"
import config from "../../config"
import { Role } from "../../../generated/prisma/enums"

const registerUserIntoDb = async (payload: RegisterInterfacePayload) => {
    const { name, email, password, role } = payload

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExist) {
        throw new Error("User already exists")
    }

    const normalizedRole = role
        ? (role.toUpperCase() as Role)
        : Role.TENANT

    if (!Object.values(Role).includes(normalizedRole)) {
        throw new Error("Invalid role provided")
    }

    if (normalizedRole === Role.ADMIN ) {
        throw new Error("You cannot register as an ADMIN")
    }

    const hashedPassword = await bcrypt.hash(
        password, Number(config.bcrypt_salt_rounds)
    )

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: normalizedRole,   // ekhane already-normalized value jacche
        },
        omit: {
            password: true
        }
    })

    return createdUser
}


const getMyProfileFromDb = async (userId: string) => {
    const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        omit: { password: true },
    })

    if (!userProfile) {
        throw new Error("User is not exist")
    }

    return userProfile;
}


export const userService = {
    registerUserIntoDb,
    getMyProfileFromDb
}