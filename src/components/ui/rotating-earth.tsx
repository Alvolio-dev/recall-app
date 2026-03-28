"use client";

import { useEffect, useRef, useState } from "react";
import { geoOrthographic, geoPath, geoBounds, geoGraticule } from "d3-geo";
import { timer } from "d3-timer";

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function RotatingEarth({ width = 500, height = 500, className = "" }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const containerWidth = Math.min(width, window.innerWidth - 40);
    const containerHeight = Math.min(height, window.innerHeight - 100);
    const radius = Math.min(containerWidth, containerHeight) / 2.5;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const projection = geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = geoPath().projection(projection).context(context);

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    };

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry;
      if (geometry.type === "Polygon") {
        if (!pointInPolygon(point, geometry.coordinates[0])) return false;
        for (let i = 1; i < geometry.coordinates.length; i++) {
          if (pointInPolygon(point, geometry.coordinates[i])) return false;
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) { inHole = true; break; }
            }
            if (!inHole) return true;
          }
        }
      }
      return false;
    };

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = [];
      const bounds = geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      const stepSize = dotSpacing * 0.08;
      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) dots.push(point);
        }
      }
      return dots;
    };

    interface DotData { lng: number; lat: number; }
    const allDots: DotData[] = [];
    let landFeatures: any;

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);
      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      // Globe bg
      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "#f4f4f5";
      context.fill();
      context.strokeStyle = "#d4d4d8";
      context.lineWidth = 1 * scaleFactor;
      context.stroke();

      if (landFeatures) {
        // Graticule
        const graticule = geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = "#d4d4d8";
        context.lineWidth = 0.5 * scaleFactor;
        context.globalAlpha = 0.3;
        context.stroke();
        context.globalAlpha = 1;

        // Land outlines
        context.beginPath();
        landFeatures.features.forEach((feature: any) => { path(feature); });
        context.strokeStyle = "#a1a1aa";
        context.lineWidth = 0.8 * scaleFactor;
        context.stroke();

        // Halftone dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (projected && projected[0] >= 0 && projected[0] <= containerWidth && projected[1] >= 0 && projected[1] <= containerHeight) {
            context.beginPath();
            context.arc(projected[0], projected[1], 1 * scaleFactor, 0, 2 * Math.PI);
            context.fillStyle = "#10b981";
            context.globalAlpha = 0.4;
            context.fill();
            context.globalAlpha = 1;
          }
        });
      }
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        );
        if (!response.ok) throw new Error("Failed to load");
        landFeatures = await response.json();
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16);
          dots.forEach(([lng, lat]) => allDots.push({ lng, lat }));
        });
        render();
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    const rotation: [number, number] = [0, 0];
    let autoRotate = true;

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += 0.3;
        projection.rotate(rotation);
        render();
      }
    };

    const rotationTimer = timer(rotate);

    const startDrag = (startX: number, startY: number) => {
      autoRotate = false;
      const startRotation: [number, number] = [...rotation];

      const onMove = (x: number, y: number) => {
        rotation[0] = startRotation[0] + (x - startX) * 0.5;
        rotation[1] = Math.max(-90, Math.min(90, startRotation[1] - (y - startY) * 0.5));
        projection.rotate(rotation);
        render();
      };

      const onEnd = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", onEnd);
        setTimeout(() => { autoRotate = true; }, 10);
      };

      const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", onEnd);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", onEnd);
    };

    const handleMouseDown = (e: MouseEvent) => startDrag(e.clientX, e.clientY);
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    loadWorldData();

    return () => {
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
    };
  }, [width, height]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto touch-none"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}
