import Link from "next/link";

type SocialIn = {href:string, text:string}

export function SocialLink({href,text}:SocialIn){
    return <div className="bg-pink-100">
        <Link href={href}>{text}</Link>
    </div>
}