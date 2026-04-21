"use client";

import { useEffect, useRef } from "react";

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  make: string;
  model: string;
  lat: number | null;
  lng: number | null;
  speed: number;
  direction: number;
  lastSeen: string | null;
  online: boolean;
}

interface VehicleMapProps {
  vehicles: Vehicle[];
}

export function VehicleMap({ vehicles }: VehicleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix leaflet default icon path issue in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [45.9432, 24.9668], // Romania center
        zoom: 7,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when vehicles change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      vehicles.forEach((vehicle) => {
        if (vehicle.lat === null || vehicle.lng === null) return;

        const color = vehicle.online ? "#22c55e" : "#94a3b8";
        const svgIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
            <ellipse cx="20" cy="46" rx="8" ry="4" fill="rgba(0,0,0,0.2)"/>
            <path d="M20 2 C10 2, 2 10, 2 20 C2 32, 20 46, 20 46 C20 46, 38 32, 38 20 C38 10, 30 2, 20 2Z"
              fill="${color}" stroke="white" stroke-width="2"/>
            <circle cx="20" cy="20" r="8" fill="white" opacity="0.9"/>
            <path d="M14 22 L14 18 L16 14 L24 14 L26 18 L26 22 Z M16 20 L24 20 M16 17 L24 17
              M15 22 L17 22 M23 22 L25 22"
              fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
          </svg>`;

        const icon = L.divIcon({
          html: svgIcon,
          iconSize: [40, 50],
          iconAnchor: [20, 46],
          popupAnchor: [0, -46],
          className: "",
        });

        const formatTime = (iso: string | null) => {
          if (!iso) return "—";
          return new Date(iso).toLocaleString("ro-RO", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          });
        };

        const popupContent = `
          <div style="font-family: sans-serif; min-width: 160px;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #0f172a;">${vehicle.plate}</div>
            ${vehicle.make || vehicle.model ? `<div style="color: #64748b; font-size: 12px; margin-bottom: 8px;">${[vehicle.make, vehicle.model].filter(Boolean).join(" ")}</div>` : ""}
            <div style="display:grid; grid-template-columns: auto 1fr; gap: 2px 8px; font-size: 12px;">
              <span style="color:#64748b;">Viteză</span><span style="font-weight:600;">${vehicle.speed} km/h</span>
              <span style="color:#64748b;">Status</span><span style="color:${vehicle.online ? "#22c55e" : "#94a3b8"}; font-weight:600;">${vehicle.online ? "Online" : "Offline"}</span>
              <span style="color:#64748b;">Ultimul semnal</span><span>${formatTime(vehicle.lastSeen)}</span>
            </div>
          </div>`;

        const existing = markersRef.current.get(vehicle.id);
        if (existing) {
          existing.setLatLng([vehicle.lat!, vehicle.lng!]);
          existing.setIcon(icon);
          existing.setPopupContent(popupContent);
        } else {
          const marker = L.marker([vehicle.lat!, vehicle.lng!], { icon })
            .addTo(map)
            .bindPopup(popupContent);
          markersRef.current.set(vehicle.id, marker);
        }
      });

      // Fit bounds to all vehicle positions on first load
      const positioned = vehicles.filter((v) => v.lat !== null && v.lng !== null);
      if (positioned.length > 0 && markersRef.current.size === positioned.length) {
        const bounds = L.latLngBounds(positioned.map((v) => [v.lat!, v.lng!]));
        map.fitBounds(bounds, { padding: [60, 60] });
      }
    });
  }, [vehicles]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
      style={{ minHeight: "400px" }}
    />
  );
}
