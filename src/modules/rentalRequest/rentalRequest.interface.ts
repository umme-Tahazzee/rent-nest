export interface ICreateRentalRequest {
  propertyId: string;
  moveInDate: Date;
  message?: string;
}

export interface IUpdateRentalRequestStatus {
  status: "APPROVED" | "REJECTED";
}