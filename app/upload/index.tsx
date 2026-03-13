"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { GeoCoords, LocationData, SubmissionData } from "../types";
import Link from "next/link";
import { uploadImage } from "../supabase/storage/client";
import { getGeolocation } from "../lib/utils";
import {
  getLocationData,
  updateLocationSubmissionCount,
  uploadSubmission,
} from "../supabase/client";
import { Camera, CameraType } from "react-camera-pro";

export const UploadPage = () => {
  const [currentCoords, setCurrentCoords] = useState<GeoCoords>();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCurrentCoords({ latitude, longitude });
    });
  }, []);

  const [userPhotoSrc, setUserPhotoSrc] = useState<string>();
  const [userPhotoFile, setUserPhotoFile] = useState<File>();
  const [userSocial, setUserSocial] = useState<string>("");

  const [fakeSuccess, setFakeSuccess] = useState<SubmissionData>();

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
        social: userSocial,
        photo_url: "",
        location_id: nearest_poster.id,
      };

      // Upload image to bucket and get public url
      //const imageFile = await convertBlobUrlToFile(selectedImageUrl);
      const { imageUrl, error: imageUploadError } = await uploadImage({
        file: userPhotoFile as File,
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

      setFakeSuccess(submissionData);
    });
  };

  const camera = useRef<CameraType>(null);

  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  // Capture photo from camera
  const capturePhoto = () => {
    if (camera.current) {
      const photoSrc: string = camera.current.takePhoto("base64url") as string;
      setUserPhotoSrc(photoSrc as string);

      urltoFile(photoSrc, "photo.jpeg", "image/jpeg").then(function (file) {
        console.log(file);
        setUserPhotoFile(file);
        setIsCameraOpen(false);
      });

      // rotateImage(photoSrc, 0, (imageSrc: string) => {
      //   urltoFile(imageSrc, "photo.jpeg", "image/jpeg").then(function (file) {
      //     console.log(file);
      //     setUserPhotoFile(file);
      //     setIsCameraOpen(false);
      //   });
      // });
    }
  };

  // Convert from base64 format to image file
  function urltoFile(url: string, filename: string, mimeType: string) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }

  const rotateImage = (
    imageBase64: string,
    rotation: number,
    cb: (base64Url: string) => void,
  ) => {
    const img = new Image();
    img.src = imageBase64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.translate(canvas.width, 0);
      ctx?.scale(-1, 1);
      ctx?.drawImage(img, 0, 0);
      cb(canvas.toDataURL("image/jpeg", 1));
    };
  };

  return (
    <div className="h-screen w-screen bg-zinc-50 font-sans dark:bg-black overflow-hidden">
      {isCameraOpen && (
        <div className="absolute left-0 top-0 w-full h-full bg-yellow-50">
          <Camera
            ref={camera}
            facingMode="user"
            aspectRatio={"cover"}
            errorMessages={{}}
          />
          <button
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[300px] rounded-md p-4 bg-blue-500 text-white cursor-pointer"
            disabled={isPending}
            type="button"
            onClick={() => {
              capturePhoto();
            }}
          >
            {"Capture Photo"}
          </button>
        </div>
      )}
      {fakeSuccess && currentCoords && <SuccessModal coords={currentCoords} />}
      <div className="p-8 bg-blue-100">
        <CoordsPill coords={currentCoords} />
        <div className="w-2/3 lg:w-1/2 xl:w-1/3 aspect-square mx-auto p-2 rounded-xl bg-blue-200 border-2 border-dashed border-blue-500 overflow-hidden flex justify-center items-center">
          {userPhotoFile ? (
            /* eslint-disable @next/next/no-img-element */
            <img src={userPhotoSrc} className="max-w-full max-h-full" alt="" />
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
            <button
              className="w-full rounded-md p-4 bg-blue-500 text-white disabled:bg-slate-300 disabled:text-slate-400"
              disabled={isPending}
              type="button"
              onClick={() => {
                setIsCameraOpen(true);
              }}
            >
              {userPhotoFile ? "Change Photo" : "Take Photo"}
            </button>
          </div>
          <div>
            <label>{"Share your Instagram?"}</label>
            <input
              type="text"
              value={userSocial}
              disabled={isPending}
              className="w-full rounded-md p-2 border-3 border-blue-500 text-black"
              onChange={(e) => {
                setUserSocial(e.target.value);
              }}
            />
          </div>
          <button
            className="w-full rounded-md p-4 bg-blue-500 text-white disabled:bg-slate-300 disabled:text-slate-400"
            type="submit"
            disabled={!currentCoords || !userPhotoFile || isPending}
          >
            {isPending ? "Uploading..." : "Upload to map!"}
          </button>
        </form>
      </div>
    </div>
  );
};

const SuccessModal = ({ coords }: { coords: GeoCoords }) => (
  <div className="absolute h-screen w-screen bg-[rgba(0,0,0,0.5)]">
    <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 rounded-xl flex flex-col gap-y-4 items-center bg-blue-50">
      <div className="text-black">
        {"Fake upload success! Now go see everyone else's photos!"}
      </div>
      <Link
        href={`/explore/?lng=${coords.longitude}&lat=${coords.latitude}`}
        className="w-min rounded-md p-4 bg-blue-500 text-white disabled:bg-slate-300 disabled:text-slate-400 whitespace-nowrap"
      >
        {"Go to Map"}
      </Link>
    </div>
  </div>
);

const CoordsPill = ({ coords }: { coords?: GeoCoords }) => (
  <div
    className={`${coords ? "bg-green-700" : "bg-red-700 animate-pulse"} rounded-full px-4 py-1 mb-4 w-min whitespace-nowrap`}
  >
    {coords ? "Location Found!" : "Finding Location..."}
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
