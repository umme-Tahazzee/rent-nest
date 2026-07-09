import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ValidationError as YupValidationError } from "yup";
import { Prisma } from "../../prisma/generated/prisma/client";

export const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage: string = err.message || "Something went wrong";
    let errorMessages: { path: string; message: string }[] = [];

    // ---------- Yup Validation Error ----------
    if (err instanceof YupValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessages = err.inner.length
            ? err.inner.map((e) => ({ path: e.path || "", message: e.message }))
            : [{ path: err.path || "", message: err.message }];
        errorMessage = errorMessages.map((e) => e.message).join(", ");
    }

    // Prisma can't connect to DB / bad connection config
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "You have provided incorrect field type or missing field";
    }

    // Known request errors — has an error `code` like P2002, P2025 etc.
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = httpStatus.CONFLICT;
                errorMessage = `Duplicate value for field: ${err.meta?.target}`;
                break;
            case "P2025":
                statusCode = httpStatus.NOT_FOUND;
                errorMessage = "The requested record was not found";
                break;
            case "P2003":
                statusCode = httpStatus.BAD_REQUEST;
                errorMessage = `Foreign key constraint failed on field: ${err.meta?.field_name}`;
                break;
            case "P2014":
                statusCode = httpStatus.BAD_REQUEST;
                errorMessage = "Invalid relation — related record does not exist";
                break;
            default:
                statusCode = httpStatus.BAD_REQUEST;
                errorMessage = `Database error: ${err.message}`;
        }
    }

    // Wrong data type / missing required field passed to Prisma query
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "Invalid data passed to database query";
    }

    // Unknown/unexpected DB engine error
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "An unknown database error occurred";
    }

    // Prisma engine crashed / panicked
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "A critical database engine error occurred";
    }

    // JSON.parse() failures — e.g. your tags query param case
    else if (err instanceof SyntaxError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "Invalid JSON format in request";
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        errorCode: err.code || null,
        name: err.name,
        message: errorMessage,
        errorMessages,
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};