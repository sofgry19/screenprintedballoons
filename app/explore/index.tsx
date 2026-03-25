"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, use } from "react";
import { GeoCoords, HomePageParams, LocationData } from "../types";
import { ExploreMap } from "./ExploreMap";
import { LocationModal } from "./LocationModal";
import { SocialLink } from "./SocialLink";
import { getLocationData } from "../supabase/client";
import { FONT_RAMPART, FONT_MON, NYC_COORDS } from "../lib/constants";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";

export const HomePage = ({
  searchParams,
}: {
  searchParams: Promise<HomePageParams>;
}) => {
  const params = use(searchParams);
  const [initCoords] = useState<GeoCoords>({
    longitude: params.lng ? Number(params.lng) : NYC_COORDS.longitude,
    latitude: params.lat ? Number(params.lat) : NYC_COORDS.latitude,
  });
  const goHomeRef = useRef<HTMLDivElement>(null);

  const [locData, setLocData] = useState<LocationData[]>();
  useEffect(() => {
    async function setupLocations() {
      const data = await getLocationData();
      setLocData(data);
    }
    setupLocations();
  }, []);

  const [selectedLoc, setSelectedLoc] = useState<LocationData | undefined>(
    undefined,
  );

  return (
    <div
      className={`fixed w-full h-full flex flex-col bg-white overflow-hidden ${FONT_MON.className}`}
    >
      {selectedLoc && (
        <LocationModal
          location={selectedLoc}
          onBgClick={() => {
            setSelectedLoc(undefined);
          }}
        />
      )}
      <div className={"z-10 p-4 flex justify-between items-center shadow-lg"}>
        <h1
          className={`${FONT_RAMPART.className} -mt-2 text-xl md:text-3xl lg:text-4xl text-pink-400`}
        >
          {"Sofia's Balloon Map"}
        </h1>
        <div className="-mx-4 flex justify-evenly items-center divide-x-2 divide-gray-300 text-xs md:text-sm lg:text-lg font-medium text-gray-300">
          <SocialLink
            href="https://www.linkedin.com/in/sofiagry/"
            text="LINKEDIN"
          />
          <SocialLink href="https://www.instagram.com/astralsofia/" text="IG" />
        </div>
      </div>
      <div className="relative flex-1 w-full overflow-hidden">
        <ExploreMap
          initCoords={initCoords}
          goHomeRef={goHomeRef}
          onMarkerClick={(data: LocationData) => setSelectedLoc(data)}
          posters={locData ?? []}
        />
        <button
          className="absolute left-4 bottom-4 p-2 rounded-lg bg-pink-400 cursor-pointer hover:outline-2 hover:outline-white hover:bg-pink-300 transition-color duration-200"
          onClick={() => {
            goHomeRef.current?.click();
          }}
        >
          <div className="w-min flex items-center gap-x-1 text-white whitespace-nowrap">
            <ArrowsPointingInIcon className="w-4 h-4 md:w-6 md:h-6 stroke-2" />
            <span className="px-1 text-sm md:text-lg font-bold">
              {"My Location"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
