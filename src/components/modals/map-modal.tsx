import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MapPin from "@/components/maps/map-pin";

interface MapModalProps {
  lat?: number | null;
  lng?: number | null;
  title?: string;
}

const MapModal: React.FC<MapModalProps> = ({ lat, lng, title = "Map" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const isLocationValid = lat != null && lng != null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex items-center ml-2">
          <Map
            className={`h-5 w-5 ${
              isLocationValid
                ? "cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isLocationValid) {
                setIsOpen(true);
              }
            }}
          />
        </div>
      </DialogTrigger>
      {isLocationValid && (
        <DialogContent
          className="max-w-[1000px] h-[70vh] bg-white dark:bg-black"
          onPointerDownOutside={(e) => {
            e.preventDefault();
            handleOpenChange(false);
          }}
          onInteractOutside={(e) => {
            e.preventDefault();
            handleOpenChange(false);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader className="flex justify-center items-center">
            <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="h-[60vh] w-full">
            <MapPin lat={lat!} lng={lng!} height="100%" />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default MapModal;
