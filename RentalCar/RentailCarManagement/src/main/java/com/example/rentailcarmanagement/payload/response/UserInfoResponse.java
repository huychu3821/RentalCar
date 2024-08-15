package com.example.rentailcarmanagement.payload.response;

import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserInfoResponse {
    private String name;

    private String email;

    private String phone;

    private LocalDate dob;

    private String nationalId;

    private String detailAddress;

    private String ward;

    private String district;

    private String city;

    private String driverLicense;

    private boolean isUpdated;

    private String role;
}
