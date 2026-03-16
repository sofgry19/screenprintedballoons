import Link from "next/link";
import { FONT_MON, NYC_COORDS } from "../lib/constants";


type SocialIn = {href:string, text:string}

export function SocialLink({href,text}:SocialIn){
    return <div className={FONT_MON.className}>
        <Link href={href}>{text}</Link>
    </div>
}