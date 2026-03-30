import BeritaArtikel from "@/Components/Elements/BeritaArtikel";
import HeroYayasan from "@/Components/Elements/HeroYayasan";
import HubungiKami from "@/Components/Elements/HubungiKami";
import TentangYayasan from "@/Components/Elements/TentangYayasan";
import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";

export default function Beranda() {
    return (
        <>
            <Head title="Beranda" />
            <Layout>

                <HeroYayasan/>
                
                <TentangYayasan/>

                <BeritaArtikel/>

                <HubungiKami/>
                
            </Layout>
        </>
    );
}
