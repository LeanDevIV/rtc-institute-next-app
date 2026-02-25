import { NextResponse, NextRequest } from "next/server";

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
    }

    //validacion de token
    const authHeader = request.headers.get("Authorization");
    //En caso de no haber token:
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      console.warn(
        `[${timestamp}],⚠️Intento de acceso sin token en: ${pathname}`,
      );

      return NextResponse.json(
        {
          message: "TOKEN INCORRECTO PEDAZO DE BOBITO",
        },
        {
          status: 401,
        },
      );
    }
    //Extraer el token

    const token = authHeader.split(" ")[1];
    if (token !== process.env.API_TOKEN) {
      return NextResponse.json(
        {
          message: "ACCESO INVALIDO PEDAZO DE BOBITO: Token inválido",
        },
        {
          status: 401,
        },
      );
    }
    //Permite continuar ejecución
    return NextResponse.next();
  } catch (error) {
    console.error(error);
  }
}
export const config = {
  //propiedad matcher para sólo permitir funcion proxy en rutas permitidas (/students)
  matcher: ["/api/v1/students"],
};
