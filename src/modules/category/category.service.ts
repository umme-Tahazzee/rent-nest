import { prisma } from "../../lib/prisma"
import { Icategory } from "./category.interface"

const createCategoryFromDb = async (payload: Icategory) => {
    const isExist = await prisma.category.findUnique({
        where: { name: payload.name },
    });
    if (isExist) throw new Error("Category with this name already exists")

    const result = await prisma.category.create({ data: payload });
    return result;
}


const getAllCategoriesFromDb = async () => {

    const result = await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return result

}

const getSingleCategoryFromDb = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })
    if (!category) {
        throw new Error("Category not found");
    }

    return category

}


export const categoryService = {
    createCategoryFromDb,
    getAllCategoriesFromDb,
    getSingleCategoryFromDb
}