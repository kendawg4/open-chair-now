import { supabase } from "@/integrations/supabase/client";

export async function geocodeAddress(address: string | null, city: string | null, state: string | null): Promise<{ latitude: number; longitude: number } | null> {
  if (!city && !address) return null;

  try {
    const { data, error } = await supabase.functions.invoke("geocode", {
      body: { address, city, state },
    });

    if (error) {
      console.error("Geocode function error:", error);
      return null;
    }

    if (data?.found && data.latitude && data.longitude) {
      return { latitude: data.latitude, longitude: data.longitude };
    }

    return null;
  } catch (e) {
    console.error("Geocode failed:", e);
    return null;
  }
}
