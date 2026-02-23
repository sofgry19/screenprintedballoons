"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { use, useRef, useState } from "react";
import { GeoCoords, HomePageParams, MapEntryData } from "../types";
import { ExploreMap } from "./ExploreMap";
import { MapEntryModal } from "./MapEntryModal";
import { LinkedIn } from "./LinkedIn";
import { Instagram } from "./Instagram";
import { Luckiest_Guy } from 'next/font/google'

// TO DO:
// - Account for movable toolbar spacing on mobile

const NYC_COORDS: GeoCoords = { longitude: -73.935242, latitude: 40.73061 };

const lucky  = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
})

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
  const [currentEntry, setCurrentEntry] = useState<MapEntryData | undefined>(
    undefined,
  );
  const goHomeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen w-screen flex flex-col bg-pink-100 overflow-hidden">
      {currentEntry && (
        <MapEntryModal
          entryData={currentEntry}
          onBgClick={() => {
            setCurrentEntry(undefined);
          }}
        />
      )}
      <div className={"p-8 text-xl lg:text-4xl text-center flex justify-evenly items-center text-red-800"}>
        <Instagram/><h1 className={lucky.className}>Balloon Map!</h1><LinkedIn/>
      </div>
      <div className="flex-1 flex justify-center items-center h-[500px] w-full overflow-hidden">
        <ExploreMap
          initCoords={initCoords}
          goHomeRef={goHomeRef}
          onMarkerClick={(data: MapEntryData) => setCurrentEntry(data)}
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
