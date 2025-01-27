"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMapStore } from "@/stores/map-store";
import { CountryType, RegionType } from "@/types";
import InfoTooltip from "@/components/info-tooltip";

const MapToolbar = () => {
  const { mapOptions, regionFilter, setMapOptions, setRegionFilter } =
    useMapStore();

  const handleGroupingToggle = (checked: boolean) => {
    setMapOptions({ ...mapOptions, isGroupModeActive: checked });
  };

  const handleRegionFilterToggle = (checked: boolean) => {
    setRegionFilter({
      ...regionFilter,
      isRegionFilterActive: checked,
      // Reset region IDs when turning off filter
      regionIds: checked ? regionFilter.regionIds : [],
    });
  };

  const handleRegionTypeChange = (value: string) => {
    setRegionFilter({ ...regionFilter, regionType: value as RegionType });
  };

  const handleCountryChange = (value: string) => {
    setRegionFilter({ ...regionFilter, country: value as CountryType });
  };

  const handleVisibilityModeToggle = (checked: boolean) => {
    setMapOptions({ ...mapOptions, isVisibilityModeActive: checked });
  };

  return (
    <Card className="p-4  overflow-hidden flex items-center rounded-none dark:bg-zinc-900">
      <div className="flex flex-wrap items-center gap-4 w-full">
        <div className="flex items-center space-x-2">
          <Switch
            id="group-pins"
            checked={mapOptions.isGroupModeActive}
            onCheckedChange={handleGroupingToggle}
          />
          <Label htmlFor="group-pins" className="text-xs flex items-center">
            <span className="mr-1">Agrupar cercanas</span>
            <InfoTooltip message="Agrupa oportunidades cercanas para facilitar la visualización" />
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="visibility-mode"
            checked={mapOptions.isVisibilityModeActive}
            onCheckedChange={handleVisibilityModeToggle}
          />
          <Label
            htmlFor="visibility-mode"
            className="text-xs flex items-center"
          >
            <span className="mr-1">Por visibilidad</span>
            <InfoTooltip message="Cambia color de oportunidades por visibilidad en Yeyar" />
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="activate-regions"
            checked={regionFilter.isRegionFilterActive}
            onCheckedChange={handleRegionFilterToggle}
          />
          <Label
            htmlFor="activate-regions"
            className="text-xs flex items-center"
          >
            <span className="mr-1">Filtrar por región</span>
            <InfoTooltip message="Habilita filtro por región en el mapa" />
          </Label>
        </div>

        {regionFilter.isRegionFilterActive && (
          <>
            <Select
              value={regionFilter.regionType}
              onValueChange={handleRegionTypeChange}
            >
              <SelectTrigger className="w-[120px] h-6 text-xs">
                <SelectValue placeholder="Select region type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="COUNTRY"
                  disabled
                  className="text-xs text-gray-400"
                >
                  País
                </SelectItem>
                <SelectItem value="STATE" className="text-xs">
                  Estado
                </SelectItem>
                <SelectItem
                  value="CITY"
                  disabled
                  className="text-xs text-gray-400"
                >
                  Ciudad
                </SelectItem>
                <SelectItem value="DISTRICT" className="text-xs text-gray-400">
                  Distrito/Municipio
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              defaultValue="MX"
              value={regionFilter.country}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="w-[120px] h-6 text-xs">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MX" className="text-xs">
                  Mexico
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>
    </Card>
  );
};

export default MapToolbar;
