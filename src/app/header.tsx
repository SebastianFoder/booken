'use client';

import NavLink from "@/components/navlink";
import HeaderUser from "./lib/headerUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

export default function Header() {
    useEffect(() => {

        const hamburgerMenu = document.querySelector(".hamburger-menu");
        const navLinks = document.querySelectorAll("nav a");

        const toggleMenu = () => {
            hamburgerMenu?.classList.toggle("open");
        };

        hamburgerMenu?.addEventListener("click", toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (hamburgerMenu?.classList.contains("open")) {
                    toggleMenu();
                }
            });
        });

        return () => {
            hamburgerMenu?.removeEventListener("click", toggleMenu);
            navLinks.forEach(link => {
                link.removeEventListener("click", toggleMenu);
            });
        };
    }, []);
    return (
        <header>
            <nav>
                <button className="hamburger-menu">
                    <FontAwesomeIcon className="hamburger-bars" icon={faBars} />
                    <FontAwesomeIcon className="hamburger-xmark" icon={faXmark} />
                </button>
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