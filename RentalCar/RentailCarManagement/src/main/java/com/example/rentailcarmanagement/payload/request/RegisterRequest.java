package com.example.rentailcarmanagement.payload.request;

import com.example.rentailcarmanagement.utils.Constant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = Constant.ME003)
    @Pattern(regexp = Constant.USERNAME_REGEX, message = "username must not contains invalid characters")
    private String name;

    @NotBlank(message = Constant.ME003)
    @Pattern( regexp = Constant.EMAIL_REGEX,message = Constant.ME002)
    private String email;

    @NotBlank(message = Constant.ME003)
    @Pattern(regexp = Constant.PHONE_REGEX, message = "Phone only contain '+' or numeric character")
    private String phone;

    @NotBlank(message = Constant.ME003)
    @Pattern(regexp = Constant.PASSWORD_REGEX,
            message = Constant.ME014)
    private String password;

    @NotBlank(message = Constant.ME003)
    @Pattern(regexp = Constant.PASSWORD_REGEX)
    private String confirmPassword;

    @NotBlank(message = Constant.ME003)
    private String role;
}
