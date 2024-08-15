package com.example.rentailcarmanagement.payload.request;

import com.example.rentailcarmanagement.utils.Constant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = Constant.ME003)
    @Pattern( regexp = Constant.EMAIL_REGEX ,message = Constant.ME002)
    private String email;

    @NotBlank(message = Constant.ME003)
    private String password;
}