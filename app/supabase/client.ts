import { createClient } from "@supabase/supabase-js";
import { LocationData, SubmissionData } from "../types";

export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  );
}

export async function getLocationData(): Promise<LocationData[]> {
  const client = createSupabaseClient();
  const { data } = await client.from("poster-locations").select();
  return data as LocationData[];
}

export async function updateLocationSubmissionCount({
  location_id,
  submission_count,
}: {
  location_id: number;
  submission_count: number;
}) {
  const client = createSupabaseClient();

  const { error } = await client
    .from("poster-locations")
    .update({ submission_count: submission_count })
    .eq("id", location_id);

  if (error) {
    return { location_id, error: "Location update failed" };
  }

  return { location_id, error: "" };
}

export async function uploadSubmission(data: SubmissionData) {
  const client = createSupabaseClient();

  const { error } = await client.from("user-submissions").insert(data);

  if (error) {
    return { data, error: "Submission upload failed" };
  }

  return { data, error: "" };
}

export async function getSubmissionsByLocationId(
  location_id: number,
): Promise<SubmissionData[]> {
  const client = createSupabaseClient();
  const { data } = await client
    .from("user-submissions")
    .select()
    .eq("location_id", location_id);
  return data as SubmissionData[];
}
