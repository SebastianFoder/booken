'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavLink({href, children}: {href: string, children: React.ReactNode}) {
    const pathname = usePathname();
    return (
        pathname == href ? 
        <Link className="active" href={href}>
            <div>{children}</div>
        </Link> : 
        <Link href={href}>
            <div>{children}</div>
        </Link>
    )

}