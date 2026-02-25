import { Student } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import z from "zod";
/**Funcion para buscar alumno por id con prisma
 * @params id
 * @returns student
 */
const getStudent = async (id: string): Promise<Student | null> => {
  const student = await prisma.student.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return student;
};

//Parámetros de tipo url vienen en tipo string
//Id en db es tipo Int
//TODO: cambiar  id a > INT
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    //el id es extraído de los params
    const { id } = await params;
    //Ejecuta funcion para buscar alumnos
    const student = await getStudent(id);
    //Validacion en caso de faltar alumno
    if (!student) {
      return NextResponse.json(
        { message: "Estudiante no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json({ student }, { status: 200 });
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
/**
 * Funcion para actualizar datos de alumnos
 * @param request
 * @param param1
 * @returns
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const student = await getStudent(id);
    //Realizo validacion en caso de !student
    if (!student) {
      return NextResponse.json(
        { message: "Estudiante no encontrado" },
        { status: 404 },
      );
    }
    //Actualizar datos del alumno
    const body = await request.json();

    const result = studentSchema.safeParse(body);
    //Control de error
    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;

        errors[field] = issue.message;
      });

      return NextResponse.json(errors, { status: 400 });
    }
    const updatedStudent = await prisma.student.update({
      //IMPORTANTE: asignar específicamente siempre QUÉ actualizar
      //Caso contrario se actualizará **TODOS** los datos
      where: { id: Number(id) },
      data: result.data,
    });
    return NextResponse.json(
      { message: "Estudiante actualizado:", updatedStudent },
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

//Funcion para eliminar alumnos
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const student = await getStudent(id);

    if (!student) {
      return NextResponse.json(
        { message: "Estudiante no encontrado" },

        { status: 404 },
      );
    }
    const deletedStudent = await prisma.student.delete({
      where: { id: Number(id) },
    });
    console.log(
      `Estudiante eliminado: ${deletedStudent.name} ${deletedStudent.surname}`,
    );
    return NextResponse.json(
      { message: "Estudiante eliminado:", deletedStudent},
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
