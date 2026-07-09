import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { RentalRequestServices } from "./rentalReq.service";
import { sendResponse } from "../utils/sendResponse";
import { Role } from "../../../generated/prisma/enums";


const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
    const id = req.user?.id as string
    const payload = req.body
    console.log(payload)

    const result = await RentalRequestServices.createRentalRequestIntoDB(
        id,
        payload
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Rental request submitted successfully",
        data: result,
    });
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {
    const result = await RentalRequestServices.getMyRentalRequestsFromDB(req.user?.id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental requests retrieved successfully",
        data: result,
    });
});

const getRentalRequestById = catchAsync(async (req: Request, res: Response) => {

    const requestId = req.params.id as string
    const rantelId = req.user?.id as string
    const role = req.user?.role as Role

    const result = await RentalRequestServices.getRentalRequestByIdFromDB(
        requestId,
        rantelId,
        role
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental request retrieved successfully",
        data: result,
    });
});



export const RentalRequestControllers = {
    createRentalRequest,
    getMyRentalRequests,
    getRentalRequestById,
    
};