package com.example.rentailcarmanagement.controller;

import com.example.rentailcarmanagement.entities.Account;
import com.example.rentailcarmanagement.entities.token.ResetPasswordToken;
import com.example.rentailcarmanagement.payload.Response;
import com.example.rentailcarmanagement.payload.request.ForgotPasswordRequest;
import com.example.rentailcarmanagement.repository.ResetPasswordTokenRepository;
import com.example.rentailcarmanagement.service.AccountService;
import com.example.rentailcarmanagement.service.impl.AccountServiceImpl;
import com.example.rentailcarmanagement.utils.Constant;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/forgot-password")
@Slf4j
public class ForgotPasswordController {
    private final AccountService accountServiceImpl;
    private final ResetPasswordTokenRepository resetPasswordTokenRepository;

    public ForgotPasswordController(AccountServiceImpl accountServiceImpl, ResetPasswordTokenRepository resetPasswordTokenRepository) {
        this.accountServiceImpl = accountServiceImpl;
        this.resetPasswordTokenRepository = resetPasswordTokenRepository;
    }

    @PostMapping
    public ResponseEntity<?> findByEmail(@RequestBody ForgotPasswordRequest email){
        Optional<Account> accountOptional = accountServiceImpl.findByEmail(email);
        Map<Object, Object> error = new HashMap<>();
        if (accountOptional.isEmpty()){
            log.info(Constant.ME015);
            error.put("Error", Constant.ME015);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .error(error)
                            .body(null)
                            .build());
        }
        accountServiceImpl.sendResetPasswordLink(accountOptional.get());
        log.info("Reset password link sent");
        return ResponseEntity.status(HttpStatus.OK).body(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .error(error)
                        .body(null)
                        .build()
        );
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> resetPasswordLink(@PathVariable String token) {
        Map<Object, Object> error = new HashMap<>();
        ResetPasswordToken resetPasswordToken = resetPasswordTokenRepository.findByToken(token);
        if(resetPasswordToken == null){
            log.info("Token not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .error(error)
                            .body(null)
                            .build());
        }
        if (resetPasswordToken.isExpired()) {
            resetPasswordTokenRepository.delete(resetPasswordToken);
            error.put("Error",Constant.ME006);
            log.info(Constant.ME006);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Response.builder()
                            .status(HttpStatus.BAD_REQUEST.value())
                            .isSuccess(false)
                            .error(error)
                            .body(null)
                            .build()
            );
        }
        resetPasswordTokenRepository.delete(resetPasswordToken);
        log.info("Reset password link clicked. Wait for redirect.");
        return ResponseEntity.status(HttpStatus.OK).body(
                Response.builder()
                        .status(HttpStatus.OK.value())
                        .isSuccess(true)
                        .build()
        );
    }

    @PostMapping("change-password")
    public ResponseEntity<?> resetPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest){
        Optional<Account> accountOptional = accountServiceImpl.findByEmail(forgotPasswordRequest);
        Map<Object, Object> error = new HashMap<>();
        if (accountOptional.isEmpty()){
            log.info(Constant.ME015);
            error.put("error", Constant.ME015);
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Response.builder()
                                    .status(HttpStatus.NOT_FOUND.value())
                                    .isSuccess(false)
                                    .error(error)
                                    .body(null)
                                    .build());
        }
        if (!forgotPasswordRequest.getPassword().equals(forgotPasswordRequest.getConfirmPassword())){
            log.info(Constant.ME005);
            error.put("error", Constant.ME005);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Response.builder()
                                    .status(HttpStatus.BAD_REQUEST.value())
                                    .isSuccess(false)
                                    .error(error)
                                    .body(null)
                                    .build());
        }
        if(!accountServiceImpl.resetPassword(accountOptional.get(), forgotPasswordRequest)){
            log.info(Constant.ME014);
            error.put("error", Constant.ME014);
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Response.builder()
                                    .status(HttpStatus.BAD_REQUEST.value())
                                    .isSuccess(false)
                                    .error(error)
                                    .body(null)
                                    .build());
        }
        log.info("Change password successfully");
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                        Response.builder()
                                .status(HttpStatus.OK.value())
                                .isSuccess(true)
                                .error(error)
                                .body("Change password successfully")
                                .build());
    }
}
