import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export async function POST(request: NextRequest) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "API key no configurada" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { projectType, features, pageCount, timeline, imageBase64 } = body;

    const systemPrompt = `Sos un experto en desarrollo web argentino de la agencia Rumbo Digital Studio. 
Cuando el usuario te cuente su proyecto, analizás los requisitos y dás un presupuesto estimado en pesos argentinos (ARS).
Siempre respondés en español argentino, de forma amigable y directa.
Dás el presupuesto como un rango (mínimo - máximo) y explicás brevemente por qué.
También mencionás el tiempo estimado de desarrollo.
Sos conciso: máximo 4-5 oraciones.`;

    const userText = `El cliente necesita lo siguiente:
- Tipo de proyecto: ${projectType}
- Páginas/secciones: ${pageCount}
- Plazo deseado: ${timeline}
- Funciones adicionales: ${features.length > 0 ? features.join(", ") : "ninguna"}
${imageBase64 ? "También subió una imagen de referencia para que puedas ver el estilo o contexto." : ""}

¿Cuál sería el presupuesto estimado y tiempo de desarrollo?`;

    const messages: {
      role: string;
      content: string | { type: string; text?: string; image_url?: { url: string } }[];
    }[] = [
      { role: "system", content: systemPrompt },
    ];

    if (imageBase64) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: userText,
          },
          {
            type: "image_url",
            image_url: {
              url: imageBase64,
            },
          },
        ],
      });
    } else {
      messages.push({ role: "user", content: userText });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Groq error:", err);
      return NextResponse.json({ error: "Error al consultar la IA" }, { status: 500 });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No se pudo obtener una respuesta.";

    return NextResponse.json({ estimate: text });
  } catch (error) {
    console.error("Estimate error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
