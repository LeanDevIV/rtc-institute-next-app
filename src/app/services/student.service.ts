//servicios base para estudiantes

import prisma from "@/lib/prisma";
import { studentSchema } from "@/lib/schemas/Student";
import z from "zod";

//fetch de estudiantes
async function getStudents() {
  const students = await prisma.student.findMany();
  return students;
}
//Parse de datos de entrada para crear estudiante
type StudentInput = z.infer<typeof studentSchema>;

//Crear estudiante
async function createStudent(input: StudentInput) {
  const newStudent = await prisma.student.create({ data: input });
  return newStudent;
}

export { getStudents, createStudent };
