import ForgotPasswordHeader from "@/components/layout/forgot-password-header";

export default function Layout({ children }) {
    return (
        <>
            <ForgotPasswordHeader></ForgotPasswordHeader>
            {children}
        </>
    );
}