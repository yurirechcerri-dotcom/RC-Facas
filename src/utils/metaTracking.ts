declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

/**
 * Initializes the client-side Meta Pixel using the official Meta integration script.
 * Registers dynamic pixel ID (falls back to default "1382017203733797" if not supplied).
 */
export function initMetaPixel(pixelId?: string) {
  if (typeof window === "undefined") return;

  const resolvedPixelId = pixelId || "1382017203733797";

  // Prevent loading SDK scripts multiple times
  if (!window.fbq) {
    /* eslint-disable */
    // @ts-ignore
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
  }

  try {
    window.fbq("init", resolvedPixelId);
    window.fbq("track", "PageView");
    console.log(`[Meta Pixel] Instantiated & PageView tracked for pixelId: ${resolvedPixelId}`);
  } catch (error) {
    console.error("[Meta Pixel Error] Could not initialize Pixel snippet", error);
  }
}

/**
 * Fires a standard Meta browser pixel event.
 */
export function trackMetaPixelEvent(eventName: string, customData?: any) {
  if (typeof window === "undefined") return;
  
  if (window.fbq) {
    try {
      window.fbq("track", eventName, customData);
      console.log(`[Meta Pixel Event] ${eventName} tracked.`, customData);
    } catch (e) {
      console.error(`[Meta Pixel Event Error] Failed tracking "${eventName}" via SDK`, e);
    }
  } else {
    console.log(`[Meta Pixel Mock Event] fbq not defined. Event: ${eventName}`, customData);
  }
}

/**
 * Communicates with our secure Express proxy endpoint to dispatch server-side Conversions API events.
 */
export async function trackConversionsApiEvent({
  eventName,
  emailStr = "",
  phoneStr = "",
  value = "2.50",
  currency = "BRL",
  customPixelId = "",
  customAccessToken = ""
}: {
  eventName: string;
  emailStr?: string;
  phoneStr?: string;
  value?: string;
  currency?: string;
  customPixelId?: string;
  customAccessToken?: string;
}) {
  try {
    const payload = {
      event_name: eventName,
      email: emailStr,
      phone: phoneStr,
      event_source_url: typeof window !== "undefined" ? window.location.href : "https://ranchodochurrasqueiro.com",
      value,
      currency,
      client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      customPixelId,
      customAccessToken
    };

    console.log(`[Conversions API Call] Sending ${eventName} for ${emailStr || "anonymous"}`);

    const response = await fetch("/api/meta-conversions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log(`[Conversions API Response] Status: ${response.status}`, data);
    return data;
  } catch (err) {
    console.error("[Conversions API Delivery Error] Failed routing to server route:", err);
  }
}

/**
 * Executes a dual pixel & conversions API event trigger (coined as Meta Advanced Matching / Hybrid tracking).
 */
export async function trackUnifiedMetaEvent({
  eventName,
  emailStr = "",
  phoneStr = "",
  value = "2.50",
  currency = "BRL",
  config
}: {
  eventName: string;
  emailStr?: string;
  phoneStr?: string;
  value?: string;
  currency?: string;
  config?: { metaPixelId?: string; metaAccessToken?: string };
}) {
  console.log(`[Unified Meta Tracking] Unified fire requested: "${eventName}"`);

  // 1. Client-Side Pixel Trigger
  trackMetaPixelEvent(eventName, {
    currency,
    value: parseFloat(value) || 2.50,
    content_name: "Acesso Grupo VIP",
    content_category: "Rifas de Facas Gaúchas"
  });

  // 2. Server-Side Conversions API Trigger
  await trackConversionsApiEvent({
    eventName,
    emailStr,
    phoneStr,
    value,
    currency,
    customPixelId: config?.metaPixelId || "",
    customAccessToken: config?.metaAccessToken || ""
  });
}
