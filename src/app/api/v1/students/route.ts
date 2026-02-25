import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import z from "zod";
//Get students
 export async function GET(request: Request) {
   try {
     const students = await prisma.student.findMany();
     return NextResponse.json(
       { message: "Estudiantes encontrados:", students },
       { status: 200 },
     );
   } catch (error) {
     console.error(error);
     return NextResponse.json(
       { message: "Error interno del servidor" },
       { status: 500 },
     );
   }
 }
//ZodSchema
const studentSchema = z.object({
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

//Create student
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = studentSchema.safeParse(body);
    if (!result.success) {
      // const errors = z.treeifyError(result.error);
      //crear Record de errores
      const errors: Record<string, string> = {};
      //recorrer errores
      result.error.issues.forEach((issue) => {
        //obtener campo
        const field = issue.path[0] as string;
        //agregar error
        errors[field] = issue.message;
      });
      //retornar errores
      return NextResponse.json(errors, { status: 400 });
    }

    const newStudent = await prisma.student.create({
      data: result.data,
    });
    return NextResponse.json(
      { message: "Estudiante creado:", newStudent },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}



