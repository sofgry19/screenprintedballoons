import { MapEntryData } from "../types";

// TO DO:
// - Replace img with next.js Image

export const MapEntryModal = ({
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
      <img className="rounded-xl" src={entryData.photo_url} alt="" />
      <div className="w-full flex justify-between font-bold">
        <div className="text-slate-900">{entryData.name}</div>
        <div className="text-slate-400">{`No Date Data Yet`}</div>
      </div>
    </div>
  </div>
);
