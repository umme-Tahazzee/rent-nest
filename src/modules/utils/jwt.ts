import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"

const createToken = (
    payload: JwtPayload,
    secret: string,
    expiresIn: SignOptions
) => {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

const verifyToken = (token: string, secret: string) => {
    try {
        const verifyToken = jwt.verify(token, secret) as JwtPayload
        return {
            success: true,
            data: verifyToken
        }
    } catch (error: any) {

        return {
            success: false,
            error: error.message
        }

    }
}

export const jwtUtils = {
    createToken,
    verifyToken
}