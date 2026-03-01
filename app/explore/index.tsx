"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { use, useEffect, useRef, useState } from "react";
import { GeoCoords, HomePageParams, LocationData } from "../types";
import { ExploreMap } from "./ExploreMap";
import { LocationModal } from "./LocationModal";
import { SocialLink } from "./SocialLink";
import { getLocationData } from "../supabase/client";
import { FONT_LUCKY, NYC_COORDS } from "../lib/constants";

// TO DO:
// - Account for movable toolbar spacing on mobile


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
    <div className="h-screen w-screen flex flex-col bg-pink-100 overflow-hidden">
      {selectedLoc && (
        <LocationModal
          location={selectedLoc}
          onBgClick={() => {
            setSelectedLoc(undefined);
          }}
        />
      )}
      <div
        className={
          "p-8 text-xl lg:text-4xl text-center flex justify-evenly items-center text-red-800"
        }
      >
        <SocialLink href="https://www.linkedin.com/in/sofiagry/" text="LinkedIn!" />
        <h1 className={FONT_LUCKY.className}>Balloon Map!</h1>
        <SocialLink href="https://www.instagram.com/astralsofia/" text="IG!" />
      </div>
      <div className="flex-1 flex justify-center items-center h-[500px] w-full overflow-hidden">
        <ExploreMap
          initCoords={initCoords}
          goHomeRef={goHomeRef}
          onMarkerClick={(data: LocationData) => setSelectedLoc(data)}
          posters={locData ?? []}
        />
      </div>
      <div className="p-4 flex justify-center items-center">
        <button
          className="text-md py-2 px-4 rounded-lg bg-pink-200 cursor-pointer items-center"
          onClick={() => {
            goHomeRef.current?.click();
          }}
        >
          {`Go to my location`}
        </button>
      </div>
    </div>
  );
};
