"use client";

import { useEffect, useRef, useState } from "react";
import { GeoCoords, MapEntryData } from "../types";
import Link from "next/link";

export const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoadingImg, setIsLoadingImg] = useState<boolean>(false);
  const [loadedImgSrc, setLoadedImgSrc] = useState<string>("");

  const [currentCoords, setCurrentCoords] = useState<GeoCoords>();

  const [fakeSuccess, setFakeSuccess] = useState<MapEntryData>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCurrentCoords({ latitude, longitude });
    });
  }, []);

  return (
    <div className="h-full w-full bg-zinc-50 font-sans dark:bg-black">
      {fakeSuccess && <SuccessModal entryData={fakeSuccess} />}
      <div className="p-8 bg-blue-100">
        <div className="w-2/3 lg:w-1/2 xl:w-1/3 aspect-square mx-auto p-2 rounded-xl bg-blue-200 border-2 border-dashed border-blue-500 overflow-hidden flex justify-center items-center">
          {loadedImgSrc ? (
            /* eslint-disable @next/next/no-img-element */
            <img src={loadedImgSrc} className="max-w-full max-h-full" alt="" />
          ) : (
            <div></div>
          )}
        </div>
        <form
          action={(data: FormData) => {}}
          onSubmit={(e) => {
            e.preventDefault();
            // Submit button is disabled if currentCoords aren't found
            // This condition should always succeed
            if (currentCoords) {
              const name = e.target.firstName.value || undefined;
              const photo = e.target.photo.value as File;

              // TO DO:
              // Upload photo to image hosting site and get a url
              const hostedURL = "TBD";

              const entryData: MapEntryData = {
                name: name,
                img_url: hostedURL,
                coords: currentCoords,
                timestamp: new Date(),
              };

              // TO DO:
              // Upload entry data to a database

              console.log(photo);
              console.log(entryData);
              setFakeSuccess(entryData);
            }
          }}
          className="flex flex-col gap-y-4 mt-4 text-black"
        >
          <div className="w-2/3 lg:w-1/2 xl:w-1/3 mx-auto flex flex-col items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".png, .jpg, .jpeg"
              name="photo"
              onChange={async (e) => {
                const file = e.target.files?.[0] as File;

                setIsLoadingImg(true);

                const data = new FormData();
                data.set("file", file);

                await fetch("api/files", {
                  method: "POST",
                  body: data,
                });

                const reader = new FileReader();
                reader.onload = function () {
                  setLoadedImgSrc(reader.result as string);
                };
                reader.readAsDataURL(file);

                setIsLoadingImg(false);
              }}
              className="hidden"
            />

            <button
              className="w-full rounded-md p-4 bg-blue-500 text-white disabled:bg-slate-300 disabled:text-slate-400"
              disabled={isLoadingImg}
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              {isLoadingImg ? "Loading image..." : "Select Image"}
            </button>
          </div>
          <div>
            <label>{"Want to share your name?"}</label>
            <input
              type="text"
              name="firstName"
              className="w-full rounded-md p-2 border-3 border-blue-500 text-black"
            />
          </div>
          <button
            className="w-full rounded-md p-4 bg-blue-500 text-white disabled:bg-slate-300 disabled:text-slate-400"
            type="submit"
            disabled={!currentCoords || !loadedImgSrc}
          >
            {loadedImgSrc && !currentCoords
              ? "Finding coordinates"
              : "Post on map!"}
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
        href={`/?lng=${entryData.coords.longitude}&lat=${entryData.coords.latitude}`}
        className="w-min rounded-md p-4 bg-blue-500 text-white disabled:bg-slate-300 disabled:text-slate-400 whitespace-nowrap"
      >
        {"Go to Map"}
      </Link>
    </div>
  </div>
);
