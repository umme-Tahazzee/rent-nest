import httpStatus from "http-status";
import { Request, Response } from "express";

import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import pick from "../utils/pick";
import { AdminServices } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "role", "status"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await AdminServices.getAllUsersFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user?.id as string;
  const userId = req.params.id as string;
  const payload = req.body;

  const result = await AdminServices.updateUserStatusIntoDB(
    adminId,
    userId,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    "searchTerm",
    "city",
    "categoryId",
    "status",
  ]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await AdminServices.getAllPropertiesFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["status", "propertyId", "tenantId"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await AdminServices.getAllRentalRequestsFromDB(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};
