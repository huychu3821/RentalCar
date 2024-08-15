import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/app/app-provider';

export default function LoginForm() {
    const { setSessionToken } = useAppContext();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            }).then(async (res) => {
                const payload = await res.json();
                const data = {
                    status: res.status,
                    payload,
                };
                if (!res.ok) {
                    // throw data;
                    setError('Username or password incorrect!');
                    return;
                }
                return data;
            });

            if (result) {
                const resultFromNextServer = await fetch('/api/auth', {
                    method: 'POST',
                    body: JSON.stringify(result),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(async (res) => {
                    const payload = await res.json();
                    const data = {
                        status: res.status,
                        payload,
                    };
                    if (!res.ok) {
                        throw data;
                    }
                    return data;
                });
                setSessionToken(resultFromNextServer.payload.token);
                if (resultFromNextServer.payload.roles.includes('CUSTOMER')) {
                    router.push('/customer');
                    window.location.reload()
                } else {
                    router.push('/owner');
                    window.location.reload()
                }
            }
        } catch (error) {
            setError(error || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form id="login-form" className="text-center" method="post" onSubmit={handleSubmit}>
            <h2 className="mt-3">LOG IN USING YOUR ACCOUNT</h2>

            <input
                type="email"
                name="email"
                id="email"
                className="form-control mt-4"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
            />

            <input
                type="password"
                name="password"
                id="password"
                className="form-control mt-4"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />

            {error && <div className="alert alert-danger mt-2">{error}</div>}

            <div className="mt-2">
                <Link href="/auth/forgot-password" className="fst-italic">
                    Forgot your password?
                </Link>
            </div>

            <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                {loading ? (
                    <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    ></span>
                ) : (
                    <span>
                        <i className="bi bi-person fs-4 me-2"></i>
                    </span>
                )}
                LOG IN
            </button>
        </form>
    );
}
