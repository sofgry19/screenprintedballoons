import { createClient } from "@supabase/supabase-js";
import { MapEntryData } from "../types";

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  );
}

export async function uploadMapEntry(entry: MapEntryData) {
  const client = createSupabaseClient();

  const { error } = await client.from("map-entries").insert({
    name: entry.name ?? null,
    photo_url: entry.photo_url,
    longitude: entry.coords.longitude,
    latitude: entry.coords.latitude,
  });

  if (error) {
    return { entry: entry, error: "Entry upload failed" };
  }

  return { entry: entry, error: "" };
}

export async function getMapEntries(): Promise<MapEntryData[]> {
  const client = createSupabaseClient();

  const { data } = await client.from("map-entries").select();

  const returnData: MapEntryData[] = [];
  data?.map((e) => {
    returnData.push({
      coords: { longitude: e.longitude, latitude: e.latitude },
      photo_url: e.photo_url,
      name: e.name,
    });
  });

  return returnData;
}
