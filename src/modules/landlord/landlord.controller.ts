import { Request, Response } from "express";

import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import  httpStatus  from "http-status";
import { landlordService } from "./landlord.service";

const getLandlordRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const result = await landlordService.getLandlordRentalRequestsFromDB(req.user?.id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental requests for your properties retrieved successfully",
        data: result,
    });
});

const updateRentalRequestStatus = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user?.id as string
    const requestId = req.params.id as string
    const result = await landlordService.updateRentalRequestStatusInDB(
        requestId,
        landlordId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Rental request ${result.status.toLowerCase()} successfully`,
        data: result,
    });
});

export const landlordController = {
    getLandlordRentalRequests,
    updateRentalRequestStatus
}