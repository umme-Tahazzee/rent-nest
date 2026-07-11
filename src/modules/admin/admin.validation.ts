import * as yup from "yup";

const updateUserStatusValidationSchema = yup.object({
  body: yup.object({
    status: yup
      .string()
      .oneOf(["ACTIVE", "BLOCKED"], "status must be either ACTIVE or BLOCKED")
      .required("status is required"),
  }),
});

export const AdminValidations = {
  updateUserStatusValidationSchema,
};
