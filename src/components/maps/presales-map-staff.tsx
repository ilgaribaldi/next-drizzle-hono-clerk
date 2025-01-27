"use client";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  Libraries,
  Polygon,
  MarkerClusterer,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useMemo, useRef, useEffect } from "react";
import * as React from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { darkModeStyle } from "@/components/maps/map-styles";
import { getGeoJsonCoords } from "@/app/utils/get-geojson-coords";
import { useTheme } from "next-themes";
import {
  defaultOptions,
  hoverOptions,
  selectedOptions,
} from "@/data/geometry-options";
import { useMapStore } from "@/stores/map-store";
import { useGetMapPresalesStaff } from "@/features/presales/api/use-get-map-presales-staff";
import Loader from "@/components/loader";
import { useGetRegions } from "@/features/regions/api/use-get-regions";
import { ResponseType } from "@/features/presales/api/use-get-map-presales-staff";
import { PolygonRefs, PolygonGeometry, MultiPolygonGeometry } from "@/types";
import InfoWindowContent from "./info-window-content";

const convertGeoJsonToMapsCoordinates = getGeoJsonCoords();

const libraries: Libraries = ["places"];

interface MapProps {
  height?: string;
  type: "static" | "dynamic";
}

function Map({ height = "600px", type }: MapProps) {
  const theme = useTheme();
  const isDark = theme.theme === "dark";
  const { viewport, regionFilter, mapOptions, setViewport } = useMapStore();
  const { isGroupModeActive, isVisibilityModeActive } = mapOptions;
  const { isRegionFilterActive, regionType, regionIds } = regionFilter;
  const mapRef = useRef<google.maps.Map | null>(null);
  const polygonsRef = useRef<PolygonRefs>({});

  const {
    data: regions,
    isLoading: isRegionsLoading,
    error: regionsError,
  } = useGetRegions({
    country: regionFilter.country,
    type: regionFilter.regionType,
    enabled: isRegionFilterActive,
    limit: "4000",
  });

  const center = useMemo(() => ({ lat: 23.6345, lng: -102.5528 }), []);

  const [selectedRegionIds, setSelectedRegionsIds] = useState<string[]>([]);
  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(
    null
  );
  const [activeMarker, setActiveMarker] = useState<
    ResponseType["data"][number] | null
  >(null);

  const debouncedViewport = useDebounce(viewport, 500);

  const { data: presales } = useGetMapPresalesStaff({
    ...(type === "dynamic" ? debouncedViewport : {}),
    isRegionFilterActive: regionFilter.isRegionFilterActive,
    regionType: regionFilter.regionType,
    regionIds: selectedRegionIds?.length
      ? selectedRegionIds.join(",")
      : undefined,
  });

  const renderPolygons = useMemo(() => {
    if (!regions?.data) return null;

    const handleMouseOver = (id: string) => {
      setSelectedPolygonId(id);
    };

    const handleMouseOut = (id: string) => {
      if (selectedPolygonId === id) {
        setSelectedPolygonId(null);
      }
    };

    const handlePolygonClick = (id: string) => {
      setSelectedPolygonId(selectedPolygonId === id ? null : id);
      setSelectedRegionsIds((currentSelectedRegionIds) => {
        const isAlreadySelected = currentSelectedRegionIds.includes(id);
        if (isAlreadySelected) {
          return currentSelectedRegionIds.filter(
            (existingId) => existingId !== id
          );
        } else {
          return [...currentSelectedRegionIds, id];
        }
      });
    };

    return regions.data.map(({ id, geometry }) => (
      <Polygon
        key={id}
        paths={convertGeoJsonToMapsCoordinates(
          geometry as unknown as PolygonGeometry | MultiPolygonGeometry
        )}
        onLoad={(polygon) => {
          polygonsRef.current[id] = polygon;
        }}
        options={defaultOptions}
        onClick={() => handlePolygonClick(id)}
        onMouseOver={() => handleMouseOver(id)}
        onMouseOut={() => handleMouseOut(id)}
        visible={regionFilter.isRegionFilterActive}
      />
    ));
  }, [regions?.data, regionFilter.isRegionFilterActive, selectedPolygonId]);

  useEffect(() => {
    if (regions?.data) {
      regions.data.forEach(({ id }) => {
        const polygon = polygonsRef.current[id];
        if (polygon) {
          const newOptions = selectedRegionIds.includes(id)
            ? selectedOptions
            : id === selectedPolygonId
              ? hoverOptions
              : { ...defaultOptions, strokeColor: "grey" };
          polygon.setOptions(newOptions);

          if (!regionFilter.isRegionFilterActive) {
            polygon.setVisible(false);
          }
        }
      });
    }
  }, [
    selectedRegionIds,
    selectedPolygonId,
    regions?.data,
    regionFilter.isRegionFilterActive,
  ]);

  const onLoad = (mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
    if (type === "dynamic") {
      mapInstance.addListener("bounds_changed", () => {
        if (mapRef.current) {
          const newBounds = mapRef.current.getBounds();
          if (newBounds) {
            const ne = newBounds.getNorthEast();
            const sw = newBounds.getSouthWest();
            setViewport({
              neLat: ne.lat(),
              neLng: ne.lng(),
              swLat: sw.lat(),
              swLng: sw.lng(),
            });
          }
        }
      });
    }

    mapInstance.addListener("click", () => {
      setActiveMarker(null);
    });
  };

  useEffect(() => {
    if (!regionFilter.isRegionFilterActive) {
      setSelectedRegionsIds([]);
    }
  }, [regionFilter.isRegionFilterActive]);

  const markerRefs = useRef<{ [key: string]: google.maps.Marker }>({});

  const handleMarkerClick = (presale: ResponseType["data"][number]) => {
    setActiveMarker(presale);
  };
  const renderMarkers = useMemo(() => {
    if (!presales?.data) return null;

    const createSvgIcon = (presale: ResponseType["data"][number]) => {
      let fillColor = "#34D399"; // Emerald green color for better contrast
      if (isVisibilityModeActive) {
        fillColor =
          presale.visibleByStaff && presale.visibleByDeveloper
            ? "#4CAF50"
            : "#FFA500";
      }
      const textWidth = Math.min(presale.name.length, 15) * 6; // Estimate text width
      const svgWidth = Math.max(textWidth + 20, 50); // Ensure minimum width of 50
      const svgIcon = `
        <svg width="${svgWidth}" height="20" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="${svgWidth}" height="20" fill="${fillColor}" rx="10" />
          <text x="${
            svgWidth / 2
          }" y="14" font-size="10" fill="#333333" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">${
            presale.name.length > 15
              ? presale.name.substring(0, 15) + "..."
              : presale.name
          }</text>
        </svg>
      `;
      return {
        url:
          "data:image/svg+xml;charset=UTF-8;base64," +
          btoa(unescape(encodeURIComponent(svgIcon))),
        scaledSize: new window.google.maps.Size(svgWidth, 20),
      };
    };

    if (isGroupModeActive) {
      return (
        <MarkerClusterer>
          {(clusterer) => (
            <React.Fragment>
              {presales.data.map((presale) => (
                <Marker
                  key={presale.id}
                  position={{
                    lat: presale.lat ?? 0,
                    lng: presale.lng ?? 0,
                  }}
                  onClick={() => handleMarkerClick(presale)}
                  clusterer={clusterer}
                  icon={createSvgIcon(presale)}
                  onLoad={(marker) => (markerRefs.current[presale.id] = marker)}
                />
              ))}
            </React.Fragment>
          )}
        </MarkerClusterer>
      );
    } else {
      return (
        <React.Fragment>
          {presales.data.map((presale) => (
            <Marker
              key={presale.id}
              position={{
                lat: presale.lat ?? 0,
                lng: presale.lng ?? 0,
              }}
              onClick={() => handleMarkerClick(presale)}
              icon={createSvgIcon(presale)}
              onLoad={(marker) => (markerRefs.current[presale.id] = marker)}
            />
          ))}
        </React.Fragment>
      );
    }
  }, [presales?.data, isGroupModeActive, isVisibilityModeActive]);

  return (
    <GoogleMap
      mapContainerStyle={{ height, width: "100%" }}
      zoom={5}
      options={{
        styles: isDark ? darkModeStyle : undefined,
      }}
      center={center}
      onLoad={onLoad}
    >
      {renderMarkers}
      {renderPolygons}
      {activeMarker && (
        <InfoWindow
          position={{
            lat: activeMarker.lat ?? 0,
            lng: activeMarker.lng ?? 0,
          }}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <InfoWindowContent presaleId={activeMarker.id} />
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const PresalesMapStaff = ({ height, type }: MapProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries: libraries,
  });

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center" style={{ height }}>
        <Loader />
      </div>
    );

  return <Map height={height} type={type} />;
};

export default PresalesMapStaff;
