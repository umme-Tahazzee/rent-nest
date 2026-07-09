import * as yup from "yup";

const createReviewValidationSchema = yup.object({
  body: yup.object({
    propertyId: yup.string().required("propertyId is required"),
    rating: yup
      .number()
      .required("rating is required")
      .min(1, "rating must be at least 1")
      .max(5, "rating cannot be more than 5")
      .integer("rating must be an integer"),
    comment: yup.string().optional(),
  }),
});

export const ReviewValidations = {
  createReviewValidationSchema,
};