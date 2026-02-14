"use client";

import { useEffect, useState } from "react";
import { GeoCoords } from "./types";
import Map, { Marker, useMap } from "react-map-gl/maplibre";
import { createMockCoords } from "./mock-coords";

const NYC_COORDS: GeoCoords = { longitude: -73.935242, latitude: 40.73061 };

export const HomePage = () => {
  const [currentCoords, setCurrentCoords] = useState<GeoCoords>();

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        // Fetch data from API with given latitude and longitude
        setCurrentCoords({ latitude, longitude });
      });
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-700 overflow-hidden">
      <div className="p-2 text-xl lg:text-4xl text-center">
        Screen Printed Balloons!
      </div>
      <div className="flex-1 flex justify-center items-center h-[500px] w-full overflow-hidden">
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
          {<FindingLocation loc={currentCoords} />}
          {currentCoords &&
            createMockCoords(currentCoords, 0.002).map((e, i) => (
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
      <div className="p-4 flex justify-center">
        <button
          className="text-md py-2 px-4 rounded-full bg-slate-500 cursor-pointer"
          onClick={() => {}}
        >
          Go to my location
        </button>
      </div>
    </div>
  );
};

const FindingLocation = ({ loc }: { loc?: GeoCoords }) => {
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
