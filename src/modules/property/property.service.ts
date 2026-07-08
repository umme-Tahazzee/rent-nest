import { prisma } from "../../lib/prisma"
import { ICreateProperty } from "./property.interface"

const createPropertyIntoDb = async (landlordId: string, payload: any) => {
  
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new Error( "Invalid category ID");
  }


  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
    include: {
      category: true,
      landlord: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return result;
};


export const propertyService = {
     createPropertyIntoDb
}