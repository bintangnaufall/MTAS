import Footer from '@/Components/Elements/Footer'
import Nav from '@/Components/Elements/Nav'

const Layout = ({ children }) => {
    return (
        <>
            <Nav />

            <main>
                {children}
            </main>

            <Footer/>
        </>
    )
}

export default Layout