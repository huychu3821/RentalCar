import { useState } from 'react';

export default function PersonalSecurity(data) {
    const [topUpLoading, setTopUpLoading] = useState(false);

    const [passwordFormRequest, setPasswordFormRequest] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setPasswordFormRequest((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            alert(validateForm());
            return;
        }

        passwordFormRequest.email = data.data.email;
        try {
            setTopUpLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/forgot-password/change-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(passwordFormRequest),
                },
            );

            const result = await response.json();
            if (result.status == 200) {
                alert('Reset password successfully');
                window.location.reload();
            } else {
                alert('Reset password failed: ' + result.status);
                window.location.reload();
            }
        } catch (e) {
            alert('An error occurred during reset: ' + e.message);
            window.location.reload();
        }
    };
    const validateForm = () => {
        if (!passwordFormRequest.password || !passwordFormRequest.confirmPassword) {
            return 'Please enter both a password and confirm password';
        }

        const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d).{7,}$/);
        if (!regex.test(passwordFormRequest.password)) {
            return 'Password must use at least one number, one numeral, and seven characters.';
        }

        if (passwordFormRequest.password !== passwordFormRequest.confirmPassword) {
            return 'New password and Confirm password don’t match.';
        }
    };

    return (
        <>
            <div className="container-fluid my-4">
                <h5>Change password</h5>

                <form method="post" onSubmit={handleSubmit}>
                    <div className="row mx-3 col-md-3 mt-4">
                        <label className="fw-bold mt-2">
                            New Password: <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleOnChange}
                            className="form-control border border-dark"
                        />

                        <label className="fw-bold my-3">
                            Confirm Password: <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            onChange={handleOnChange}
                            className="form-control border border-dark"
                        />
                    </div>

                    <div className="d-flex justify-content-center mb-5 mt-2">
                        <button
                            className="btn btn-link ms-2 mx-3"
                            type="reset"
                            // onClick={(event) => handleOnClickDiscardChange(event)}
                            disabled={topUpLoading}
                        >
                            Discard
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={topUpLoading}>
                            {topUpLoading ? (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            ) : null}
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
