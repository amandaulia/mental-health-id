import type { ContactDetail } from "@/types";

const BOOK_PRIORITY: ContactDetail["type"][] = [
  "Application",
  "WhatsApp",
  "Phone",
  "Instagram",
  "Website",
];

const LEARN_PRIORITY: ContactDetail["type"][] = [
  "Website",
  "Application",
  "Instagram",
  "WhatsApp",
  "Phone",
];

function contactToUrl(contact: ContactDetail): string | null {
  if (contact.link) return contact.link;
  const v = (contact.value || "").trim();
  if (!v) return null;
  switch (contact.type) {
    case "Phone":
      return `tel:${v.replace(/\s+/g, "")}`;
    case "WhatsApp":
      return `https://wa.me/${v.replace(/[^\d]/g, "")}`;
    case "Instagram":
      return `https://instagram.com/${v.replace(/^@/, "")}`;
    case "Website":
      return /^https?:/i.test(v) ? v : `https://${v}`;
    default:
      return null;
  }
}

function pickByPriority(
  contacts: ContactDetail[] | undefined,
  priority: ContactDetail["type"][],
): string | null {
  if (!contacts || contacts.length === 0) return null;
  for (const type of priority) {
    const found = contacts.find((c) => c?.type === type);
    if (found) {
      const url = contactToUrl(found);
      if (url) return url;
    }
  }
  return null;
}

export function pickBookingCta(contacts: ContactDetail[] | undefined): string | null {
  return pickByPriority(contacts, BOOK_PRIORITY);
}

export function pickLearnMoreCta(contacts: ContactDetail[] | undefined): string | null {
  return pickByPriority(contacts, LEARN_PRIORITY);
}

/**
 * Apply Book Now / Learn More fallbacks to a service-like object,
 * filling missing bookingUrl/learnMoreUrl from the parent's contacts.
 */
export function withCtaFallback<T extends { bookingUrl?: string; learnMoreUrl?: string }>(
  service: T,
  parentContacts: ContactDetail[] | undefined,
): T {
  const bookingUrl = service.bookingUrl || pickBookingCta(parentContacts) || undefined;
  const learnMoreUrl = service.learnMoreUrl || pickLearnMoreCta(parentContacts) || undefined;
  return { ...service, bookingUrl, learnMoreUrl };
}