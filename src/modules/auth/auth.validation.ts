import * as yup from "yup";

const loginValidationSchema = yup.object({
  body: yup.object({
    email: yup.string().required("Email is required").email("Provide a valid email"),
    password: yup.string().required("Password is required"),
  }),
});

export const AuthValidations = { loginValidationSchema };