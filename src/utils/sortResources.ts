import { completenessScore } from "./completeness";
import type { SortBy } from "../types";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type PopularityMap = Record<string, number>;

type SortableLocation = { latitude?: number | string | null; longitude?: number | string | null } | null;

interface SortableResource {
  type?: string;
  id?: string | number;
  name?: string;
  services?: Array<{ price?: number | null } | null>;
  locations?: SortableLocation[];
}

const resourcePopularityKey = (resource: SortableResource): string => {
  const type = resource.type === "bureau" ? "institution" : resource.type;
  return `${type}:${resource.id}`;
};

const compareByName = (a: SortableResource, b: SortableResource) =>
  String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });

const compareFallback = (a: SortableResource, b: SortableResource) => {
  const completenessDelta = completenessScore(b) - completenessScore(a);
  if (completenessDelta !== 0) return completenessDelta;
  return compareByName(a, b);
};

export const getLowestServicePrice = (resource: SortableResource): number | null => {
  const prices = (resource.services || [])
    .map((service) => service?.price)
    .filter((price: unknown): price is number => typeof price === "number" && !Number.isNaN(price));

  return prices.length > 0 ? Math.min(...prices) : null;
};

export const getHighestServicePrice = (resource: SortableResource): number | null => {
  const prices = (resource.services || [])
    .map((service) => service?.price)
    .filter((price: unknown): price is number => typeof price === "number" && !Number.isNaN(price));

  return prices.length > 0 ? Math.max(...prices) : null;
};

const toCoordinate = (location: SortableLocation): Coordinates | null => {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
};

export const getDistanceKm = (from: Coordinates, to: Coordinates): number => {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

export const getNearestDistanceKm = (resource: SortableResource, userLocation?: Coordinates | null): number | null => {
  if (!userLocation) return null;

  const distances = (resource.locations || [])
    .map(toCoordinate)
    .filter((location: Coordinates | null): location is Coordinates => Boolean(location))
    .map((location: Coordinates) => getDistanceKm(userLocation, location));

  return distances.length > 0 ? Math.min(...distances) : null;
};

interface SortResourcesOptions {
  sortBy: SortBy;
  popularity: PopularityMap;
  userLocation?: Coordinates | null;
}

export const sortResources = <T extends SortableResource>(resources: T[], options: SortResourcesOptions): T[] => {
  const { sortBy, popularity, userLocation } = options;

  return [...resources].sort((a, b) => {
    if (sortBy === "popular") {
      const popularityDelta = (popularity[resourcePopularityKey(b)] || 0) - (popularity[resourcePopularityKey(a)] || 0);
      if (popularityDelta !== 0) return popularityDelta;
      return compareFallback(a, b);
    }

    if (sortBy === "name") {
      return compareByName(a, b);
    }

    if (sortBy === "lowestPrice" || sortBy === "highestPrice") {
      const aPrice = sortBy === "lowestPrice" ? getLowestServicePrice(a) : getHighestServicePrice(a);
      const bPrice = sortBy === "lowestPrice" ? getLowestServicePrice(b) : getHighestServicePrice(b);

      if (aPrice == null && bPrice == null) return compareFallback(a, b);
      if (aPrice == null) return 1;
      if (bPrice == null) return -1;

      const priceDelta = sortBy === "lowestPrice" ? aPrice - bPrice : bPrice - aPrice;
      if (priceDelta !== 0) return priceDelta;
      return compareFallback(a, b);
    }

    const aDistance = getNearestDistanceKm(a, userLocation);
    const bDistance = getNearestDistanceKm(b, userLocation);

    if (aDistance == null && bDistance == null) return compareFallback(a, b);
    if (aDistance == null) return 1;
    if (bDistance == null) return -1;

    const distanceDelta = aDistance - bDistance;
    if (distanceDelta !== 0) return distanceDelta;
    return compareFallback(a, b);
  });
};
