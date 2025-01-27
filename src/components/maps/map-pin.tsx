"use client";

import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Libraries,
} from "@react-google-maps/api";
import { darkModeStyle } from "./map-styles";
import { useTheme } from "next-themes";

const libraries: Libraries = ["places"];

interface MapPinProps {
  lat: number;
  lng: number;
  height?: string;
  zoom?: number;
}

const Map: React.FC<MapPinProps> = ({
  lat,
  lng,
  height = "300px",
  zoom = 15,
}) => {
  const center = { lat, lng };
  const { theme } = useTheme();
  const mapStyle = theme === "dark" ? darkModeStyle : [];

  return (
    <GoogleMap
      zoom={zoom}
      center={center}
      mapContainerStyle={{ height, width: "100%" }}
      options={{ styles: mapStyle }}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

const MapPin: React.FC<MapPinProps> = ({ lat, lng, height, zoom }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map lat={lat} lng={lng} height={height} zoom={zoom} />;
};

export default MapPin;
