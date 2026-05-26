import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dns from "dns";

// Disable potential DNS lookup delays
dns.setDefaultResultOrder("ipv4first");

function hashValue(val: string): string {
  if (!val) return "";
  return crypto.createHash("sha256").update(val.trim().toLowerCase()).digest("hex");
}

function hashPhone(val: string): string {
  if (!val) return "";
  // Remove all non-digits
  const digitsOnly = val.replace(/\D/g, "");
  return crypto.createHash("sha256").update(digitsOnly).digest("hex");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware for API processing
  app.use(express.json());

  // Log incoming API calls
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      console.log(`[API Method: ${req.method}] ${req.path}`);
    }
    next();
  });

  // Meta Conversions API secure forwarding route
  app.post("/api/meta-conversions", async (req, res) => {
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
      } = req.body;

      // Sanitize inputs to avoid literal "null" or "undefined" strings
      const sanitizeValue = (val: any) => {
        if (!val) return "";
        const str = String(val).trim();
        if (str === "null" || str === "undefined" || str === "") return "";
        return str;
      };

      // Select Meta Pixel configurations (Priority: App Custom Input > Environment Config > Default Pixel)
      const pixelId = sanitizeValue(customPixelId) || sanitizeValue(process.env.META_PIXEL_ID) || "1382017203733797";
      const accessToken = sanitizeValue(customAccessToken) || sanitizeValue(process.env.META_ACCESS_TOKEN);

      console.log(`[Meta API Call] Processing event "${event_name}" for Pixel ID: ${pixelId}`);

      // Meta access tokens are long strings, must be valid and of sufficient size to be tried
      if (!accessToken || accessToken.length < 15) {
        console.warn("[Meta Warning] Conversions API call bypassed: No valid Access Token is configured (or token was 'null'/'undefined').");
        return res.status(200).json({
          status: "simulated_success",
          message: "Event logged successfully (Conversions API was bypassed because no valid Access Token is set)."
        });
      }

      // Hash sensitive customer details per Meta specification
      const hashedEmail = email ? hashValue(email) : null;
      const hashedPhone = phone ? hashPhone(phone) : null;

      // Build payload for Meta
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
              client_ip_address: client_ip_address || req.ip || "127.0.0.1",
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
      console.log("[Meta Response]", JSON.stringify(result));

      if (!response.ok) {
        return res.status(response.status).json({
          error: true,
          facebook_error: result
        });
      }

      return res.json({
        success: true,
        facebook_response: result
      });
    } catch (error: any) {
      console.error("[Meta Conversions API Error]", error);
      return res.status(500).json({
        error: true,
        message: error.message || "Internal server error"
      });
    }
  });

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Mounting Vite Middleware in Development Mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Serving production files from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // PORT value is hardcoded as 3000 as requested
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting application server:", err);
});
