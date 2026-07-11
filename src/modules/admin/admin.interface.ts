export type TPaginationOptions = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type TUserFilterRequest = {
  searchTerm?: string;
  role?: string;
  status?: string;
};

export type TAdminPropertyFilterRequest = {
  searchTerm?: string;
  city?: string;
  categoryId?: string;
  status?: string;
};

export type TAdminRentalFilterRequest = {
  status?: string;
  propertyId?: string;
  tenantId?: string;
};

export interface IUpdateUserStatus {
  status: "ACTIVE" | "BLOCKED";
}
