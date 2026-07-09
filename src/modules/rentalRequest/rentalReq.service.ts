import httpStatus from "http-status";

import { ICreateRentalRequest, IUpdateRentalRequestStatus } from "./rentalRequest.interface";
import { prisma } from "../../lib/prisma";

// ---------------- TENANT: Create rental request ----------------
const createRentalRequestIntoDB = async (
  tenantId: string,
  payload: ICreateRentalRequest
) => {
  
  const property = await prisma.property.findUnique({
    where: { id: payload.propertyId, isDeleted: false },
  });

  if (!property) {
    throw new Error( "Property not found");
  }

  if (property.status !== "AVAILABLE") {
    throw new Error("Property is not available for rent");
  }

  // landlord nijer property te nijei request dite parbe na
  if (property.landlordId === tenantId) {
    throw new Error("You cannot request your own property");
  }

  // same property te age theke pending/approved request thakle duplicate request atkano
  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: { in: ["PENDING", "APPROVED"] },
    },
  });

  if (existingRequest) {
    throw new Error(
      "You already have a pending or approved request for this property"
    );
  }

  const result = await prisma.rentalRequest.create({
    data: {
      tenantId, // req.user.id theke ashbe, body theke na (spoofing rokhar jonno)
      propertyId: payload.propertyId,
      moveInDate: new Date(payload.moveInDate),
      message: payload.message,
    },
    include: {
      property: true,
    },
  });

  return result;
};

// ---------------- TENANT: Get own rental requests ----------------
const getMyRentalRequestsFromDB = async (tenantId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: { tenantId },
    include: {
      property: {
        include: { category: true },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// ---------------- Get single rental request (tenant/landlord/admin) ----------------
const getRentalRequestByIdFromDB = async (
  requestId: string,
  userId: string,
  userRole: string
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: {
      property: true,
      tenant: {
        select: { id: true, name: true, email: true },
      },
      payment: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  // access control: tenant nijer ta dekhbe, landlord nijer property r ta dekhbe, admin shob dekhbe
  const isOwnerTenant = rentalRequest.tenantId === userId;
  const isOwnerLandlord = rentalRequest.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isOwnerTenant && !isOwnerLandlord && !isAdmin) {
    throw new Error("You do not have access to this rental request");
  }

  return rentalRequest;
};



export const RentalRequestServices = {
  createRentalRequestIntoDB,
  getMyRentalRequestsFromDB,
  getRentalRequestByIdFromDB,
  
};