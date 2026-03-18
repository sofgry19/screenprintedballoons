import Link from "next/link";
import { FONT_MON } from "../lib/constants";

type SocialIn = { href: string; text: string };

export function SocialLink({ href, text }: SocialIn) {
  return (
    <div
      className={`${FONT_MON.className} px-4 text-gray-300 hover:text-gray-500 transition-colors duration-100`}
    >
      <Link href={href}>{text}</Link>
    </div>
  );
}
