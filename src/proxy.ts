import { NextResponse, NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  try {
    //Desestructuramos y sacamos solo la propiedad **pathname** del objeto nextUrl
    const { pathname } = request.nextUrl;
    //Registro de método de petición
    const method = request.method;
    //Registro de tiempo
    const timestamp = new Date().toLocaleTimeString();
    //Registro en consola
    console.log(`[${timestamp}], metodo:${method} /ruta:${pathname}`);

    if (pathname.startsWith("/api/v1/students")) {
      if (method === "GET") {
        console.log(`[${timestamp}]🔓 Acceso público en ${pathname}`);
        return NextResponse.next();
      }

      const session = await auth.api.getSession({
        headers: request.headers,
      });
      if (!session) {
        console.warn(
          `[${timestamp}]⚠️Intento de acceso sin sesión en: ${pathname}`,
        );
        return NextResponse.json(
          {
            message: "acceso denegado: No se ha iniciado sesión",
          },
          { status: 401 },
        );
      }
      console.log(
        `[${timestamp}]✅ Acceso autorizado para usuario: ${session.user.email} en ${pathname}`,
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const config = {
  //propiedad matcher para sólo permitir funcion proxy en rutas permitidas (/students)
  matcher: [
    "/api/v1/students",
    "/api/v1/students/:path*"
  ],
};
