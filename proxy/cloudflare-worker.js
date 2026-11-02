export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, X-ModX-Target",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (!["GET", "POST"].includes(request.method)) return new Response("Method not allowed", { status: 405, headers: cors });
    const target = request.headers.get("X-ModX-Target");
    if (!target) return new Response("Missing X-ModX-Target", { status: 400, headers: cors });
    let url;
    try { url = new URL(target); } catch { return new Response("Invalid target URL", { status: 400, headers: cors }); }
    const allowed = (env.ALLOWED_HOSTS || "integrate.api.nvidia.com,api.openai.com")
      .split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
    if (url.protocol !== "https:" || !allowed.includes(url.hostname.toLowerCase())) {
      return new Response("Target host is not allowed. Configure ALLOWED_HOSTS.", { status: 403, headers: cors });
    }
    const headers = new Headers();
    for (const name of ["Authorization", "Content-Type", "Accept"]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const init = { method: request.method, headers };
    if (request.method === "POST") init.body = await request.arrayBuffer();
    try {
      const upstream = await fetch(new Request(url.toString(), init));
      const outHeaders = new Headers(upstream.headers);
      for (const [key, value] of Object.entries(cors)) outHeaders.set(key, value);
      return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers: outHeaders });
    } catch (error) {
      return new Response("Upstream request failed: " + error.message, { status: 502, headers: cors });
    }
  }
};
