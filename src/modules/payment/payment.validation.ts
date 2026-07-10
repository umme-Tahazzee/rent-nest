import * as yup from "yup";

const createPaymentValidationSchema = yup.object({
  body: yup.object({
    rentalRequestId: yup.string().required("rentalRequestId is required"),
  }),
});

const verifyPaymentValidationSchema = yup.object({
  body: yup.object({
    sessionId: yup.string().required("sessionId is required"),
  }),
});

export const PaymentValidations = {
  createPaymentValidationSchema,
  verifyPaymentValidationSchema,
};
