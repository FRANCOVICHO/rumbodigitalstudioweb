import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("ADMIN_EMAIL or ADMIN_PASSWORD env vars not set");
      return NextResponse.json(
        { error: "Credenciales de admin no configuradas. Agregá ADMIN_EMAIL y ADMIN_PASSWORD en las variables de entorno de Vercel." },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      return response;
    }

    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
