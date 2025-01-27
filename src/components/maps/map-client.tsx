"use client";

import PresalesMapStaff from "./presales-map-staff";
import PresalesMapOrg from "./presales-map-org";
import MapToolbar from "./map-toolbar";

interface MapClientProps {
  developerId?: string;
}

export default function MapClient({ developerId }: MapClientProps) {
  return (
    <div>
      <MapToolbar />
      {developerId ? (
        <PresalesMapOrg
          height="calc(100vh - 110px)"
          type="static"
          developerId={developerId}
        />
      ) : (
        <PresalesMapStaff height="calc(100vh - 110px)" type="static" />
      )}
    </div>
  );
}
