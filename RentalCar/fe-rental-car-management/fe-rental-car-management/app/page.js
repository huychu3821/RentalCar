import GuestHome from '@/components/homepage/guest-home';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export default function Page() {
    return (
        <>
            <Navbar />
            <GuestHome />
            <Footer />
        </>
    );
}
