import { Marker } from "react-map-gl/maplibre";

export const BalloonMarker = ({
  longitude,
  latitude,
  onClick,
}: {
  longitude: number;
  latitude: number;
  onClick?: () => void;
}) => (
  <Marker longitude={longitude} latitude={latitude} anchor="bottom">
    <BalloonMarkerIcon
      className="h-12 w-12 text-pink-400 hover:scale-[1.2] hover:-translate-y-[10%] duration-200 cursor-pointer"
      onClick={onClick}
    />
  </Marker>
);

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
