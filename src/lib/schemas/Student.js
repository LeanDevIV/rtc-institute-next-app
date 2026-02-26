import z from "zod";

//ZodSchema
export const studentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener menos de 50 caracteres"),
  surname: z
    .string()
    .trim()
    .min(3, "El apellido debe tener al menos 3 caracteres")
    .max(50, "El apellido debe tener menos de 50 caracteres"),
  email: z.email("Debe ingresar un correo válido"),
  phone: z
    .string()
    .trim()
    .min(10, "El teléfono debe tener al menos 10 caracteres")
    .max(20, "El teléfono debe tener menos de 20 caracteres")
    .optional(),
});