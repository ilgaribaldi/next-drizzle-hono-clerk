"use client";

import { useGetPresalePreview } from "@/features/presales/api/use-get-presale-preview";
import Loader from "@/components/loader";
import Error from "@/components/ui/error";
import { ResponseType } from "@/features/presales/api/use-get-presale-preview";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Currency from "@/components/ui/currency";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cn from "classnames";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

interface InfoWindowContentProps {
  presaleId: string;
  developerId?: string;
}

export const InfoWindowContent = ({
  presaleId,
  developerId,
}: InfoWindowContentProps) => {
  const { orgId } = useAuth();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const { theme } = useTheme();
  const {
    data: presalePreview,
    isLoading,
    error,
  } = useGetPresalePreview(presaleId);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div
      style={{
        width: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "30px",
      }}
    >
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error message={error.message} />
      ) : (
        <>
          <div style={{ marginBottom: "0px", textAlign: "center" }}>
            <div className="flex justify-between space-x-4">
              <div className="space-y-1">
                <Link
                  href={
                    developerId
                      ? `/developers/${developerId}/presales/${presalePreview?.data.id}`
                      : `/staff/${orgId}/presales/${presalePreview?.data.id}`
                  }
                  className="text-sm font-semibold hover:text-blue-500 hover:underline"
                >
                  <h4
                    className={cn(
                      "text-sm font-semibold",
                      theme === "dark" ? "text-black hover:text-blue-500" : ""
                    )}
                  >
                    {truncateText(presalePreview?.data.name || "", 40)}
                  </h4>
                </Link>
                <p className="text-sm">
                  <span className="text-gray-500">
                    {presalePreview?.data.availableUnits || 0}{" "}
                  </span>
                  <span className="font-bold text-green-500">disponibles</span>
                  {" - "}
                  <span className="text-gray-500">
                    {presalePreview?.data.reservedUnits || 0}{" "}
                  </span>
                  <span className="font-bold text-gray-500">reservadas</span>
                  {" - "}
                  <span className="text-gray-500">
                    {presalePreview?.data.soldUnits || 0}{" "}
                  </span>
                  <span className="font-bold text-yellow-500">vendidas</span>
                </p>
                <div className="sm:block hidden">
                  Desde{" "}
                  <Currency
                    value={presalePreview?.data.startingPrice ?? 0}
                    className="text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {presalePreview?.data.images &&
            presalePreview.data.images.length > 0 ? (
              <div className="relative h-40 group hover:cursor-pointer w-full">
                <Carousel setApi={setApi}>
                  <CarouselContent>
                    {presalePreview.data.images.map((image, index) => (
                      <CarouselItem key={image.id}>
                        <div className="relative h-[160px]">
                          <Image
                            src={image.url}
                            alt="Presale image"
                            fill
                            priority={true}
                            className="rounded-lg object-cover cursor-pointer transition-transform duration-500 ease-in-out"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute inset-0 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        api?.scrollPrev();
                      }}
                      disabled={current === 0}
                      className="text-white p-1 bg-white/70 rounded-full ml-2 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        api?.scrollNext();
                      }}
                      disabled={
                        current === presalePreview.data.images.length - 1
                      }
                      className="text-white p-1 bg-white/70 rounded-full mr-2 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex z-10">
                    {presalePreview.data.images.map((_, idx) => (
                      <Dot
                        key={idx}
                        isActive={current === idx}
                        onClick={() => api?.scrollTo(idx)}
                      />
                    ))}
                  </div>
                </Carousel>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No hay imágenes disponibles
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const Dot = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => (
  <span
    className={`h-2 w-2 mx-1 rounded-full cursor-pointer transition-colors ${
      isActive ? "bg-blue-500" : "bg-gray-300 hover:bg-gray-400"
    }`}
    onClick={onClick}
  />
);

export default InfoWindowContent;
