const HeroYayasan = () => {
    return (
        <div className="bg-[#E6EFFB]/30">
            <div className="mx-48 pt-16 h-[650px] flex justify-center">
                {/* LEFT CONTENT */}
                <div className="flex flex-col justify-center -mt-16">
                    {/* Badge */}
                    <div className="bg-[#FBF3E6] rounded-full flex items-center gap-x-2 px-3 py-2 w-fit">
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 13 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.75 6.41667L6.32917 4.05417C6.02778 3.7625 5.77257 3.43924 5.56354 3.08437C5.35451 2.72951 5.25 2.34306 5.25 1.925C5.25 1.39028 5.43715 0.935764 5.81146 0.561458C6.18576 0.187153 6.64028 0 7.175 0C7.48611 0 7.77778 0.065625 8.05 0.196875C8.32222 0.328125 8.55556 0.505556 8.75 0.729167C8.94444 0.505556 9.17778 0.328125 9.45 0.196875C9.72222 0.065625 10.0139 0 10.325 0C10.8597 0 11.3142 0.187153 11.6885 0.561458C12.0628 0.935764 12.25 1.39028 12.25 1.925C12.25 2.34306 12.1479 2.72951 11.9438 3.08437C11.7396 3.43924 11.4868 3.7625 11.1854 4.05417L8.75 6.41667ZM8.75 4.78333L10.3396 3.22292C10.5243 3.03819 10.6944 2.84132 10.85 2.63229C11.0056 2.42326 11.0833 2.1875 11.0833 1.925C11.0833 1.71111 11.0104 1.53125 10.8646 1.38542C10.7188 1.23958 10.5389 1.16667 10.325 1.16667C10.1889 1.16667 10.0601 1.1934 9.93854 1.24688C9.81701 1.30035 9.7125 1.38056 9.625 1.4875L8.75 2.5375L7.875 1.4875C7.7875 1.38056 7.68299 1.30035 7.56146 1.24688C7.43993 1.1934 7.31111 1.16667 7.175 1.16667C6.96111 1.16667 6.78125 1.23958 6.63542 1.38542C6.48958 1.53125 6.41667 1.71111 6.41667 1.925C6.41667 2.1875 6.49444 2.42326 6.65 2.63229C6.80556 2.84132 6.97569 3.03819 7.16042 3.22292L8.75 4.78333ZM3.5 9.625L7.55417 10.7333L11.025 9.65417C10.9764 9.56667 10.9059 9.49132 10.8135 9.42813C10.7212 9.36493 10.6167 9.33333 10.5 9.33333H7.55417C7.29167 9.33333 7.08264 9.32361 6.92708 9.30417C6.77153 9.28472 6.61111 9.24583 6.44583 9.1875L5.08958 8.73542L5.41042 7.59792L6.59167 7.99167C6.75694 8.04028 6.95139 8.07917 7.175 8.10833C7.39861 8.1375 7.72917 8.15695 8.16667 8.16667C8.16667 8.05972 8.13507 7.95764 8.07187 7.86042C8.00868 7.76319 7.93333 7.7 7.84583 7.67083L4.43333 6.41667H3.5V9.625ZM0 11.6667V5.25H4.43333C4.50139 5.25 4.56944 5.25729 4.6375 5.27187C4.70556 5.28646 4.76875 5.30347 4.82708 5.32292L8.25417 6.59167C8.575 6.70833 8.83507 6.9125 9.03438 7.20417C9.23368 7.49583 9.33333 7.81667 9.33333 8.16667H10.5C10.9861 8.16667 11.3993 8.32708 11.7396 8.64792C12.0799 8.96875 12.25 9.39167 12.25 9.91667V10.5L7.58333 11.9583L3.5 10.8208V11.6667H0ZM1.16667 10.5H2.33333V6.41667H1.16667V10.5Z"
                                fill="#CD8821"
                            />
                        </svg>

                        <span className="text-sm font-semibold text-[#CD8821]">
                            Digital Sanctuary Pendidikan Inklusif
                        </span>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col mt-5">
                        <div className="flex gap-x-3">
                            <span className="text-7xl font-bold text-[#CD8821]">
                                Yayasan
                            </span>
                            <span className="text-7xl font-bold text-black">
                                Bhakti
                            </span>
                        </div>

                        <span className="text-7xl font-bold text-[#025EDB]">
                            Arumi Delangga
                        </span>
                    </div>

                    {/* Description */}
                    <div className="w-[554px] mt-5">
                        <span className="text-xl font-normal">
                            Memperjuangkan hak-hak penyandang disabilitas secara
                            menyeluruh, mencakup pendidikan, pekerjaan,
                            kesehatan, dan dukungan psikologis.
                        </span>
                    </div>

                    {/* Button */}
                    <div className="flex mt-5 gap-x-4">
                        <button className="bg-[#025EDB] text-white text-base font-bold rounded-full px-8 py-4">
                            Tentang Yayasan
                        </button>

                        <button className="bg-white text-[#025EDB] text-base font-bold rounded-full px-8 py-4 border border-[#025EDB]/20">
                            Daftar Santri
                        </button>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="relative inline-block ml-24 mt-6">
                    <div className="rounded-[28px] border-[6px] border-white bg-[#123a56] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                        <img
                            src="/images/hero_foto.png"
                            alt="Hero Foto"
                            className="h-[460px] w-[460px] rounded-[22px] object-cover"
                        />
                    </div>

                    {/* Card */}
                    <div className="absolute bottom-[60px] left-[-20px] rounded-[16px] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.14)]">
                        <p className="text-sm font-bold text-[#1D4ED8]">
                            69 Santri
                        </p>

                        <p className="text-[11px] text-slate-500">
                            Telah bergabung bersama kami...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroYayasan;
