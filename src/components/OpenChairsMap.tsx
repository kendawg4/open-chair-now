import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { categoryLabels } from "@/lib/constants";
import type { ProWithProfile } from "@/hooks/use-data";

interface OpenChairsMapProps {
  professionals: ProWithProfile[];
  className?: string;
}

export function OpenChairsMap({ professionals, className }: OpenChairsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const openPros = professionals.filter(
    (p) =>
      ["open-chair", "available-now", "last-minute"].includes(p.status) &&
      p.latitude &&
      p.longitude
  );

  useEffect(() => {
    if (!mapRef.current || openPros.length === 0) return;

    let L: any;
    const initMap = async () => {
      L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const center: [number, number] = [
        openPros.reduce((s, p) => s + (p.latitude || 0), 0) / openPros.length,
        openPros.reduce((s, p) => s + (p.longitude || 0), 0) / openPros.length,
      ];

      const map = L.map(mapRef.current!, {
        zoomControl: false,
        attributionControl: false,
      }).setView(center, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      openPros.forEach((pro) => {
        const name = pro.display_name || pro.business_name || pro.full_name;
        const cat = categoryLabels[pro.category] || pro.category;

        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background: hsl(160, 84%, 39%);
            color: white;
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 4px;
          ">🪑 ${name}</div>`,
          iconSize: [0, 0],
          iconAnchor: [50, 15],
        });

        L.marker([pro.latitude, pro.longitude], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="text-align:center;font-family:sans-serif;">
              <strong style="font-size:13px;">${name}</strong><br/>
              <span style="font-size:11px;color:#666;">${cat}</span><br/>
              <a href="/pro/${pro.id}" style="color:hsl(160,84%,39%);font-size:11px;font-weight:600;">View Profile →</a>
            </div>`
          );
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [openPros.length]);

  if (openPros.length === 0) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 text-center">
        <MapPin className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No open chairs nearby right now</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        ref={mapRef}
        className="w-full h-[280px] rounded-2xl overflow-hidden border border-border"
      />
      <div className="mt-3 space-y-2">
        {openPros.slice(0, 5).map((pro) => {
          const name = pro.display_name || pro.business_name || pro.full_name;
          return (
            <Link
              key={pro.id}
              to={`/pro/${pro.id}`}
              className="flex items-center gap-3 rounded-xl bg-card border border-border p-3 hover:border-primary/30 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {pro.avatar_url ? (
                  <img src={pro.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-primary text-sm">
                    {name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {categoryLabels[pro.category] || pro.category}
                  {pro.city && ` · ${pro.city}`}
                </p>
              </div>
              <StatusBadge status={pro.status} size="sm" pulse />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
