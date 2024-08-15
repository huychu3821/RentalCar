package com.example.rentailcarmanagement.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordRequest {
    private String email;
    private String password;
    private String confirmPassword;
}
