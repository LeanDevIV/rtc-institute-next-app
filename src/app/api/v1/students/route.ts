import { NextResponse } from "next/server";
import { studentSchema } from "@/lib/schemas/Student";
import { createStudent, getStudents } from "@/app/services/student.service";
import { handleError } from "@/app/utils/errorHandler";
//Get students
export async function GET(request: Request) {
  try {
    const students = await getStudents();
    return NextResponse.json(
      { message: "Estudiantes encontrados:", students },
      { status: 200 },
    );
  } catch (error) {
    //TODO: agregar logger para registrar errores y error handling más robusto
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

//Create student
export async function POST(request: Request) {
  try {
    //Solicitamos el cuerpo de la petición y lo parseamos como JSON para hacerlo más manejable
    const body = await request.json();

    //Validamos los datos de entrada usando Zod
    const result = studentSchema.safeParse(body);
    if (!result.success) {
      // Si la validación falla, formateamos los errores y los devolvemos al cliente
      throw result.error; // Esto será capturado por el error handler global y formateado adecuadamente;
    }

    //Finalmente, si la validación es exitosa, creamos el estudiante en la base de datos
    const student = await createStudent(result.data);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error(error);
    return handleError(error); // Usamos el manejador de errores global para formatear la respuesta de error
  }
}
