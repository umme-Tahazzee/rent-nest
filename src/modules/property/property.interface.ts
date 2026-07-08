export interface ICreateProperty {
  categoryId: string;
  title: string;
  description: string;
  address?: string;
  city: string;
  price: number;
  bedroom: number;
  bathroom: number;
}

export type TPropertyFilterRequest = {
  searchTerm?: string;
  city?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  bedroom?: string;
  bathroom?:string
  status?: string;
};

export type TPaginationOptions = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};