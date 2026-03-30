import { Link } from '@inertiajs/react'
import React from 'react'
import MenuNavbar from '../Fragments/MenuNavbar'

const Nav = () => {
    return (
        <div className="px-48 py-5 bg-[#E6EFFB]/30">
            <div className="flex rounded-full w-full border h-[60px] bg-white items-center justify-between px-6 shadow-sm">
                
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img 
                        src="/images/YBAD_logo.png" 
                        alt="LOGO MTAS"
                        className="w-12"
                    />

                    <span className="text-lg font-bold text-[#025EDB]">
                        Yayasan Bhakti Arumi Delangga
                    </span>
                </div>

                {/* Menu */}
                <MenuNavbar/>

                <div className='flex items-center justify-center bg-[#025EDB] text-md text-white rounded-full px-5 py-2'>
                    Daftar
                </div>
            </div>
        </div>
    )
}

export default Nav