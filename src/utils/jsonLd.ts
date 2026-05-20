import { ContactDetails, Service } from "@/types";

export const SITE_URL = "https://mentalhealthid.lovable.app";

export interface LocationLike {
  name?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export const buildPostalAddress = (loc?: LocationLike) => {
  if (!loc) return undefined;
  const addr: Record<string, string> = { "@type": "PostalAddress" };
  if (loc.address) addr.streetAddress = loc.address;
  if (loc.city) addr.addressLocality = loc.city;
  if (loc.province) addr.addressRegion = loc.province;
  if (loc.country) addr.addressCountry = loc.country;
  return Object.keys(addr).length > 1 ? addr : undefined;
};

export const buildGeo = (loc?: LocationLike) => {
  if (!loc?.lat || !loc?.lng) return undefined;
  return {
    "@type": "GeoCoordinates",
    latitude: loc.lat,
    longitude: loc.lng,
  };
};

export const phoneFromContacts = (contacts: ContactDetails = []): string | undefined => {
  const phone = contacts.find((c) => c.type === "Phone" || c.type === "WhatsApp");
  return phone?.value || phone?.link?.replace(/^tel:/i, "");
};

export const sameAsFromContacts = (contacts: ContactDetails = []): string[] => {
  return contacts
    .filter((c) => (c.type === "Website" || c.type === "Instagram") && c.link)
    .map((c) => c.link as string);
};

export const buildOffers = (services: Service[] = []) => {
  if (!services.length) return undefined;
  return services.map((s) => ({
    "@type": "Service",
    name: s.name,
    ...(s.price != null && {
      offers: {
        "@type": "Offer",
        price: s.price,
        priceCurrency: "IDR",
      },
    }),
  }));
};

export interface BreadcrumbItemLike {
  name: string;
  path: string;
}

/**
 * Build a BreadcrumbList JSON-LD node. Pass crumbs in display order
 * (e.g. [{ name: "Home", path: "/" }, { name: "Practitioners", path: "/professional-counseling" }, { name: "Dr. X", path: "/practitioner/1" }]).
 */
export const buildBreadcrumbList = (items: BreadcrumbItemLike[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});
