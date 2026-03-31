"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { GeoCoords, LocationData, SubmissionData } from "../types";
import Link from "next/link";
import { uploadImage } from "../supabase/storage/client";
import { convertBlobUrlToFile, getGeolocation } from "../lib/utils";
import {
  getLocationData,
  updateLocationSubmissionCount,
  uploadSubmission,
} from "../supabase/client";
import { FONT_RAMPART, FONT_MON } from "../lib/constants";
import { CheckIcon } from "@heroicons/react/24/outline";

export const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentCoords, setCurrentCoords] = useState<GeoCoords>();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCurrentCoords({ latitude, longitude });
    });
  }, []);
  const [userPhotoSrc, setUserPhotoSrc] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");

  const [uploadSuccess, setUploadSuccess] = useState<SubmissionData>();

  const [isPending, startTransition] = useTransition();
  const handleClickUploadToMap = () => {
    // If coords weren't found, try again
    // Hopefully this prompts location permission again
    if (!currentCoords) {
      setCurrentCoords(getGeolocation());
      return;
    }

    startTransition(async () => {
      // Get data of the nearest poster
      const all_posters = await getLocationData();
      const nearest_poster = findNearestPoster(currentCoords, all_posters);

      // Start building user submission object
      const submissionData: SubmissionData = {
        answer: userAnswer,
        photo_url: "",
        location_id: nearest_poster.id,
      };

      // Upload image to bucket and get public url
      const imageFile = await convertBlobUrlToFile(userPhotoSrc);
      const { imageUrl, error: imageUploadError } = await uploadImage({
        file: imageFile,
        bucket: "user-photos",
      });
      if (imageUploadError) {
        console.error(imageUploadError);
        return;
      }
      submissionData.photo_url = imageUrl;

      // Upload user submission to database
      const { data, error: submissionUploadError } =
        await uploadSubmission(submissionData);
      if (submissionUploadError) {
        console.error(submissionUploadError);
        return;
      }

      console.log(data);

      // Update submission_count of poster in database
      const { location_id, error: posterUpdateError } =
        await updateLocationSubmissionCount({
          location_id: nearest_poster.id,
          submission_count: nearest_poster.submission_count + 1,
        });
      if (posterUpdateError) {
        console.error(posterUpdateError);
        return;
      }

      console.log(location_id);

      setUploadSuccess(submissionData);
    });
  };

  const [isCameraDenied, setIsCameraDenied] = useState<boolean>(false);
  const [isThereNoCamera, setIsThereNoCamera] = useState<boolean>(false);

  return (
    <div
      className={`fixed w-full h-full flex flex-col bg-white overflow-hidden ${FONT_MON.className}`}
    >
      {uploadSuccess && currentCoords && (
        <SuccessModal coords={currentCoords} />
      )}
      <div className={"z-10 p-4 shadow-lg"}>
        <h1
          className={`${FONT_RAMPART.className} -mt-2 text-3xl lg:text-4xl text-center text-pink-400`}
        >
          {"Join the Party!"}
        </h1>
      </div>
      <div className="relative flex-1 p-8 bg-pink-100">
        <div
          className={`${currentCoords ? "bg-pink-500" : "bg-pink-300 animate-pulse"} absolute top-4 right-4 flex items-center gap-x-2 w-min text-sm md:text-lg text-white whitespace-nowrap rounded-full px-4 py-2`}
        >
          {currentCoords ? "Location Found" : "Finding Location..."}
          {currentCoords && (
            <CheckIcon className="w-4 h-4 md:w-6 md:h-6 stroke-2" />
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleClickUploadToMap();
          }}
          className="h-full flex flex-col justify-center gap-y-8 mt-4 text-black"
        >
          <div className="flex flex-col gap-y-2 w-2/3 lg:w-1/2 xl:w-1/3 mx-auto">
            <div className="aspect-square p-2 rounded-xl bg-white border-4 border-dashed border-pink-500 overflow-hidden flex justify-center items-center">
              {
                /* eslint-disable @next/next/no-img-element */
                <img
                  src={userPhotoSrc || "/photo-guide.png"}
                  className="max-w-full max-h-full"
                  style={{
                    filter: userPhotoSrc ? undefined : "grayscale(100%)",
                  }}
                  alt=""
                />
              }
            </div>
            <div className="w-full flex flex-col items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                disabled={isPending}
                onChange={async (e) => {
                  const file = e.target.files?.[0] as File;
                  const fileUrl = URL.createObjectURL(file);
                  setUserPhotoSrc(fileUrl);
                }}
                className="hidden"
              />
              <button
                className="w-full rounded-lg p-4 bg-pink-500 text-white disabled:bg-pink-200 disabled:text-pink-300"
                disabled={isPending}
                type="button"
                onClick={() => {
                  navigator.mediaDevices
                    .getUserMedia({ video: true, audio: false })
                    .then((stream: MediaStream) => {
                      fileInputRef.current?.click();
                    })
                    .catch((e: DOMException) => {
                      if (e.name == "NotFoundError") setIsThereNoCamera(true);
                      if (e.name == "NotAllowedError") setIsCameraDenied(true);
                      else console.error(`An error occurred: ${e}`);
                    });
                }}
              >
                {userPhotoSrc ? "Change Photo?" : "Take a Photo"}
              </button>
            </div>
          </div>
          <div className="w-full lg:3/4 mx-auto">
            <label>{"What's one thing that brought you joy today?"}</label>
            <textarea
              value={userAnswer}
              disabled={isPending}
              className="w-full rounded-md p-2 border-3 border-pink-500 bg-white text-black"
              onChange={(e) => {
                setUserAnswer(e.target.value);
              }}
            />
          </div>
          <button
            className="w-full lg:3/4 mx-auto rounded-md p-4 bg-pink-500 text-white disabled:bg-pink-200 disabled:text-pink-300"
            type="submit"
            disabled={!currentCoords || !userPhotoSrc || isPending}
          >
            {isPending ? "Uploading..." : "Upload to map!"}
          </button>
        </form>
      </div>
    </div>
  );
};

const SuccessModal = ({ coords }: { coords: GeoCoords }) => (
  <div className="z-100 absolute h-screen w-screen bg-[rgba(0,0,0,0.5)]">
    <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 rounded-xl flex flex-col gap-y-4 items-center bg-white">
      <div className="text-black">
        {"Upload success! Now go see everyone else's photos!"}
      </div>
      <Link
        href={`/explore/?lng=${coords.longitude}&lat=${coords.latitude}`}
        className="w-min rounded-md p-4 bg-pink-500 text-white whitespace-nowrap"
      >
        {"Go to Map"}
      </Link>
    </div>
  </div>
);

const findNearestPoster = (
  currentCoords: GeoCoords,
  poster_locations: LocationData[],
): LocationData => {
  let min_dist = Number.MAX_VALUE;
  let closest_loc: LocationData = poster_locations[0];

  poster_locations.map((loc_data: LocationData) => {
    const dist_squared =
      Math.exp(loc_data.longitude - currentCoords.longitude) +
      Math.exp(loc_data.latitude - currentCoords.latitude);

    if (dist_squared < min_dist) {
      min_dist = dist_squared;
      closest_loc = loc_data;
    }
  });

  return closest_loc;
};
