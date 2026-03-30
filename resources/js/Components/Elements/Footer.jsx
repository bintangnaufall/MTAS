import { Link } from "@inertiajs/react";
import React from "react";

const Footer = () => {
    return (
        <>
            <div className="border-t-2 border-[#025EDB]/10 w-full flex py-14 px-48 gap-x-14">
                <div className="flex flex-col w-1/4">
                    <span className="text-[#025EDB] text-lg font-bold">
                        Yayasan Bhakti Arumi Delangga
                    </span>
                    <span className="text-sm text-[#44474E] py-6">
                        Menciptakan ruang belajar yang aman dan memberdayakan
                        bagi teman Tuli dan Autis melalui pendidikan berbasis
                        nilai- nilai kemanusiaan.
                    </span>
                    <div className="flex gap-x-3">
                        {/* Instagram */}
                        <a
                            href={
                                "https://www.instagram.com/maktabtuliassami.id/"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#025EDB]/10 rounded-2xl w-[40px] h-[40px] justify-center flex items-center"
                        >
                            <svg
                                fill="#025EDB"
                                width="30px"
                                height="30px"
                                viewBox="0 0 32 32"
                                id="Camada_1"
                                version="1.1"
                                xmlSpace="preserve"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                            >
                                <g>
                                    <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z" />

                                    <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8   c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z" />

                                    <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8   c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z" />
                                </g>
                            </svg>
                        </a>
                        {/* Tiktok */}
                        <a
                            href={"https://www.tiktok.com/@maktabtuliassami.id"}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="bg-[#025EDB]/10 rounded-2xl w-[40px] h-[40px] flex justify-center items-center"
                        >
                            <svg
                                width="30px"
                                height="30px"
                                viewBox="0 0 23 28"
                                fill="#025EDB"
                                className="mt-1"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16.8218 5.1344C16.0887 4.29394 15.648 3.19805 15.648 2H14.7293C14.9659 3.3095 15.7454 4.43326 16.8218 5.1344Z"
                                    fill="#025EDB"
                                />
                                <path
                                    d="M8.3218 11.9048C6.73038 11.9048 5.43591 13.2004 5.43591 14.7931C5.43591 15.903 6.06691 16.8688 6.98556 17.3517C6.64223 16.8781 6.43808 16.2977 6.43808 15.6661C6.43808 14.0734 7.73255 12.7778 9.324 12.7778C9.62093 12.7778 9.90856 12.8288 10.1777 12.9124V9.40192C9.89927 9.36473 9.61628 9.34149 9.324 9.34149C9.27294 9.34149 9.22654 9.34614 9.1755 9.34614V12.0394C8.90176 11.9558 8.61873 11.9048 8.3218 11.9048Z"
                                    fill="#025EDB"
                                />
                                <path
                                    d="M19.4245 6.67608V9.34614C17.6429 9.34614 15.9912 8.77501 14.6456 7.80911V14.7977C14.6456 18.2851 11.8108 21.127 8.32172 21.127C6.97621 21.127 5.7235 20.6998 4.69812 19.98C5.8534 21.2198 7.50049 22 9.32392 22C12.8083 22 15.6478 19.1627 15.6478 15.6707V8.68211C16.9933 9.64801 18.645 10.2191 20.4267 10.2191V6.78293C20.0787 6.78293 19.7446 6.74574 19.4245 6.67608Z"
                                    fill="#025EDB"
                                />
                                <path
                                    d="M14.6456 14.7977V7.80911C15.9912 8.77501 17.6429 9.34614 19.4245 9.34614V6.67608C18.3945 6.45788 17.4899 5.90063 16.8218 5.1344C15.7454 4.43326 14.9704 3.3095 14.7245 2H12.2098L12.2051 15.7775C12.1495 17.3192 10.8782 18.5591 9.32393 18.5591C8.35884 18.5591 7.50977 18.0808 6.98085 17.3564C6.06219 16.8688 5.4312 15.9076 5.4312 14.7977C5.4312 13.205 6.72567 11.9094 8.31708 11.9094C8.61402 11.9094 8.90168 11.9605 9.17079 12.0441V9.35079C5.75598 9.42509 3 12.2298 3 15.6707C3 17.3331 3.64492 18.847 4.69812 19.98C5.7235 20.6998 6.97621 21.127 8.32172 21.127C11.8061 21.127 14.6456 18.2851 14.6456 14.7977Z"
                                    fill="#025EDB"
                                />
                            </svg>
                        </a>
                        {/* Youtube */}
                        <a
                            href={"https://www.youtube.com/@MaktabTuliAsSami"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#025EDB]/10 rounded-2xl w-[40px] h-[40px] flex justify-center items-center"
                        >
                            <svg
                                width="30px"
                                height="30px"
                                viewBox="0 -0.5 25 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M18.168 19.0028C20.4724 19.0867 22.41 17.29 22.5 14.9858V9.01982C22.41 6.71569 20.4724 4.91893 18.168 5.00282H6.832C4.52763 4.91893 2.58998 6.71569 2.5 9.01982V14.9858C2.58998 17.29 4.52763 19.0867 6.832 19.0028H18.168Z"
                                    stroke="#025EDB"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12.008 9.17784L15.169 11.3258C15.3738 11.4454 15.4997 11.6647 15.4997 11.9018C15.4997 12.139 15.3738 12.3583 15.169 12.4778L12.008 14.8278C11.408 15.2348 10.5 14.8878 10.5 14.2518V9.75184C10.5 9.11884 11.409 8.77084 12.008 9.17784Z"
                                    stroke="#025EDB"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col w-1/4">
                    <span className="text-[#1A1C1E] text-md font-bold mb-6">
                        Tautan Cepat
                    </span>
                    <Link
                        href={"/beranda"}
                        className="text-sm text-[#44474E] font-normal mb-4"
                    >
                        Beranda
                    </Link>
                    <Link
                        href={"/beranda"}
                        className="text-sm text-[#44474E] font-normal mb-4"
                    >
                        Maktab Tuli
                    </Link>
                    <Link
                        href={"/beranda"}
                        className="text-sm text-[#44474E] font-normal mb-4"
                    >
                        Berita
                    </Link>
                    <Link
                        href={"/beranda"}
                        className="text-sm text-[#44474E] font-normal mb-4"
                    >
                        Program
                    </Link>
                </div>
                <div className="flex flex-col w-1/4">
                    <span className="text-[#1A1C1E] text-md font-bold mb-6">
                        Program Kami
                    </span>
                    <Link
                        href={"/beranda"}
                        className="text-sm text-[#44474E] font-normal mb-4"
                    >
                        Maktab Tuli As-Sami
                    </Link>
                    <Link
                        href={"/beranda"}
                        className="text-sm text-[#44474E] font-normal mb-4"
                    >
                        Maktab Autis
                    </Link>
                    <Link
                        href={"/beranda"}
                        className="text-sm text-[#44474E] font-normal mb-4"
                    >
                        Pelatihan UMKM
                    </Link>
                    <Link
                        href={"/beranda"}
                        className="text-sm text-[#44474E] font-normal mb-4"
                    >
                        Konsultasi Psikologis
                    </Link>
                </div>
                <div className="flex flex-col w-1/4">
                    <span className="text-[#1A1C1E] text-md font-bold mb-6">
                        Pendaftar Santri
                    </span>
                    <span className="text-sm text-[#44474E] font-normal">
                        Yuk gabung jadi santri, belajar seru bareng teman dan
                        ustadz keren! 😄
                    </span>

                    <Link
                        href={"/beranda"}
                        className="text-md text-white font-normal mb-4 bg-[#025EDB] w-fit h-fit py-2 px-4 rounded-3xl mt-4"
                    >
                        Formulir Pendaftaran
                    </Link>
                </div>
            </div>
            <div className="flex py-8 px-48 border-t-2 border-[#025EDB]/5">
                <span className="text-xs">
                    © 2026 Yayasan Bhakti Arumi Delangga. Digital Sanctuary
                    Design. All rights reserved.
                </span>
            </div>
        </>
    );
};

export default Footer;
