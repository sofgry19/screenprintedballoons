"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="h-full w-full p-20 bg-zinc-50 font-sans dark:bg-black">
      <Image alt="" src="/wireframe.png" fill={true} />
    </div>
  );
}
