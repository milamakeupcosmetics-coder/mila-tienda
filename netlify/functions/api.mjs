import { getStore } from "@netlify/blobs";
export const config = { path: "/api/products" };
export default async (req) => {
  const store = getStore("mila");
  const h = { "Cache-Control": "no-store" };
  if (req.method === "GET") {
    const d = await store.get("products", { type: "json" });
    return Response.json(d || [], { headers: h });
  }
  if (req.method === "POST") {
    const b = await req.json().catch(() => ({}));
    const ok = b.user && b.user === Netlify.env.get("ADMIN_USER") && b.pass === Netlify.env.get("ADMIN_PASS");
    if (!ok) return Response.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
    if (Array.isArray(b.products)) await store.setJSON("products", b.products);
    return Response.json({ ok: true });
  }
  return new Response("Método no permitido", { status: 405 });
};
