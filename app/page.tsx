"use client";

import Map, { Marker, useMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from "react";
import { createMockCoords } from "./mock-coords";

interface Geolocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const NYC_COORDS: Geolocation = { longitude: -73.935242, latitude: 40.73061 };

export default function Home() {
  const [currentGeoLoc, setCurrentGeoLoc] = useState<
    { latitude: number; longitude: number; accuracy: number } | undefined
  >(undefined);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        // Fetch data from API with given latitude and longitude
        setCurrentGeoLoc({ latitude, longitude, accuracy });
      });
    }
  }, []);

  return (
    <div className="h-full w-full p-20 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex justify-center items-center h-[500px] w-full">
        <Map
          initialViewState={{
            longitude: NYC_COORDS.longitude,
            latitude: NYC_COORDS.latitude,
            zoom: 16,
          }}
          minZoom={10}
          maxZoom={20}
          mapStyle="https://api.maptiler.com/maps/streets/style.json?key=wj2xyR5KXFoBWjTtFjY7"
        >
          {<FindingLocation loc={currentGeoLoc} />}
          {currentGeoLoc &&
            createMockCoords(currentGeoLoc, 0.002).map((e, i) => (
              <Marker
                key={`mockLoc${i}`}
                longitude={e.longitude}
                latitude={e.latitude}
                anchor="center"
              >
                <div className="h-4 w-4 rounded-full border-4 border-blue-800" />
              </Marker>
            ))}
        </Map>
      </div>
      {currentGeoLoc && <LocationDisplay geolocation={currentGeoLoc} />}
    </div>
  );
}

const FindingLocation = ({ loc }: { loc?: Geolocation }) => {
  const { current: map } = useMap();

  useEffect(() => {
    if (map && loc) {
      map.flyTo({
        center: [loc.longitude, loc.latitude],
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }, [map, loc]);

  return loc ? (
    <></>
  ) : (
    <div className="absolute left-1/2 top-1/2 -translate-1/2 rounded-full p-4 text-2xl bg-slate-900 text-slate-50 animate-pulse">
      Getting Your Location
    </div>
  );
};

const LocationDisplay = ({ geolocation }: { geolocation: Geolocation }) => (
  <div className="w-full h-full flex justify-around py-4 text-2xl">
    <div className="flex flex-col items-center gap-y-2">
      <span className="underline">{"Longitude"}</span>
      <span className="text-red-400">{geolocation.longitude.toFixed(2)}</span>
    </div>
    <div className="flex flex-col items-center gap-y-2">
      <span className="underline">{"Latitude"}</span>
      <span className="text-blue-400">{geolocation.latitude.toFixed(2)}</span>
    </div>
    <div className="flex flex-col items-center gap-y-2">
      <span className="underline">{"Accuracy"}</span>
      <span className="text-yellow-400">
        {geolocation.accuracy?.toFixed(2)}
      </span>
    </div>
  </div>
);
