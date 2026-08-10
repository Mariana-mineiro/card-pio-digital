import * as yup from "yup";

export const adminLoginSchema = yup
  .object({
    email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
    password: yup.string().required("Senha é obrigatória"),
  })
  .required();

export type AdminLoginFormData = yup.InferType<typeof adminLoginSchema>;