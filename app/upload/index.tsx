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
import { ErrorModule } from "./ErrorModule";

export const UploadPage = () => {
  // Reference to the file input element
  // This allows other elems to call its functions
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Feedback
  const [isPending, startTransition] = useTransition();
  const [isLocationDenied, setIsLocationDenied] = useState<boolean>(false);
  const [isCameraDenied, setIsCameraDenied] = useState<boolean>(false);
  const [isCameraNotFound, setIsCameraNotFound] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<SubmissionData>();
  const tryToUseCamera = (onSuccess?: () => void) => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(() => {
          setIsCameraDenied(false);
          setIsCameraNotFound(false);

          onSuccess?.();
        })
        .catch((e: DOMException) => {
          let cam_not_found = false;
          let cam_denied = false;

          if (e.name == "NotFoundError") cam_not_found = true;
          if (e.name == "NotAllowedError") cam_denied = true;

          setIsCameraNotFound(cam_not_found);
          setIsCameraDenied(cam_denied);
        });
    } else {
      setIsCameraNotFound(true);
    }
  };

  // Location
  const [currentCoords, setCurrentCoords] = useState<GeoCoords>();
  const [nearestPoster, setNearestPoster] = useState<LocationData>();
  const findCoordsAndPoster = () => {
    // This function parses through all posters and returns the nearest one
    const findNearestPoster = async (
      currentCoords: GeoCoords,
    ): Promise<LocationData> => {
      const all_posters = await getLocationData();

      let min_dist = Number.MAX_VALUE;
      let closest_loc: LocationData = all_posters[0];

      all_posters.map((loc_data: LocationData) => {
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

    // Use navigator to get geocoordinates
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ latitude, longitude });

        // Once coords are found, find nearest poster
        findNearestPoster({ latitude, longitude }).then(
          (poster: LocationData) => {
            setNearestPoster(poster);
          },
        );
      },
      () => {
        setIsLocationDenied(true);
      },
    );
  };
  useEffect(() => {
    findCoordsAndPoster();
  }, []); // This code runs once on page load

  // Input
  const [userPhotoSrc, setUserPhotoSrc] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");

  const handleClickUploadToMap = () => {
    // If coords weren't found, try again
    // Hopefully this prompts location permission again
    if (!currentCoords || !nearestPoster) {
      setCurrentCoords(getGeolocation());
      return;
    }

    startTransition(async () => {
      // Start building user submission object
      const submissionData: SubmissionData = {
        answer: userAnswer,
        photo_url: "",
        location_id: nearestPoster.id,
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
          location_id: nearestPoster.id,
          submission_count: nearestPoster.submission_count + 1,
        });
      if (posterUpdateError) {
        console.error(posterUpdateError);
        return;
      }

      console.log(location_id);

      setUploadSuccess(submissionData);
    });
  };

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
      <div className="relative flex-1 p-4 md:p-8 bg-pink-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleClickUploadToMap();
          }}
          className="h-full flex flex-col justify-center gap-y-8 mt-4 text-black"
        >
          {isCameraNotFound ? (
            <ErrorModule
              title={"No Camera Found"}
              text={
                "No camera could be found. If there IS one, you probably need to allow camera permissions."
              }
              buttonText={"Try Again"}
              onButtonClick={tryToUseCamera}
            />
          ) : isCameraDenied ? (
            <ErrorModule
              title={"Camera Permissions Denied"}
              text={
                "You are going to take a photo of your gorgeous face. We need your camera for that."
              }
              buttonText={"Try Again"}
              onButtonClick={tryToUseCamera}
            />
          ) : (
            <div className="flex flex-col gap-y-2 w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto">
              <div className="aspect-square p-2 rounded-2xl bg-white border-4 border-dashed border-pink-500 overflow-hidden flex justify-center items-center">
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
                  className="w-full rounded-2xl p-4 bg-pink-500 text-white disabled:bg-pink-200 disabled:text-pink-300"
                  disabled={isPending}
                  type="button"
                  onClick={() => {
                    tryToUseCamera(() => {
                      fileInputRef.current?.click();
                    });
                  }}
                >
                  {userPhotoSrc ? "Change Photo?" : "Take a Photo"}
                </button>
              </div>
            </div>
          )}
          {isLocationDenied ? (
            <ErrorModule
              title={"Location Permissions Denied"}
              text={
                "We need to know your location for any of this to work. LET US SEE IT."
              }
              buttonText={"Try Again"}
              onButtonClick={() => {
                setIsLocationDenied(false);
                findCoordsAndPoster();
              }}
            />
          ) : (
            <div
              className={`${currentCoords ? "bg-pink-500" : "bg-slate-300 animate-pulse"} w-full lg:3/4 mx-auto mt-4 rounded-2xl text-sm md:text-lg text-white`}
            >
              <div
                className={`-mt-4 h-8 rounded-t-2xl px-4 py-2 ml-auto flex items-center gap-x-2 w-min bg-inherit text-xs md:text-lg text-white whitespace-nowrap`}
              >
                {currentCoords ? "Question Found:" : "Finding Question..."}
              </div>
              <div className="flex flex-col gap-y-2 px-2 pb-2">
                <div className="italic md:text-xl">
                  {nearestPoster?.question ?? "..."}
                </div>
                <textarea
                  value={userAnswer}
                  disabled={!nearestPoster}
                  className="w-full rounded-xl p-2 bg-white text-black"
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                  }}
                />
              </div>
            </div>
          )}
          <button
            className="w-full lg:3/4 mx-auto p-4 rounded-2xl text-xl md:text-2xl text-white bg-pink-500 disabled:bg-slate-300 disabled:text-slate-400"
            type="submit"
            disabled={!nearestPoster || !userPhotoSrc}
          >
            {isPending ? "Uploading..." : "Upload to map!"}
          </button>
        </form>
      </div>
    </div>
  );
};

const SuccessModal = ({ coords }: { coords: GeoCoords }) => (
  <div className="z-100 absolute h-full w-full bg-[rgba(0,0,0,0.5)]">
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
