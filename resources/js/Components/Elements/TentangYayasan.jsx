const TentangYayasan = () => {
    return (
        <div className="mx-44 flex max-w-7xl items-center justify-between gap-12 bg-white px-6 py-24 lg:px-12">
            {/* Kolase gambar */}
            <div className="shrink-0">
                <div className="grid w-fit grid-cols-2 gap-3">
                    {/* Kiri */}
                    <div className="flex flex-col gap-3 mt-5">
                        <div className="flex h-[276px] w-[276px] items-center justify-center overflow-hidden rounded-[18px] bg-[#2298B5] shadow-sm">
                            <img
                                src="/images/image1.png"
                                alt="Activity"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="flex h-[128px] w-[276px] items-center justify-center overflow-hidden rounded-[18px] bg-[#D89322] shadow-sm">
                            <img
                                src="/images/image2.png"
                                alt="Icon"
                                className="h-8 w-8 object-contain"
                            />
                        </div>
                    </div>

                    {/* Kanan */}
                    <div className="flex flex-col gap-3">
                        <div className="h-[192px] w-[276px] overflow-hidden rounded-[18px] shadow-sm">
                            <img
                                src="/images/image3.png"
                                alt="Kelas"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="h-[256px] w-[276px] overflow-hidden rounded-[18px] shadow-sm">
                            <img
                                src="/images/image4.png"
                                alt="Guru"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Konten teks */}
            <div className="max-w-2xl">
                <h2 className="text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
                    Dedikasi untuk Inklusi dan Spiritualitas
                </h2>

                <p className="mt-5 text-base leading-8 text-slate-600 lg:text-lg">
                    Didirikan dengan semangat kasih sayang, Yayasan Bhakti Arumi
                    Delangga hadir sebagai jembatan bagi anak-anak berkebutuhan
                    khusus, khususnya teman Tuli dan Autis, untuk mendapatkan
                    hak pendidikan agama dan umum yang setara.
                </p>

                {/* Sejarah */}
                <div className="flex mt-6">
                    <div className="w-12 h-8 rounded-md bg-[#E6EFFB] flex items-center justify-center">
                        <svg
                            width="20"
                            height="16"
                            viewBox="0 0 20 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6.5 16C5.95 16 5.47917 15.8042 5.0875 15.4125C4.69583 15.0208 4.5 14.55 4.5 14V11H7.5V8.75C6.91667 8.71667 6.3625 8.5875 5.8375 8.3625C5.3125 8.1375 4.83333 7.8 4.4 7.35V6.25H3.25L0 3C0.6 2.23333 1.34167 1.69167 2.225 1.375C3.10833 1.05833 4 0.9 4.9 0.9C5.35 0.9 5.7875 0.933333 6.2125 1C6.6375 1.06667 7.06667 1.19167 7.5 1.375V0H19.5V13C19.5 13.8333 19.2083 14.5417 18.625 15.125C18.0417 15.7083 17.3333 16 16.5 16H6.5ZM9.5 11H15.5V13C15.5 13.2833 15.5958 13.5208 15.7875 13.7125C15.9792 13.9042 16.2167 14 16.5 14C16.7833 14 17.0208 13.9042 17.2125 13.7125C17.4042 13.5208 17.5 13.2833 17.5 13V2H9.5V2.6L15.5 8.6V10H14.1L11.25 7.15L11.05 7.35C10.8167 7.58333 10.5708 7.79167 10.3125 7.975C10.0542 8.15833 9.78333 8.3 9.5 8.4V11ZM4.1 4.25H6.4V6.4C6.6 6.53333 6.80833 6.625 7.025 6.675C7.24167 6.725 7.46667 6.75 7.7 6.75C8.08333 6.75 8.42917 6.69167 8.7375 6.575C9.04583 6.45833 9.35 6.25 9.65 5.95L9.85 5.75L8.45 4.35C7.96667 3.86667 7.425 3.50417 6.825 3.2625C6.225 3.02083 5.58333 2.9 4.9 2.9C4.56667 2.9 4.25 2.925 3.95 2.975C3.65 3.025 3.35 3.1 3.05 3.2L4.1 4.25ZM13.5 13H6.5V14H13.65C13.6 13.85 13.5625 13.6917 13.5375 13.525C13.5125 13.3583 13.5 13.1833 13.5 13ZM6.5 14C6.5 13.85 6.5 13.6917 6.5 13.525C6.5 13.3583 6.5 13.1833 6.5 13C6.5 13.1667 6.5 13.3333 6.5 13.5C6.5 13.6667 6.5 13.8333 6.5 14Z"
                                fill="#025EDB"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-col ml-4">
                        <span className="text-lg font-bold">
                            Sejarah Singkat
                        </span>

                        <span className="text-base text-slate-600">
                            Berawal dari komunitas kecil yang peduli akan
                            literasi Al-Quran bagi teman tuli.
                        </span>
                    </div>
                </div>

                {/* Misi */}
                <div className="flex mt-5">
                    <div className="w-12 h-8 rounded-md bg-[#E6EFFB] flex items-center justify-center">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18ZM10 16C8.33333 16 6.91667 15.4167 5.75 14.25C4.58333 13.0833 4 11.6667 4 10C4 8.33333 4.58333 6.91667 5.75 5.75C6.91667 4.58333 8.33333 4 10 4C11.6667 4 13.0833 4.58333 14.25 5.75C15.4167 6.91667 16 8.33333 16 10C16 11.6667 15.4167 13.0833 14.25 14.25C13.0833 15.4167 11.6667 16 10 16ZM10 14C11.1 14 12.0417 13.6083 12.825 12.825C13.6083 12.0417 14 11.1 14 10C14 8.9 13.6083 7.95833 12.825 7.175C12.0417 6.39167 11.1 6 10 6C8.9 6 7.95833 6.39167 7.175 7.175C6.39167 7.95833 6 8.9 6 10C6 11.1 6.39167 12.0417 7.175 12.825C7.95833 13.6083 8.9 14 10 14ZM10 12C9.45 12 8.97917 11.8042 8.5875 11.4125C8.19583 11.0208 8 10.55 8 10C8 9.45 8.19583 8.97917 8.5875 8.5875C8.97917 8.19583 9.45 8 10 8C10.55 8 11.0208 8.19583 11.4125 8.5875C11.8042 8.97917 12 9.45 12 10C12 10.55 11.8042 11.0208 11.4125 11.4125C11.0208 11.8042 10.55 12 10 12Z"
                                fill="#025EDB"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-col ml-4">
                        <span className="text-lg font-bold">Misi Utama</span>

                        <span className="text-base text-slate-600">
                            Mewujudkan ekosistem pendidikan inklusif berbasis
                            nilai-nilai keislaman dan kemandirian.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TentangYayasan;
