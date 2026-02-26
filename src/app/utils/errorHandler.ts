// utils/errorHandler.ts
import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { AppError } from "@/app/utils/errors";

export function handleError(error: unknown) {
  //Validar si es error de Zod
  if (error instanceof ZodError) {
    const errors: Record<string, string> = {};
    error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      errors[field] = issue.message;
    });
    return NextResponse.json(
      { message: "Error de validación", errors },
      { status: 400 },
    );
  }
  //Validar si es un error personalizado de la aplicación
  if (error instanceof AppError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode },
    );
  } else {
    // Para cualquier otro error no controlado, logueamos el error y devolvemos un mensaje genérico al cliente
    console.error("🔥 Error crítico no controlado:", error);
    return NextResponse.json(
      { message: "Error interno del servidor. Por favor, intentá más tarde." },
      { status: 500 },
    );
  }
}
