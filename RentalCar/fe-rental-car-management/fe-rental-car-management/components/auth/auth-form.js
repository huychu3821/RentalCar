'use client';

import LoginForm from './login-form';
import RegisterForm from './register-form';

export default function AuthForm() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-5">
                    <LoginForm />
                </div>

                <div className="col-md-1" />

                <div className="col-md-5">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
