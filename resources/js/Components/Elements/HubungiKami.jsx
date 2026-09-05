import { usePage } from "@inertiajs/react";

const HubungiKami = () => {
    const { siteSettings = {} } = usePage().props;

    const address = siteSettings.contact_address || "Jl. Arumi Delangga No. 45, Pontianak, Kalimantan Barat, 78124";
    const phone = siteSettings.contact_phone || "+62 812-3456-7890";
    const email = siteSettings.contact_email || "info@bhaktiarumi.org";
    const mapsEmbed = siteSettings.contact_maps_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818306205265!2d109.29831447504716!3d-0.004823399995131069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d59004168efe5%3A0xe11682bb87d3b8e!2sMaktab%20Tuli%20As-Sami!5e0!3m2!1sid!2sid!4v1774763779878!5m2!1sid!2sid";

    return (
        <div className="xl:flex xl:flex-row flex flex-col xl:px-48 px-4 py-16 xl:py-24 xl:gap-x-14">
            {/* Google Maps (Desktop) */}
            <div className="xl:w-1/2 rounded-lg overflow-hidden shadow xl:flex hidden">
                <iframe
                    src={mapsEmbed}
                    width="100%"
                    height="400"
                    loading="lazy"
                    className="rounded-md border-0"
                    title="Google Maps Yayasan Bhakti Arumi"
                ></iframe>
            </div>

            {/* Kontak Info */}
            <div className="xl:w-1/2 flex flex-col xl:py-0 py-8 justify-center text-gray-800">
                <h2 className="xl:text-3xl text-2xl text-center xl:text-left font-bold mb-8 text-slate-900">
                    Hubungi Kami
                </h2>

                {/* Alamat */}
                <div className="flex items-start mb-6">
                    <div className="p-2.5 rounded-lg bg-[#FFEDD5] justify-center items-center flex mr-3 shrink-0">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M14.7138 13.8808L11.178 17.4167C10.8657 17.7293 10.442 17.9049 10.0001 17.9049C9.55822 17.9049 9.13447 17.7293 8.82217 17.4167L5.28551 13.8808C2.68211 11.2773 2.68218 7.05627 5.28567 4.45283C7.88916 1.84938 12.1102 1.84938 14.7137 4.45283C17.3172 7.05627 17.3172 11.2773 14.7138 13.8808V13.8808"
                                stroke="#F39C12"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12.5 9.16675C12.5 10.5465 11.3798 11.6667 10 11.6667C8.62021 11.6667 7.5 10.5465 7.5 9.16675C7.5 7.78696 8.62021 6.66675 10 6.66675C11.3798 6.66675 12.5 7.78696 12.5 9.16675V9.16675"
                                stroke="#F39C12"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div>
                        <p className="xl:text-lg text-sm font-bold mb-1 text-slate-900">
                            Alamat
                        </p>
                        <p className="xl:text-base text-xs text-slate-600 leading-relaxed">
                            {address}
                        </p>
                    </div>
                </div>

                {/* Telepon */}
                <div className="flex items-start mb-6">
                    <div className="p-2.5 rounded-lg bg-[#FFEDD5] justify-center items-center flex mr-3 shrink-0">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.5 4.16667C2.5 3.24619 3.24619 2.5 4.16667 2.5H6.9C7.25853 2.50027 7.5767 2.72984 7.69 3.07L8.93833 6.81417C9.0691 7.20754 8.89083 7.63722 8.52 7.8225L6.63917 8.76417C7.5611 10.8046 9.19538 12.4389 11.2358 13.3608L12.1775 11.48C12.3628 11.1092 12.7925 10.9309 13.1858 11.0617L16.93 12.31C17.2705 12.4234 17.5001 12.742 17.5 13.1008V15.8333C17.5 16.7538 16.7538 17.5 15.8333 17.5H15C8.09667 17.5 2.5 11.9033 2.5 5V4.16667V4.16667"
                                stroke="#F39C12"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div>
                        <p className="xl:text-lg text-sm font-bold mb-1 text-slate-900">
                            Telepon &amp; WhatsApp
                        </p>
                        <p className="xl:text-base text-xs text-slate-600">{phone}</p>
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                    <div className="p-2.5 rounded-lg bg-[#FFEDD5] justify-center items-center flex mr-3 shrink-0">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.5 6.66675L9.075 11.0501C9.63506 11.4237 10.3649 11.4237 10.925 11.0501L17.5 6.66675M4.16667 15.8334H15.8333C16.7538 15.8334 17.5 15.0872 17.5 14.1667V5.83341C17.5 4.91294 16.7538 4.16675 15.8333 4.16675H4.16667C3.24619 4.16675 2.5 4.91294 2.5 5.83341V14.1667C2.5 15.0872 3.24619 15.8334 4.16667 15.8334L2.5 6.66675"
                                stroke="#F39C12"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <div>
                        <p className="xl:text-lg text-sm font-bold mb-1 text-slate-900">Email</p>
                        <a
                            href={`mailto:${email}`}
                            className="text-blue-600 hover:underline xl:text-base text-xs font-medium"
                        >
                            {email}
                        </a>
                    </div>
                </div>
            </div>

            {/* Google Maps (Mobile) */}
            <div className="xl:w-1/2 rounded-lg overflow-hidden shadow xl:hidden mt-6">
                <iframe
                    src={mapsEmbed}
                    width="100%"
                    height="320"
                    loading="lazy"
                    className="rounded-md border-0"
                    title="Google Maps Yayasan Bhakti Arumi"
                ></iframe>
            </div>
        </div>
    );
};

export default HubungiKami;
