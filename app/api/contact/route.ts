import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string, maxRequests = 3, windowMinutes = 10): boolean {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const timestamps = rateLimitMap.get(ip) || [];
  const recentTimestamps = timestamps.filter((t) => now - t < windowMs);
  
  if (recentTimestamps.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    
    // Check rate limit
    if (!checkRateLimit(ip, 3, 10)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check
    if (body.website && body.website.trim() !== "") {
      // Silent success for bots
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Basic validation
    const { name, email, phone, service, message } = body;

    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Invalid name", field: "name" },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email", field: "email" },
        { status: 400 }
      );
    }

    if (!message || message.length < 10 || message.length > 1000) {
      return NextResponse.json(
        { error: "Invalid message", field: "message" },
        { status: 400 }
      );
    }

    if (phone && !/^\+?[\d\s\-()]{7,20}$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone", field: "phone" },
        { status: 400 }
      );
    }

    // In a real app, we'd save to PocketBase here
    // For now, just log and return success
    console.log("Contact form submission:", {
      name,
      email,
      phone: phone || "N/A",
      service: service || "N/A",
      message,
      ip,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Message received" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
