"use client";

import { Ref, Suspense, use, useEffect, useRef, useState } from "react";
import { GeoCoords, HomePageParams } from "./types";
import Map, { GeolocateControl, Marker, useMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { createMockCoords } from "./mock-coords";

const NYC_COORDS: GeoCoords = { longitude: -73.935242, latitude: 40.73061 };

export const HomePage = ({
  searchParams,
}: {
  searchParams: Promise<HomePageParams>;
}) => {
  const params = use(searchParams);
  console.log(params);
  const [initCoords, setInitCoords] = useState<GeoCoords>({
    longitude: params.lng ? Number(params.lng) : NYC_COORDS.longitude,
    latitude: params.lat ? Number(params.lat) : NYC_COORDS.latitude,
  });

  const goHomeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-700 overflow-hidden">
      <div className="p-2 text-xl lg:text-4xl text-center">
        Screen Printed Balloons!
      </div>
      <div className="flex-1 flex justify-center items-center h-[500px] w-full overflow-hidden">
        <Suspense>
          <Map
            initialViewState={{
              longitude: initCoords.longitude,
              latitude: initCoords.latitude,
              zoom: 16,
            }}
            minZoom={10}
            maxZoom={20}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=wj2xyR5KXFoBWjTtFjY7"
          >
            {createMockCoords(initCoords, 0.002).map((e, i) => (
              <Marker
                key={`mockLoc${i}`}
                longitude={e.longitude}
                latitude={e.latitude}
                anchor="center"
              >
                <div className="h-7 w-7 rounded-full border-6 border-blue-800" />
              </Marker>
            ))}
            <GeolocateControl position="bottom-left" />
            <GoHome ref={goHomeRef} />
          </Map>
        </Suspense>
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

const GoHome = ({ ref }: { ref: Ref<HTMLDivElement> }) => {
  const { current: map } = useMap();
  const [currentCoords, setCurrentCoords] = useState<GeoCoords>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCurrentCoords({ latitude, longitude });
    });
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none"
      onClick={() => {
        if (map && currentCoords) {
          map.flyTo({
            center: [currentCoords.longitude, currentCoords.latitude],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          });
        }
      }}
    />
  );
};
