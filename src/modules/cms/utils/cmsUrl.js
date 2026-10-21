export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const cityName = (cityMeta) =>
  (cityMeta?.destination || cityMeta?.city || cityMeta?.name || "").split(
    ",",
  )[0];

// Returns { slug, url } for city/hotel pages, or null when required data is missing.
export const buildEntitySlugAndUrl = ({ entityType, cityMeta, hotelMeta }) => {
  if (entityType === "hotelCity" || entityType === "city") {
    const slug = slugify(cityName(cityMeta));
    return slug ? { slug, url: `/hotels/${slug}` } : null;
  }

  if (entityType === "hotel") {
    const slug = slugify(hotelMeta?.hotelName);
    const citySlug = slugify(cityName(cityMeta));
    return slug && citySlug
      ? { slug, url: `/hotel-details/${citySlug}/${slug}` }
      : null;
  }

  return null;
};

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
