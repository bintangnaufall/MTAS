import React from "react";
import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import HeroYayasan from "@/Components/Elements/HeroYayasan";
import TentangYayasan from "@/Components/Elements/TentangYayasan";
import StatistikDampak from "@/Components/Elements/StatistikDampak";
import LayananJbi from "@/Components/Elements/LayananJbi";
import BeritaTerbaru from "@/Components/Elements/BeritaTerbaru";
import CtaPendaftaran from "@/Components/Elements/CtaPendaftaran";
import HubungiKami from "@/Components/Elements/HubungiKami";

export default function Beranda({ beritaList = [] }) {
    return (
        <>
            <Head title="Beranda - Yayasan Bhakti Arumi Delangga (MTAS)" />
            <Layout>
                {/* 1. Hero Banner Utama */}
                <HeroYayasan />

                {/* 2. Profil Singkat & Dedikasi Yayasan */}
                <TentangYayasan />

                {/* 3. Statistik Dampak & Nilai Keunggulan Yayasan */}
                <StatistikDampak />

                {/* 4. Layanan Juru Bahasa Isyarat (JBI) */}
                <section className="py-12 lg:py-16 bg-gradient-to-b from-[#F7F9FB] to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <LayananJbi />
                    </div>
                </section>

                {/* 5. Kabar & Berita Terkini */}
                <BeritaTerbaru beritaList={beritaList} />

                {/* 5. Ajakan Pendaftaran Santri Baru (PSB) */}
                <CtaPendaftaran />

                {/* 6. Pusat Layanan Informasi & Kontak Yayasan */}
                <HubungiKami />
            </Layout>
        </>
    );
}
