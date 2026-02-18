"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { GeoCoords, MapEntryData } from "../types";
import Link from "next/link";
import { uploadImage } from "../supabase/storage/client";
import { convertBlobUrlToFile, getGeolocation } from "../lib/utils";

export const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentCoords, setCurrentCoords] = useState<GeoCoords>();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCurrentCoords({ latitude, longitude });
    });
  }, []);

  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  useEffect(() => {
    console.log(selectedImageUrl);
  }, [selectedImageUrl]);
  const [firstName, setFirstName] = useState<string>("");

  const [fakeSuccess, setFakeSuccess] = useState<MapEntryData>();

  const [isPending, startTransition] = useTransition();
  const handleClickUploadToMap = () => {
    // If coords weren't found, try again
    // Hopefully this prompts location permission again
    if (!currentCoords) {
      setCurrentCoords(getGeolocation());
      return;
    }
    startTransition(async () => {
      const entryData: MapEntryData = {
        name: firstName,
        photo_url: "",
        coords: currentCoords,
      };
      // Upload image to bucket and get public url
      console.log(selectedImageUrl);
      const imageFile = await convertBlobUrlToFile(selectedImageUrl);

      const { imageUrl, error } = await uploadImage({
        file: imageFile,
        bucket: "user-photos",
      });
      if (error) {
        console.error(error);
        return;
      }

      entryData.photo_url = imageUrl;

      console.log(entryData);
      setFakeSuccess(entryData);
    });
  };

  return (
    <div className="h-full w-full bg-zinc-50 font-sans dark:bg-black">
      {fakeSuccess && <SuccessModal entryData={fakeSuccess} />}
      <div className="p-8 bg-blue-100">
        <div className="w-2/3 lg:w-1/2 xl:w-1/3 aspect-square mx-auto p-2 rounded-xl bg-blue-200 border-2 border-dashed border-blue-500 overflow-hidden flex justify-center items-center">
          {selectedImageUrl ? (
            /* eslint-disable @next/next/no-img-element */
            <img
              src={selectedImageUrl}
              className="max-w-full max-h-full"
              alt=""
            />
          ) : (
            <div></div>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleClickUploadToMap();
          }}
          className="flex flex-col gap-y-4 mt-4 text-black"
        >
          <div className="w-2/3 lg:w-1/2 xl:w-1/3 mx-auto flex flex-col items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".png, .jpg, .jpeg"
              disabled={isPending}
              onChange={async (e) => {
                const file = e.target.files?.[0] as File;
                const fileUrl = URL.createObjectURL(file);
                setSelectedImageUrl(fileUrl);
              }}
              className="hidden"
            />

            <button
              className="w-full rounded-md p-4 bg-blue-500 text-white disabled:bg-slate-300 disabled:text-slate-400"
              disabled={isPending}
              type="button"
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              {"Select Image"}
            </button>
          </div>
          <div>
            <label>{"Want to share your name?"}</label>
            <input
              type="text"
              value={firstName}
              disabled={isPending}
              className="w-full rounded-md p-2 border-3 border-blue-500 text-black"
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
          </div>
          <button
            className="w-full rounded-md p-4 bg-blue-500 text-white disabled:bg-slate-300 disabled:text-slate-400"
            type="submit"
            disabled={!currentCoords || !selectedImageUrl || isPending}
          >
            {isPending ? "Uploading..." : "Upload to map!"}
          </button>
        </form>
      </div>
    </div>
  );
};

const SuccessModal = ({ entryData }: { entryData: MapEntryData }) => (
  <div className="absolute h-screen w-screen bg-[rgba(0,0,0,0.5)]">
    <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 rounded-xl flex flex-col gap-y-4 items-center bg-blue-50">
      <div className="text-black">
        {"Fake upload success! Now go see everyone else's photos!"}
      </div>
      <Link
        href={`/explore/?lng=${entryData.coords.longitude}&lat=${entryData.coords.latitude}`}
        className="w-min rounded-md p-4 bg-blue-500 text-white disabled:bg-slate-300 disabled:text-slate-400 whitespace-nowrap"
      >
        {"Go to Map"}
      </Link>
    </div>
  </div>
);
