import { Suspense } from "react";
import { HomePage } from ".";
import { HomePageParams } from "../types";

// TO DO:
// - Implement some fallback UI

export default function Page({
  searchParams,
}: {
  searchParams: Promise<HomePageParams>;
}) {
  return (
    <Suspense fallback={<>...</>}>
      <HomePage searchParams={searchParams} />
    </Suspense>
  );
}
