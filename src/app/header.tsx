import NavLink from "@/components/navlink";
import HeaderUser from "./lib/headerUser";

export default function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <div className="logo">
                            <NavLink href="/">
                                Booken
                            </NavLink>
                        </div>
                    </li>
                    <li>
                        <ul className="pages">
                            <li>
                                <NavLink href="/tags">
                                    Tags
                                </NavLink>
                            </li>
                            <li>
                                <NavLink href="/ord">
                                    Ord
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="user">
                        <HeaderUser />
                    </li>
                </ul>
            </nav>
        </header>
    );
}