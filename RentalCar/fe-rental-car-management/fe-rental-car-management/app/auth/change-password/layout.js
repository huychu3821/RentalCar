import Footer from "@/components/layout/footer";
import ForgotPasswordHeader from "@/components/layout/forgot-password-header";

export default function Layout({ children }) {
    return (
        <>
            <ForgotPasswordHeader></ForgotPasswordHeader>
            {children}
            <Footer />
        </>
    );
}