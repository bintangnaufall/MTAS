const HubungiKami = () => {
    return (
        <div className="flex px-48 py-24 gap-x-14">
            {/* Google Maps */}
            <div className="w-1/2 rounded-lg overflow-hidden shadow">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818306205265!2d109.29831447504716!3d-0.004823399995131069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d59004168efe5%3A0xe11682bb87d3b8e!2sMaktab%20Tuli%20As-Sami!5e0!3m2!1sid!2sid!4v1774763779878!5m2!1sid!2sid"
                    width="100%"
                    height="400"
                    loading="lazy"
                    className="rounded-md"
                ></iframe>
            </div>

            {/* Kontak */}
            <div className="w-1/2 flex flex-col justify-center text-gray-800">
                <h2 className="text-3xl font-bold mb-8">Hubungi Kami</h2>

                {/* Alamat */}
                <div className="flex items-start mb-6">
                    <svg
                        width="22"
                        height="23"
                        viewBox="0 0 20 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-1 mr-3 shrink-0"
                    >
                        <path
                            d="M2.5 20H6.25V12.5H13.75V20H17.5V8.75L10 3.125L2.5 8.75V20ZM0 22.5V7.5L10 0L20 7.5V22.5H11.25V15H8.75V22.5H0Z"
                            fill="#CD8821"
                        />
                    </svg>

                    <div>
                        <p className="text-lg font-bold mb-1">Alamat</p>

                        <p className="text-base">
                            Jl. Arumi Delangga No. 45, Kebayoran Baru, Jakarta
                            Selatan, 12140
                        </p>
                    </div>
                </div>

                {/* Telepon */}
                <div className="flex items-start mb-6">
                    <svg
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-1 mr-3 shrink-0"
                    >
                        <path
                            d="M21.1875 22.5C18.5833 22.5 16.0104 21.9323 13.4688 20.7969C10.9271 19.6615 8.61458 18.0521 6.53125 15.9688C4.44792 13.8854 2.83854 11.5729 1.70312 9.03125C0.567708 6.48958 0 3.91667 0 1.3125C0 0.9375 0.125 0.625 0.375 0.375C0.625 0.125 0.9375 0 1.3125 0H6.375C6.66667 0 6.92708 0.0989583 7.15625 0.296875C7.38542 0.494792 7.52083 0.729167 7.5625 1L8.375 5.375C8.41667 5.70833 8.40625 5.98958 8.34375 6.21875C8.28125 6.44792 8.16667 6.64583 8 6.8125L4.96875 9.875C5.38542 10.6458 5.88021 11.3906 6.45312 12.1094C7.02604 12.8281 7.65625 13.5208 8.34375 14.1875C8.98958 14.8333 9.66667 15.4323 10.375 15.9844C11.0833 16.5365 11.8333 17.0417 12.625 17.5L15.5625 14.5625C15.75 14.375 15.9948 14.2344 16.2969 14.1406C16.599 14.0469 16.8958 14.0208 17.1875 14.0625L21.5 14.9375C21.7917 15.0208 22.0312 15.1719 22.2188 15.3906C22.4062 15.6094 22.5 15.8542 22.5 16.125V21.1875C22.5 21.5625 22.375 21.875 22.125 22.125C21.875 22.375 21.5625 22.5 21.1875 22.5Z"
                            fill="#CD8821"
                        />
                    </svg>

                    <div>
                        <p className="text-lg font-bold mb-1">
                            Telepon & WhatsApp
                        </p>

                        <p className="text-base">+62 812-3456-7890 (Admin)</p>
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                    <svg
                        width="25"
                        height="20"
                        viewBox="0 0 25 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-1 mr-3 shrink-0"
                    >
                        <path
                            d="M2.5 20C1.8125 20 1.22396 19.7552 0.734375 19.2656C0.244792 18.776 0 18.1875 0 17.5V2.5C0 1.8125 0.244792 1.22396 0.734375 0.734375C1.22396 0.244792 1.8125 0 2.5 0H22.5C23.1875 0 23.776 0.244792 24.2656 0.734375C24.7552 1.22396 25 1.8125 25 2.5V17.5C25 18.1875 24.7552 18.776 24.2656 19.2656C23.776 19.7552 23.1875 20 22.5 20H2.5ZM12.5 11.25L2.5 5V17.5H22.5V5L12.5 11.25ZM12.5 8.75L22.5 2.5H2.5L12.5 8.75Z"
                            fill="#CD8821"
                        />
                    </svg>

                    <div>
                        <p className="text-lg font-bold mb-1">Email</p>

                        <a
                            href="mailto:info@arumidelangga.or.id"
                            className="text-blue-600 hover:underline"
                        >
                            info@arumidelangga.or.id
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HubungiKami;
