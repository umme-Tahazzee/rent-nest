import httpStatus from "http-status";
import { Request, Response } from "express";

import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id as string;
  const payload = req.body;

  const result = await PaymentServices.createPaymentSessionIntoDB(
    tenantId,
    payload
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user?.id as string;
  const { sessionId } = req.body;

  const result = await PaymentServices.verifyPaymentFromDB(tenantId, sessionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment status verified successfully",
    data: result,
  });
});

// raw body lage stripe signature verify korar jonno, tai app.ts e alada middleware diye mount kora
const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  const result = await PaymentServices.handleStripeWebhookEvent(
    req.body,
    signature
  );

  res.status(httpStatus.OK).json(result);
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getMyPaymentsFromDB(
    req.user?.id as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment history retrieved successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const paymentId = req.params.id as string;
  const userId = req.user?.id as string;
  const role = req.user?.role as string;

  const result = await PaymentServices.getPaymentByIdFromDB(
    paymentId,
    userId,
    role
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const PaymentControllers = {
  createPaymentSession,
  verifyPayment,
  stripeWebhook,
  getMyPayments,
  getPaymentById,
};
