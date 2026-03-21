import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { address, city, state } = await req.json();
    
    if (!city && !address) {
      return new Response(JSON.stringify({ error: "Address or city required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build a full address string for geocoding
    const parts = [address, city, state, "USA"].filter(Boolean);
    const query = encodeURIComponent(parts.join(", "));

    // Use OpenStreetMap Nominatim (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      {
        headers: {
          "User-Agent": "OpenChair/1.0 (contact@openchair.app)",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const results = await response.json();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ latitude: null, longitude: null, found: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lat, lon } = results[0];

    return new Response(
      JSON.stringify({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        found: true,
        display_name: results[0].display_name,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Geocode error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Geocoding failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
