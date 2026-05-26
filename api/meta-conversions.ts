import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

// Helper function to hash email as SHA-256 according to Meta specs
function hashValue(val: string): string {
  if (!val) return "";
  return crypto.createHash("sha256").update(val.trim().toLowerCase()).digest("hex");
}

// Helper function to hash phone as SHA-256 according to Meta specs
function hashPhone(val: string): string {
  if (!val) return "";
  // Remove all non-digits
  const digitsOnly = val.replace(/\D/g, "");
  return crypto.createHash("sha256").update(digitsOnly).digest("hex");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers to prevent browser pre-flight errors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const {
      event_name = "Lead",
      email = "",
      phone = "",
      event_source_url = "https://ranchodochurrasqueiro.com",
      value = "2.50",
      currency = "BRL",
      client_user_agent = "",
      client_ip_address = "",
      customPixelId = "",
      customAccessToken = ""
    } = req.body || {};

    const sanitizeValue = (val: any) => {
      if (!val) return "";
      const str = String(val).trim();
      if (str === "null" || str === "undefined" || str === "") return "";
      return str;
    };

    const pixelId = sanitizeValue(customPixelId) || sanitizeValue(process.env.META_PIXEL_ID) || "1382017203733797";
    const accessToken = sanitizeValue(customAccessToken) || sanitizeValue(process.env.META_ACCESS_TOKEN);

    console.log(`[Vercel Serverless Meta call] Event: ${event_name}, Pixel: ${pixelId}`);

    if (!accessToken || accessToken.length < 15) {
      console.warn("[Meta Warning] Conversions API bypassed on Vercel: No Access Token.");
      return res.status(200).json({
        status: "simulated_success",
        message: "Event logged successfully (Conversions API was bypassed because no valid Access Token is set)."
      });
    }

    const hashedEmail = email ? hashValue(email) : null;
    const hashedPhone = phone ? hashPhone(phone) : null;

    const metaPayload = {
      data: [
        {
          event_name: event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: event_source_url,
          user_data: {
            em: hashedEmail ? [hashedEmail] : [],
            ph: hashedPhone ? [hashedPhone] : [],
            client_ip_address: client_ip_address || (req.headers["x-forwarded-for"] as string) || "127.0.0.1",
            client_user_agent: client_user_agent || req.headers["user-agent"] || ""
          },
          custom_data: {
            currency: currency,
            value: String(value)
          }
        }
      ]
    };

    const metaUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

    const response = await fetch(metaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(metaPayload)
    });

    const result = await response.json();
    console.log("[Vercel Meta API Response]", JSON.stringify(result));

    if (!response.ok) {
      return res.status(response.status).json({
        error: true,
        facebook_error: result
      });
    }

    return res.status(200).json({
      success: true,
      facebook_response: result
    });
  } catch (error: any) {
    console.error("[Vercel Meta API Critical Error]", error);
    return res.status(500).json({
      error: true,
      message: error.message || "Internal Server Error"
    });
  }
}
