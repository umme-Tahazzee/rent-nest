import * as yup from "yup";

const createPropertyValidationSchema = yup.object({
  body: yup.object({
    categoryId: yup.string().required("categoryId is required"),
    title: yup.string().required("title is required").min(3, "title too short"),
    description: yup.string().required("description is required").min(10, "description too short"),
    address: yup.string().optional(),
    city: yup.string().required("city is required"),
    price: yup.number().required("price is required").positive("price must be positive"),
    bedroom: yup.number().required("bedroom is required").integer().min(0),
    bathroom: yup.number().required("bathroom is required").integer().min(0),
  }),
});

const updatePropertyValidationSchema = yup.object({
  body: yup.object({
    categoryId: yup.string().optional(),
    title: yup.string().min(3, "title too short").optional(),
    description: yup.string().min(10, "description too short").optional(),
    address: yup.string().optional(),
    city: yup.string().optional(),
    price: yup.number().positive("price must be positive").optional(),
    bedroom: yup.number().integer().min(0).optional(),
    bathroom: yup.number().integer().min(0).optional(),
    status: yup
      .mixed<"AVAILABLE" | "RENTED" | "UNAVAILABLE">()
      .oneOf(["AVAILABLE", "RENTED", "UNAVAILABLE"], "Invalid status")
      .optional(),
  }),
});

export const PropertyValidations = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};