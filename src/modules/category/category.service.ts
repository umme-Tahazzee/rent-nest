import { prisma } from "../../lib/prisma"
import { Icategory } from "./category.interface"

const createCategoryFromDb = async(payload:Icategory)=>{
       const isExist = await prisma.category.findUnique({
          where: { name: payload.name },
     });
     if(isExist) throw new Error("Category with this name already exists")

      const result = await prisma.category.create({ data: payload });
     return result;
}

export const categoryService = {
    createCategoryFromDb
}