"use client";

import { Ref, Suspense, use, useEffect, useRef, useState } from "react";
import { GeoCoords, HomePageParams, MapEntryData } from "./types";
import Map, { GeolocateControl, Marker, useMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { createMockCoords } from "./mock-data";
import { MOCK_ENTRIES } from "./mock-data";

const NYC_COORDS: GeoCoords = { longitude: -73.935242, latitude: 40.73061 };

export const HomePage = ({
  searchParams,
}: {
  searchParams: Promise<HomePageParams>;
}) => {
  const params = use(searchParams);
  const [initCoords, setInitCoords] = useState<GeoCoords>({
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
            {MOCK_ENTRIES.map((e, i) => {
              const coordOverride = createMockCoords(initCoords, 0.002, 1)[0];

              return (
                <Marker
                  key={`mockLoc${i}`}
                  longitude={coordOverride.longitude}
                  latitude={coordOverride.latitude}
                  anchor="bottom"
                >
                  <BalloonMarkerIcon
                    className="h-12 w-12 text-pink-400 hover:scale-[1.2] hover:-translate-y-[10%] duration-200 cursor-pointer"
                    onClick={() => {
                      setCurrentEntry(e);
                    }}
                  />
                </Marker>
              );
            })}
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

const BalloonMarkerIcon = ({
  color_primary,
  color_secondary,
  highlight = true,
  className,
  onClick,
}: {
  color_primary?: string;
  color_secondary?: string;
  highlight?: boolean;
  className?: string;
  onClick?: () => void;
}) => (
  <svg
    className={className}
    viewBox="0 0 144 144"
    onClick={() => {
      onClick?.();
    }}
  >
    <path
      fill={color_secondary ?? "#ffffff"}
      d="M72,0c29.803,0 54,24.197 54,54c0,54 -54,90 -54,90c0,0 -54,-36 -54,-90c0,-29.803 24.197,-54 54,-54Z"
    />
    <path
      fill={color_primary ?? "currentColor"}
      d="M58.774,104.901c-16.709,-7.983 -28.774,-30.083 -28.774,-50.901c0,-23.18 18.82,-42 42,-42c23.18,0 42,18.82 42,42c0,20.822 -12.071,42.928 -28.785,50.906c0.125,0.106 0.253,0.209 0.384,0.308c1.46,1.087 2.401,2.827 2.401,4.786c0,3.311 -2.689,6 -6,6c-0.396,-0 -0.783,-0.038 -1.157,-0.112c-1.497,-0.267 -3.013,0.361 -3.882,1.61c-1.145,1.497 -2.936,2.502 -4.961,2.502c-2.025,-0 -3.816,-1.005 -4.903,-2.543c-0.884,-1.271 -2.428,-1.911 -3.952,-1.638c-0.362,0.143 -0.749,0.181 -1.145,0.181c-3.311,-0 -6,-2.689 -6,-6c0,-1.959 0.941,-3.699 2.394,-4.795c0.13,-0.098 0.256,-0.2 0.38,-0.304Z"
    />
    {highlight && (
      <path
        fill={"#ffffff"}
        d="M82,36.679c-2.868,-1.655 -3.852,-5.328 -2.196,-8.196c1.656,-2.867 5.328,-3.852 8.196,-2.196c7.935,4.581 13.167,12.057 15.131,20.327c0.765,3.222 -1.23,6.459 -4.452,7.224c-3.222,0.765 -6.459,-1.23 -7.224,-4.452c-1.227,-5.169 -4.495,-9.843 -9.455,-12.707Z"
      />
    )}
  </svg>
);

const MapEntryModal = ({
  entryData,
  onBgClick,
}: {
  entryData: MapEntryData;
  onBgClick?: () => void;
}) => (
  <div
    className="z-100 absolute h-screen w-screen bg-[rgba(0,0,0,0.5)]"
    onClick={() => onBgClick?.()}
  >
    <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 rounded-xl flex flex-col gap-y-4 items-center bg-blue-50 text-black">
      <img className="rounded-xl" src={entryData.img_url} alt="" />
      <div className="w-full flex justify-between font-bold">
        <div className="text-slate-900">{entryData.name}</div>
        <div className="text-slate-400">{`${entryData.timestamp.toLocaleDateString()}`}</div>
      </div>
    </div>
  </div>
);
