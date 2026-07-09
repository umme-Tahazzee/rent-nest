import { prisma } from "../../lib/prisma";
import { IUpdateRentalRequestStatus } from "../rentalRequest/rentalRequest.interface";

// ---------------- LANDLORD: Get all requests for own properties ----------------
const getLandlordRentalRequestsFromDB = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId, // nested filter - shudhu ei landlord er property gular request
      },
    },
    include: {
      property: true,
      tenant: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// ---------------- LANDLORD: Approve / Reject request ----------------
const updateRentalRequestStatusInDB = async (
  requestId: string,
  landlordId: string,
  payload: IUpdateRentalRequestStatus
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { property: true },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  if (rentalRequest.property.landlordId !== landlordId) {
    throw new Error(
      "You are not authorized to update this rental request"
    );
  }

  if (rentalRequest.status !== "PENDING") {
    throw new Error(
      `This request is already ${rentalRequest.status.toLowerCase()}`
    );
  }

  const result = await prisma.rentalRequest.update({
    where: { id: requestId },
    data: { status: payload.status },
  });

  
  if (payload.status === "APPROVED") {
    await prisma.property.update({
      where: { id: rentalRequest.propertyId },
      data: { status: "RENTED" },
    });
  }

  return result;
};

export const landlordService = {
    getLandlordRentalRequestsFromDB,
    updateRentalRequestStatusInDB
}