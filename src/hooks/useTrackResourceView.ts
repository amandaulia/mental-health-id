import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type ResourceType = "practitioner" | "institution";

/**
 * Increments the popularity counter once per session for a given resource.
 * Fires on detail-page mount so deep links / SEO traffic are also counted
 * (card clicks alone miss every direct visit).
 */
export const useTrackResourceView = (
  resourceType: ResourceType,
  resourceId: number | null | undefined,
) => {
  useEffect(() => {
    if (!resourceId || !Number.isFinite(resourceId)) return;

    const key = `viewed:${resourceType}:${resourceId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage may be unavailable (private mode) — still track once.
    }

    void supabase
      .rpc("increment_resource_click", {
        resource_type_input: resourceType,
        resource_id_input: resourceId,
      })
      .then(({ error }) => {
        if (error) console.warn("[analytics] view increment failed", error);
      });
  }, [resourceType, resourceId]);
};