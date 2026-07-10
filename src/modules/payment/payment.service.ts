import Stripe from "stripe";

import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import { ICreatePayment } from "./payment.interface";

// ---------------- TENANT: Create Stripe checkout session for an approved rental ----------------
const createPaymentSessionIntoDB = async (
  tenantId: string,
  payload: ICreatePayment
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: payload.rentalRequestId },
    include: { property: true, payment: true },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  // shudhu nijer rental request er jonno payment korte parbe
  if (rentalRequest.tenantId !== tenantId) {
    throw new Error("You do not have access to this rental request");
  }

  if (rentalRequest.status !== "APPROVED") {
    throw new Error(
      "Payment can only be made after the rental request is approved"
    );
  }

  // already paid thakle abar session banano allow korbo na
  if (rentalRequest.payment?.status === "PAID") {
    throw new Error("This rental request has already been paid for");
  }

  const amount = Number(rentalRequest.property.price);

  // stripe checkout session create
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(amount * 100), // cents e convert
          product_data: {
            name: rentalRequest.property.title,
            description: `Rental payment for ${rentalRequest.property.title}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/cancel`,
    metadata: {
      rentalRequestId: rentalRequest.id,
      tenantId,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create Stripe checkout session");
  }

  // Payment record upsert - rentalRequestId ta unique, tai already ekta pending row thakle update, na thakle create
  const payment = await prisma.payment.upsert({
    where: { rentalRequestId: rentalRequest.id },
    update: {
      transactionId: session.id,
      amount,
      method: "STRIPE",
      status: "PENDING",
    },
    create: {
      rentalRequestId: rentalRequest.id,
      tenantId,
      amount,
      method: "STRIPE",
      transactionId: session.id,
      status: "PENDING",
    },
  });

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
    payment,
  };
};

// ---------------- TENANT: Manually confirm payment via session id (fallback for when webhook isn't reachable, e.g. local testing) ----------------
const verifyPaymentFromDB = async (tenantId: string, sessionId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: sessionId },
  });

  if (!payment) {
    throw new Error("Payment not found for this session");
  }

  if (payment.tenantId !== tenantId) {
    throw new Error("You do not have access to this payment");
  }

  if (payment.status === "PAID") {
    return payment;
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    // payment amn ekhono complete hoyni stripe er dik theke
    const updated = await prisma.payment.update({
      where: { transactionId: sessionId },
      data: { status: session.status === "expired" ? "FAILED" : "PENDING" },
    });
    return updated;
  }

  const updated = await prisma.payment.update({
    where: { transactionId: sessionId },
    data: { status: "PAID", paidAt: new Date() },
  });

  return updated;
};

// ---------------- STRIPE WEBHOOK: verify signature and mark payment paid/failed ----------------
const handleStripeWebhookEvent = async (rawBody: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe_webhook_secret
    );
  } catch (error) {
    throw new Error(
      `Webhook signature verification failed: ${(error as Error).message}`
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      await prisma.payment.updateMany({
        where: { transactionId: session.id },
        data: { status: "PAID", paidAt: new Date() },
      });
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;

      await prisma.payment.updateMany({
        where: { transactionId: session.id },
        data: { status: "FAILED" },
      });
      break;
    }

    default:
      // onno event gula amra ekhon handle korchi na
      break;
  }

  return { received: true };
};

// ---------------- TENANT: Get own payment history ----------------
const getMyPaymentsFromDB = async (tenantId: string) => {
  const result = await prisma.payment.findMany({
    where: { tenantId },
    include: {
      rentalRequest: {
        include: { property: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

// ---------------- Get single payment (tenant/landlord/admin) ----------------
const getPaymentByIdFromDB = async (
  paymentId: string,
  userId: string,
  userRole: string
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: { property: true },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const isOwnerTenant = payment.tenantId === userId;
  const isOwnerLandlord = payment.rentalRequest.property.landlordId === userId;
  const isAdmin = userRole === "ADMIN";

  if (!isOwnerTenant && !isOwnerLandlord && !isAdmin) {
    throw new Error("You do not have access to this payment");
  }

  return payment;
};

export const PaymentServices = {
  createPaymentSessionIntoDB,
  verifyPaymentFromDB,
  handleStripeWebhookEvent,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
};
