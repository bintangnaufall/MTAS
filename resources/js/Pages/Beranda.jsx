import React from "react";
import { Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import HeroYayasan from "@/Components/Elements/HeroYayasan";
import TentangYayasan from "@/Components/Elements/TentangYayasan";
import StatistikDampak from "@/Components/Elements/StatistikDampak";
import BeritaTerbaru from "@/Components/Elements/BeritaTerbaru";

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

                {/* 4. Kabar & Berita Terkini */}
                <BeritaTerbaru beritaList={beritaList} />
            </Layout>
        </>
    );
}
