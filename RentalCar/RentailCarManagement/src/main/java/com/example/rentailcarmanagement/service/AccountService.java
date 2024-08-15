package com.example.rentailcarmanagement.service;

import com.example.rentailcarmanagement.payload.request.ForgotPasswordRequest;
import com.example.rentailcarmanagement.entities.Account;

import com.example.rentailcarmanagement.payload.request.RegisterRequest;

import java.util.Optional;

public interface AccountService {
    Boolean existedEmail(String email);
    void registerAccount(RegisterRequest request);
    Optional<Account> findByEmail(ForgotPasswordRequest email);
    void sendResetPasswordLink(Account account);
    boolean resetPassword(Account account, ForgotPasswordRequest forgotPasswordRequest);
}
