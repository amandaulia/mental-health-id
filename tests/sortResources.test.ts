import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { sortResources } from "../src/utils/sortResources";

const resources = [
  {
    type: "practitioner",
    id: 1,
    name: "Charlie",
    city: "Jakarta",
    services: [{ price: 300000 }, { price: null }],
    locations: [{ latitude: -6.2, longitude: 106.8 }],
  },
  {
    type: "institution",
    id: 2,
    name: "Alpha",
    city: "Bandung",
    services: [{ price: 100000 }, { price: 500000 }],
    locations: [{ latitude: -6.9, longitude: 107.6 }],
  },
  {
    type: "institution",
    id: 3,
    name: "Bravo",
    city: "Surabaya",
    services: [{ price: null }],
    locations: [],
  },
];

describe("sortResources", () => {
  test("sorts popular by stored click count", () => {
    const sorted = sortResources(resources, {
      sortBy: "popular",
      popularity: { "institution:2": 5, "practitioner:1": 2 },
    });

    assert.deepEqual(sorted.map((resource) => resource.id), [2, 1, 3]);
  });

  test("sorts by name alphabetically", () => {
    const sorted = sortResources(resources, { sortBy: "name", popularity: {} });

    assert.deepEqual(sorted.map((resource) => resource.name), ["Alpha", "Bravo", "Charlie"]);
  });

  test("sorts by lowest price with null-only prices last", () => {
    const sorted = sortResources(resources, { sortBy: "lowestPrice", popularity: {} });

    assert.deepEqual(sorted.map((resource) => resource.id), [2, 1, 3]);
  });

  test("sorts by highest price with null-only prices last", () => {
    const sorted = sortResources(resources, { sortBy: "highestPrice", popularity: {} });

    assert.deepEqual(sorted.map((resource) => resource.id), [2, 1, 3]);
  });

  test("sorts by nearest distance and leaves missing coordinates last", () => {
    const sorted = sortResources(resources, {
      sortBy: "nearest",
      popularity: {},
      userLocation: { latitude: -6.19, longitude: 106.82 },
    });

    assert.deepEqual(sorted.map((resource) => resource.id), [1, 2, 3]);
  });
});
