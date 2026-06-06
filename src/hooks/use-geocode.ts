import { supabase } from "@/integrations/supabase/client";

/**
 * Geocode an address via the `geocode` edge function.
 *
 * Hardened so onboarding never hangs:
 *  - Times out after `timeoutMs` (default 4s) and resolves to null.
 *  - Any error (function not deployed, network, CORS, etc.) resolves to null.
 *
 * Callers should treat a null result as "no coordinates yet" — geocoding can
 * be retried later from the profile edit screen.
 */
export async function geocodeAddress(
  address: string | null,
  city: string | null,
  state: string | null,
  timeoutMs = 4000
): Promise<{ latitude: number; longitude: number } | null> {
  if (!city && !address) return null;

  const invocation = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("geocode", {
        body: { address, city, state },
      });
      if (error) {
        console.warn("Geocode function error:", error);
        return null;
      }
      if (data?.found && data.latitude && data.longitude) {
        return { latitude: data.latitude, longitude: data.longitude };
      }
      return null;
    } catch (e) {
      console.warn("Geocode failed:", e);
      return null;
    }
  })();

  const timeout = new Promise<null>((resolve) =>
    setTimeout(() => {
      console.warn(`Geocode timed out after ${timeoutMs}ms`);
      resolve(null);
    }, timeoutMs)
  );

  return Promise.race([invocation, timeout]);
}
