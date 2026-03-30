import { Link, usePage } from "@inertiajs/react";

const MenuNavbar = () => {
    const { url } = usePage();

    const menu = [
        { name: "Beranda", href: "/" },
        { name: "Maktab Tuli", href: "/MaktabTuli" },
        { name: "Berita", href: "/Berita" },
        { name: "Program", href: "/Program" },
        { name: "Galeri", href: "/galeri" },
        { name: "Kontak", href: "/kontak" },
    ];

    return (
        <div className="flex gap-x-8">
            {menu.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={`text-md transition ${
                        url === item.href
                            ? "text-[#025EDB] font-semibold border-b-2 border-[#025EDB] pb-1"
                            : "text-[#64748B] hover:text-[#025EDB]"
                    }`}
                >
                    {item.name}
                </Link>
            ))}
        </div>
    );
};

export default MenuNavbar;