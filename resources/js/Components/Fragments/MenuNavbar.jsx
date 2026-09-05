import { Link, usePage } from "@inertiajs/react";
import React from "react";

const MenuNavbar = () => {
    const { url } = usePage();

    const menu = [
        { name: "Beranda", href: "/" },
        { name: "Maktab Tuli", href: "/maktabtuli" },
        { name: "Berita", href: "/berita" },
        { name: "Galeri", href: "/galeri" },
        { name: "Kontak", href: "/kontak" },
    ];

    return (
        <div className="xl:flex hidden gap-x-8 items-center">
            {menu.map((item, index) => {
                const isActive = item.href === "/" ? url === "/" : url.startsWith(item.href);
                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={`relative py-1 text-[15px] font-semibold tracking-wide transition-all duration-300 active:scale-95 group flex flex-col items-center ${
                            isActive ? "text-[#025EDB]" : "text-[#5C6F84] hover:text-[#025EDB]"
                        }`}
                    >
                        <span>{item.name}</span>
                        {/* Smooth sliding underline under text */}
                        <span 
                            className={`absolute bottom-0 h-[2.5px] bg-[#025EDB] rounded-full transition-all duration-300 origin-center ${
                                isActive ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                            }`} 
                        />
                    </Link>
                );
            })}
        </div>
    );
};

export default MenuNavbar;