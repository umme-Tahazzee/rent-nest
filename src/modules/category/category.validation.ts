import * as yup from "yup";

const createCategoryValidationSchema = yup.object({
  body: yup.object({
    name: yup.string().required("Category name is required").min(2, "Name too short"),
    description: yup.string().optional(),
  }),
});

const updateCategoryValidationSchema = yup.object({
  body: yup.object({
    name: yup.string().min(2, "Name too short").optional(),
    description: yup.string().optional(),
  }),
});

export const CategoryValidations = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};