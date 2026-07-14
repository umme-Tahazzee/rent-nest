import * as yup from "yup";
import { Role } from "../../generated/prisma/enums";


const createUserValidationSchema = yup.object({
  body: yup.object({
    name: yup
      .string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),

    email: yup
      .string()
      .required("Email is required")
      .email("Please provide a valid email address"),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),

    phone: yup
      .string()
      .matches(/^(?:\+?88)?01[3-9]\d{8}$/, "Please provide a valid phone number"),

    role: yup
      .mixed<Role>()
      
  }),
});

export const UserValidations = {
  createUserValidationSchema,
};