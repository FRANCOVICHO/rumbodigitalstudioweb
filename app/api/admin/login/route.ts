import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "digitalstudiorumbo@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Messifranco2009";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
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
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
