import { Prisma } from "../../generated/prisma/client";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  IUpdateUserStatus,
  TAdminPropertyFilterRequest,
  TAdminRentalFilterRequest,
  TPaginationOptions,
  TUserFilterRequest,
} from "./admin.interface";

const userSearchableFields = ["name", "email", "phone"];

// ---------------- ADMIN: Get all users (tenant + landlord + admin) with filter/pagination ----------------
const getAllUsersFromDB = async (
  filters: TUserFilterRequest,
  options: TPaginationOptions
) => {
  const { searchTerm, role, status } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";

  const andConditions: Prisma.UserWhereInput[] = [];

  andConditions.push({ isDeleted: false });

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (role) {
    andConditions.push({ role: role as Prisma.EnumRoleFilter["equals"] });
  }

  if (status) {
    andConditions.push({
      status: status as Prisma.EnumUserStatusFilter["equals"],
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    omit: { password: true },
  });

  const total = await prisma.user.count({ where: whereConditions });

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

// ---------------- ADMIN: Ban / unban a user ----------------
const updateUserStatusIntoDB = async (
  adminId: string,
  userId: string,
  payload: IUpdateUserStatus
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  // admin nijeke ban korte parbe na
  if (user.id === adminId) {
    throw new Error("You cannot change your own status");
  }

  // ekjon admin onno admin ke ban korte parbe na
  if (user.role === Role.ADMIN) {
    throw new Error("You cannot change status of another admin");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { status: payload.status },
    omit: { password: true },
  });

  return result;
};

// ---------------- ADMIN: Get all properties (moderation view, isDeleted soho) ----------------
const getAllPropertiesFromDB = async (
  filters: TAdminPropertyFilterRequest,
  options: TPaginationOptions
) => {
  const { searchTerm, city, categoryId, status } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: ["title", "description", "city", "address"].map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (city) {
    andConditions.push({ city: { equals: city, mode: "insensitive" } });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (status) {
    andConditions.push({
      status: status as Prisma.EnumPropertyStatusFilter["equals"],
    });
  }

  const whereConditions: Prisma.PropertyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.property.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      category: true,
      landlord: { select: { id: true, name: true, email: true } },
    },
  });

  const total = await prisma.property.count({ where: whereConditions });

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

// ---------------- ADMIN: Get all rental requests, platform-wide ----------------
const getAllRentalRequestsFromDB = async (
  filters: TAdminRentalFilterRequest,
  options: TPaginationOptions
) => {
  const { status, propertyId, tenantId } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";

  const andConditions: Prisma.RentalRequestWhereInput[] = [];

  if (status) {
    andConditions.push({
      status: status as Prisma.EnumRentalRequestStatusFilter["equals"],
    });
  }

  if (propertyId) {
    andConditions.push({ propertyId });
  }

  if (tenantId) {
    andConditions.push({ tenantId });
  }

  const whereConditions: Prisma.RentalRequestWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.rentalRequest.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      tenant: { select: { id: true, name: true, email: true } },
      property: {
        include: {
          landlord: { select: { id: true, name: true, email: true } },
        },
      },
      payment: true,
    },
  });

  const total = await prisma.rentalRequest.count({ where: whereConditions });

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

export const AdminServices = {
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  getAllPropertiesFromDB,
  getAllRentalRequestsFromDB,
};
