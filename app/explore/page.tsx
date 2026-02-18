import { Suspense } from "react";
import { HomePage } from ".";
import { HomePageParams } from "../types";

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
