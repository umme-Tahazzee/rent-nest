import { Prisma, Role } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma"
import { ICreateProperty, TPaginationOptions, TPropertyFilterRequest } from "./property.interface"

const createPropertyIntoDb = async (landlordId: string, payload: ICreateProperty) => {

     const category = await prisma.category.findUnique({
          where: { id: payload.categoryId },
     });

     if (!category) {
          throw new Error("Invalid category ID");
     }


     const result = await prisma.property.create({
          data: {
               ...payload,
               landlordId,
          },
          include: {
               category: true,
               landlord: {
                    select: {
                         id: true,
                         name: true,
                         email: true,

                    },
               },
          },
     });

     return result;
};


const propertySearchableFields = ["title", "description", "city", "address"];

const getAllPropertiesFromDb = async (
     filters: TPropertyFilterRequest,
     options: TPaginationOptions
) => {
     const {
          searchTerm,
          city,
          minPrice,
          maxPrice,
          bedroom,
          bathroom,
          categoryId,
          status,
     } = filters;

     const page = Number(options.page) || 1;
     const limit = Number(options.limit) || 10;
     const skip = (page - 1) * limit;

     const sortBy = options.sortBy || "createdAt";
     const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";

     const andConditions: Prisma.PropertyWhereInput[] = [];

     // isDeleted properties never showcase
     andConditions.push({ isDeleted: false });

     // searchTerm - title/description/city/address 
     if (searchTerm) {
          andConditions.push({
               OR: propertySearchableFields.map((field) => ({
                    [field]: {
                         contains: searchTerm,
                         mode: "insensitive",
                    },
               })),
          });
     }

     // city filter (exact match, case-insensitive)
     if (city) {
          andConditions.push({
               city: {
                    equals: city,
                    mode: "insensitive",
               },
          });
     }

     // categoryId filter
     if (categoryId) {
          andConditions.push({ categoryId });
     }

     // status filter (AVAILABLE / RENTED / etc)
     if (status) {
          andConditions.push({ status: status as Prisma.EnumPropertyStatusFilter["equals"] });
     }

     // bedroom / bathroom exact filter
     if (bedroom) {
          andConditions.push({ bedroom: Number(bedroom) });
     }

     if (bathroom) {
          andConditions.push({ bathroom: Number(bathroom) });
     }

     // price range filter
     if (minPrice || maxPrice) {
          andConditions.push({
               price: {
                    ...(minPrice && { gte: Number(minPrice) }),
                    ...(maxPrice && { lte: Number(maxPrice) }),
               },
          });
     }

     const whereConditions: Prisma.PropertyWhereInput =
          andConditions.length > 0 ? { AND: andConditions } : {};

     const result = await prisma.property.findMany({
          where: whereConditions,
          skip,
          take: limit,
          orderBy: {
               [sortBy]: sortOrder,
          },
          include: {
               category: true,
               landlord: {
                    select: {
                         id: true,
                         name: true,
                         email: true,
                    },
               },
          },
     });

     const total = await prisma.property.count({
          where: whereConditions,
     });

     return {
          meta: {
               page,
               limit,
               total,
               totalPage: Math.ceil(total / limit),
          },
          data: result,
     };
};

const getSinglePropertyFromDb = async (id: string) => {
     const result = await prisma.property.findUnique({
          where: { id }
     })

     if (!result) {
          throw new Error("Property id is not found")
     }

     return result
}

const updatePropertyFromDb = async (id: string, userId: string, role: string, payload: ICreateProperty) => {

     const property = await prisma.property.findFirst({ where: { id, isDeleted: false } });

     if (!property) {
          throw new Error("Property not found");
     }
     
     if(role !== Role.ADMIN && property.landlordId !== userId){
          
           throw new Error("You can only update your own properties")
     }
     
     return prisma.property.update({where:{id}, data:payload})


}

const deletePropertyFromDb = async (id: string, userId: string, role: string) => {

     const property = await prisma.property.findFirst({ where: { id, isDeleted: false } });

     if (!property) {
          throw new Error("Property not found");
     }
     
     if(role !== Role.ADMIN && property.landlordId !== userId){
          
           throw new Error("You can only delete your own properties")
     }
     
     return prisma.property.delete({where:{id}})


}




export const propertyService = {
     createPropertyIntoDb,
     getAllPropertiesFromDb,
     getSinglePropertyFromDb,
     updatePropertyFromDb,
     deletePropertyFromDb
}