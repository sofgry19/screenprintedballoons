import "maplibre-gl/dist/maplibre-gl.css";
import { Ref, Suspense, useEffect, useState } from "react";
import Map, { useMap } from "react-map-gl/maplibre";
import { GeoCoords, SubmissionData } from "../../types";
import { BalloonMarker } from "./BalloonMarker";

export const ExploreMap = ({
  initCoords,
  onMarkerClick,
  goHomeRef,
}: {
  initCoords: GeoCoords;
  onMarkerClick: (data: SubmissionData) => void;
  goHomeRef: Ref<HTMLDivElement>;
}) => {
  return (
    <Suspense>
      <Map
        initialViewState={{
          longitude: initCoords.longitude,
          latitude: initCoords.latitude,
          zoom: 16,
        }}
        minZoom={10}
        maxZoom={20}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY ?? ""}`}
      >
        <GoHome ref={goHomeRef} />
      </Map>
    </Suspense>
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
