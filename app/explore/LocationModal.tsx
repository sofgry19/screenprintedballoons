import { useEffect, useState } from "react";
import { LocationData, SubmissionData } from "../types";
import { getSubmissionsByLocationId } from "../supabase/client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

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
    <div className="z-100 absolute h-screen w-screen select-none">
      <div
        className="absolute w-full h-full bg-[rgba(0,0,0,0.5)]"
        onClick={() => onBgClick?.()}
      />
      <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 rounded-xl flex flex-col gap-y-4 items-center bg-white w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%]">
        {focusSub && (
          <>
            <div className="flex justify-between items-center w-full">
              <span className="text-gray-300 text-sm md:text-lg">
                {focusSub.created_at &&
                  new Date(focusSub.created_at).toLocaleDateString()}
              </span>
              <XMarkIcon
                className="w-6 h-6 md:w-8 md:h-8 stroke-2 text-gray-400 cursor-pointer"
                onClick={() => onBgClick?.()}
              />
            </div>
            <div className="relative w-full aspect-square">
              <Image
                className="rounded-xl"
                fill={true}
                objectFit="contain"
                draggable={false}
                src={focusSub.photo_url}
                alt=""
              />
            </div>
            {focusSub.answer && (
              <div className="w-full flex flex-col items-start justify-start">
                <div className="text-gray-500 italic">{location.question}</div>
                {focusSub.answer && (
                  <div className="w-full text-white text-xl rounded-lg p-4 bg-gray-300">{`"${focusSub.answer}"`}</div>
                )}
              </div>
            )}
          </>
        )}
        <div className="w-full h-0.5 rounded-full bg-gray-500" />
        <div className="flex gap-x-2 md:gap-x-4 h-16 md:h-24 overflow-x-scroll w-full">
          {submissions.map((e: SubmissionData, i) => (
            <div key={`photo${i}`} className="aspect-square cursor-pointer">
              <div
                className={`${focusSub?.photo_url == e.photo_url ? "bg-pink-100 border-pink-300" : "border-white bg-white"} relative w-full h-full border-2 md:border-4 rounded-lg md:rounded-xl overflow-hidden`}
              >
                <Image
                  className=""
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
  );
};
