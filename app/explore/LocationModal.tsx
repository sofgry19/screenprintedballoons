import { useEffect, useState } from "react";
import { LocationData, SubmissionData } from "../types";
import { getSubmissionsByLocationId } from "../supabase/client";
import { XMarkIcon } from "@heroicons/react/24/outline";

// TO DO:
// - Replace img with next.js Image
// - Sort retrieved submissions by creation date

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
      <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 rounded-xl flex flex-col gap-y-4 items-center bg-white w-full max-w-[90%] md:max-w-[70%] lg:max-w-[50%] h-fit">
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
            <img
              className="rounded-xl max-h-80"
              draggable={false}
              src={focusSub.photo_url}
              alt=""
            />
            {focusSub.social && (
              <div className="w-full text-gray-500 italic">{`"${focusSub.social}"`}</div>
            )}
          </>
        )}
        <div className="flex gap-x-4 h-16 md:h-24 overflow-x-scroll">
          {submissions.map((e: SubmissionData, i) => (
            <img
              key={`photo${i}`}
              className="rounded-md md:rounded-xl cursor-pointer"
              draggable={false}
              src={e.photo_url}
              alt=""
              onClick={() => {
                setFocusSub(e);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
