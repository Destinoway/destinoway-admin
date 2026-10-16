// Builds an absolute public-site URL; safe when the CMS path already has a query string.
export const buildFrontendUrl = (path, { preview = false } = {}) => {
  if (!path) return "";

  const base = (
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"
  ).replace(/\/+$/, "");

  const url = new URL(`${base}${path}`);

  if (preview) {
    url.searchParams.set("preview", "true");
  }

  return url.toString();
};
