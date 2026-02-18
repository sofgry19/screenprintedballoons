"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { use, useRef, useState } from "react";
import { GeoCoords, HomePageParams, MapEntryData } from "../types";
import { ExploreMap } from "./ExploreMap";
import { MapEntryModal } from "./MapEntryModal";

// TO DO:
// - Account for movable toolbar spacing on mobile

const NYC_COORDS: GeoCoords = { longitude: -73.935242, latitude: 40.73061 };

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
    <div className="h-screen w-screen flex flex-col bg-slate-700 overflow-hidden">
      {currentEntry && (
        <MapEntryModal
          entryData={currentEntry}
          onBgClick={() => {
            setCurrentEntry(undefined);
          }}
        />
      )}
      <div className="p-2 text-xl lg:text-4xl text-center">
        Screen Printed Balloons!
      </div>
      <div className="flex-1 flex justify-center items-center h-[500px] w-full overflow-hidden">
        <ExploreMap
          initCoords={initCoords}
          goHomeRef={goHomeRef}
          onMarkerClick={(data: MapEntryData) => setCurrentEntry(data)}
        />
      </div>
      <div className="p-4 flex justify-center">
        <button
          className="text-md py-2 px-4 rounded-full bg-slate-500 cursor-pointer"
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
