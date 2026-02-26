import { useEffect, useState } from "react";
import { LocationData, SubmissionData } from "../types";
import { getSubmissionsByLocationId } from "../supabase/client";

// TO DO:
// - Replace img with next.js Image

export const LocationModal = ({
  location,
  onBgClick,
}: {
  location: LocationData;
  onBgClick?: () => void;
}) => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  useEffect(() => {
    async function setupLocations() {
      const data = await getSubmissionsByLocationId(location.id);
      setSubmissions(data);
    }
    setupLocations();
  }, [location.id]);

  return (
    <div
      className="z-100 absolute h-screen w-screen bg-[rgba(0,0,0,0.5)]"
      onClick={() => onBgClick?.()}
    >
      <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 rounded-xl flex flex-col gap-y-4 items-center bg-blue-50 text-black">
        {submissions.map((e, i) => (
          <img
            key={`photo${i}`}
            className="rounded-xl"
            src={e.photo_url}
            alt=""
          />
        ))}
        <div className="w-full flex justify-between font-bold">
          {/* <div className="text-slate-900">{data.social}</div> */}
          <div className="text-slate-400">{`No Date Data Yet`}</div>
        </div>
      </div>
    </div>
  );
};
