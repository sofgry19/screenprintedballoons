import { useEffect, useState } from "react";
import { LocationData, SubmissionData } from "../types";
import { getSubmissionsByLocationId } from "../supabase/client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { FONT_MARKER } from "../lib/constants";

export const LocationModal = ({
  location,
  onBgClick,
}: {
  location: LocationData;
  onBgClick?: () => void;
}) => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [focusSub, setFocusSub] = useState<SubmissionData>();

  useEffect(() => {
    async function setupLocations() {
      const data = await getSubmissionsByLocationId(location.id);
      setSubmissions(data);
      setFocusSub(data[0]);
    }
    setupLocations();
  }, [location.id]);

  return (
    <div className="z-100 absolute h-full w-full select-none">
      <div
        className="absolute w-full h-full bg-[rgba(0,0,0,0.5)]"
        onClick={() => onBgClick?.()}
      />
      <div className="absolute left-1/2 top-1/2 -translate-1/2 p-2 rounded-xl flex flex-col gap-y-2 items-center bg-white w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%]">
        {focusSub && (
          <>
            <div className="flex justify-between items-center w-full">
              <span className="text-gray-400 text-sm md:text-lg">
                {focusSub.created_at
                  ? new Date(focusSub.created_at).toLocaleDateString()
                  : "--/--/----"}
              </span>
              <XMarkIcon
                className="w-6 h-6 md:w-8 md:h-8 stroke-2 text-gray-400 cursor-pointer"
                onClick={() => onBgClick?.()}
              />
            </div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-300">
              <Image
                fill={true}
                objectFit="contain"
                draggable={false}
                src={focusSub.photo_url}
                priority={true}
                alt=""
              />
            </div>
            {focusSub.answer && (
              <div className="w-full rounded-xl border-4 border-gray-500 overflow-hidden">
                <div className="bg-gray-500 p-1 pb-2 text-sm text-gray-300">
                  {location.question}
                </div>
                <div
                  className={`${FONT_MARKER.className} p-3 text-xl text-pink-500`}
                >{`${focusSub.answer}`}</div>
              </div>
            )}
          </>
        )}
        <div className="relative w-full">
          <div className="z-20 absolute w-full h-full fade-in-out pointer-events-none" />
          <div className="flex gap-x-2 md:gap-x-4 h-16 md:h-24 overflow-x-scroll w-full bg-gray-400 py-2">
            {submissions.map((e: SubmissionData, i) => (
              <div key={`photo${i}`} className="aspect-square cursor-pointer">
                <div
                  className="relative w-full h-full rounded-lg md:rounded-xl overflow-hidden"
                  style={{
                    boxShadow:
                      focusSub?.photo_url == e.photo_url
                        ? `0px 0px 2px 3px var(--color-pink-400)`
                        : undefined,
                  }}
                >
                  <Image
                    style={{
                      filter:
                        focusSub?.photo_url == e.photo_url
                          ? ""
                          : "grayscale(50%)",
                    }}
                    fill={true}
                    objectFit="cover"
                    draggable={false}
                    src={e.photo_url}
                    alt=""
                    onClick={() => {
                      setFocusSub(e);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
