import { prisma } from "../../lib/prisma"

import { ICreateReview } from "./review.interface"

const createReviewFromDb = async(tenantId:string, payload:ICreateReview)=> {
    const property = await prisma.property.findUnique({
         where : {
            id : payload.propertyId
         }
    })

    if(!property){
        throw new Error("Property is not exist")
    }

   const completeRental = await prisma.rentalRequest.findFirst({
     where : {
         tenantId,
         propertyId: payload.propertyId,
         status: "APPROVED"
     }
   })

   if(!completeRental){
     throw new Error( "You can only review a property after your rental request is approved/completed")
   }

//    duplicated review check 
    const existingReview = await prisma.review.findUnique({
        where: {
           tenantId_propertyId: {
           tenantId,
           propertyId: payload.propertyId,
      },
    },
   });

   if (existingReview) {
     throw new Error("You have already reviewed this property");
   }

   const result = await prisma.review.create({
       data : {
           tenantId,
           propertyId: payload.propertyId,
           rating : payload.rating,
           comment: payload.comment
       }
   })

   return result

}

export const reviewServices = {
     createReviewFromDb
}