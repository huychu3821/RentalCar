'use client'
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { LocationProvider } from './SearchContext';

export default function Layout({ children }) {
    return (
        <>
            <LocationProvider>
                <Header />
                {children}
                <Footer />
            </LocationProvider>
        </>
    );
}
