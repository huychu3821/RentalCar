package com.example.rentailcarmanagement.service.impl;

import com.example.rentailcarmanagement.entities.Account;
import com.example.rentailcarmanagement.entities.Role;
import com.example.rentailcarmanagement.entities.UserInfo;
import com.example.rentailcarmanagement.entities.Wallet;
import com.example.rentailcarmanagement.entities.enums.ERole;
import com.example.rentailcarmanagement.entities.token.ResetPasswordToken;
import com.example.rentailcarmanagement.payload.request.ForgotPasswordRequest;
import com.example.rentailcarmanagement.payload.request.RegisterRequest;
import com.example.rentailcarmanagement.repository.AccountRepository;
import com.example.rentailcarmanagement.repository.ResetPasswordTokenRepository;
import com.example.rentailcarmanagement.repository.RoleRepository;
import com.example.rentailcarmanagement.repository.UserInfoRepository;
import com.example.rentailcarmanagement.service.AccountService;
import com.example.rentailcarmanagement.service.WalletService;
import com.example.rentailcarmanagement.utils.Constant;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccountServiceImpl implements AccountService {

    private final MailSendingServiceImpl mailSendingServiceImpl;

    private final AccountRepository accountRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserInfoRepository userInfoRepository;
    private final ResetPasswordTokenRepository resetPasswordTokenRepository;

    private final RoleRepository roleRepository;

    private final WalletService walletService;

    public AccountServiceImpl(MailSendingServiceImpl mailSendingServiceImpl, AccountRepository accountRepository, PasswordEncoder passwordEncoder, UserInfoRepository userInfoRepository, ResetPasswordTokenRepository resetPasswordTokenRepository, RoleRepository roleRepository, WalletService walletService) {
        this.mailSendingServiceImpl = mailSendingServiceImpl;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.userInfoRepository = userInfoRepository;
        this.resetPasswordTokenRepository = resetPasswordTokenRepository;
        this.roleRepository = roleRepository;
        this.walletService = walletService;
    }

    @Override
    public Optional<Account> findByEmail(ForgotPasswordRequest email) {
        return accountRepository
                .findByEmail(email.getEmail());
    }

    @Override
    public void sendResetPasswordLink(Account account) {
        String token = String.valueOf(UUID.randomUUID());
        ResetPasswordToken resetPasswordToken = new ResetPasswordToken();
        resetPasswordToken.setToken(token);
        resetPasswordToken.setEmail(account.getEmail());
        resetPasswordTokenRepository.save(resetPasswordToken);
        mailSendingServiceImpl.sendResetPasswordMail(resetPasswordToken);
    }

    @Override
    public boolean resetPassword(Account account, ForgotPasswordRequest forgotPasswordRequest) {
        if (!Constant.isValidPassword(forgotPasswordRequest.getConfirmPassword())) {
            return false;
        }
        account.setPassword(passwordEncoder.encode(forgotPasswordRequest.getConfirmPassword()));
        accountRepository.save(account);
        return true;
    }

    @Override
    public Boolean existedEmail(String email) {
        return accountRepository.findByEmail(email).isPresent();
    }

    @Override
    @Transactional
    public void registerAccount(RegisterRequest request) {

        ERole er = request.getRole().equals("customer") ? ERole.CUSTOMER : ERole.OWNER;
        Role role = roleRepository.findByRole(er)
                .orElseThrow(() -> new NoSuchElementException("Role not found"));

        UserInfo userInfo = UserInfo.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .isUpdated(false).build();

        Account account = Account.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .userInfo(userInfo)
                .roles(List.of(role))
                .build();

        Wallet wallet = walletService.save(account);
        account.setWallet(wallet);
        userInfoRepository.save(userInfo);
        accountRepository.save(account);
    }

}
