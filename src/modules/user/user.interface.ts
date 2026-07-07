import { Role } from "../../../generated/prisma/enums"

export interface RegisterInterfacePayload {
      name: string
      email: string
      password: string
      role?:Role
    
}